const App = getApp()

Page({
    data: {
        classify: {},
        prompt: {
            hidden: !0,
        },
        topbar:['全部','推荐','价格','套餐'],
        goods: {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        }

    },
    onLoad() {
        this.goods = new App.HttpResource('/goods/:id', {id: '@id'})
        this.classify = new App.HttpResource('/classify/:id', {id: '@id'})
    },
    onShow() {
        this.onPullDownRefresh()
    },
    initData() {
        this.setData({
            classify: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                },
                paginate: {}
            }
        })
    },
    getGoods() {
        const goods = this.data.goods
        const params = goods.params

        // App.HttpService.getGoods(params)
        this.goods.queryAsync(params)
            .then(data => {
                console.log(data)
                if (data.meta.code == 0) {
                    data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
                    goods.items = [...goods.items, ...data.data.items]
                    goods.paginate = data.data.paginate
                    goods.params.page = data.data.paginate.next
                    goods.params.limit = data.data.paginate.perPage
                    this.setData({
                        goods: goods,
                        'prompt.hidden': goods.items.length,
                    })
                }
            })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/list/index', {
            type: e.currentTarget.dataset.id
        })
    },
    search() {
        App.WxService.navigateTo('/pages/search/index')
    },
    //点击切换tab下边框样式
    changeTab:function (e) {
        this.setData({
            curTab:e.currentTarget.dataset.idx
        })
    },
    getClassify() {
        const classify = this.data.classify
        const params = classify.params

        // App.HttpService.getClassify(params)
        this.classify.queryAsync(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                classify.items = [...classify.items, ...data.data.items]
                classify.paginate = data.data.paginate
                classify.params.page = data.data.paginate.next
                classify.params.limit = data.data.paginate.perPage
                this.setData({
                    classify: classify,
                    'prompt.hidden': classify.items.length,
                })
            }
        })
    },
    onPullDownRefresh() {
        this.initData()
        this.getClassify()
        this.getGoods()
    },
    onReachBottom() {
        this.lower()
    },
    lower() {
        if (!this.data.classify.paginate.hasNext) return
        this.getClassify()
    },
})