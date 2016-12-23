const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        goods: {
            item: {}
        }
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onLoad(option) {
        this.goods = new App.HttpResource('/goods/:id', {id: '@id'})
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },
    addCart(e) {
        const goods = this.data.goods.item._id
        App.HttpService.addCartByUser(goods)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.showToast(data.meta.message)
            }
        })
    },
    nowBuy(e){
        const good_id = this.data.goods.item._id
        console.log(good_id)
        App.HttpService.addCartByUser(good_id)
        //App.WxService.navigateTo('/pages/cart/index',good_id)
        App.WxService.switchTab({
            url:'/pages/cart/index',
        })
    },
    previewImage(e) {
        const urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
        const index = e.currentTarget.dataset.index
        const current = urls[Number(index)]
        
        App.WxService.previewImage({
            current: current, 
            urls: urls, 
        })
    },
    showToast(message) {
        App.WxService.showModal({
            title:message,
            content:'',
            cancelText:'继续逛逛',
            confirmText:'立即结算',
        }).then(res =>{
            console.log(res)
            if(res.confirm){
                App.WxService.switchTab({
                    url:'/pages/cart/index'
                })
            }
        })
    },
    getDetail(id) {
    	// App.HttpService.getDetail(id)
        this.goods.getAsync({id: id})
        .then(data => {
        	console.log(data)
        	if (data.meta.code == 0) {
                data.data.images.forEach(n => n.path = App.renderImage(n.path))
        		this.setData({
                    'goods.item': data.data
                })
        	}
        })
    },
})