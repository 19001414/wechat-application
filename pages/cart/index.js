const App = getApp()

Page({
    data: {
        canEdit: !1,
        carts: {
            items: []
        },
        total:'',
        selected:[
            {select:false}
        ],
        selectedAllStatus:false,
        prompt: {
            hidden: !0,
            icon: '../../assets/images/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '来挑几件好货吧',
            buttons: [
                {
                    text: '随便逛',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    bindtap: function(e) {
        const index = e.currentTarget.dataset.index
        
        switch(index) {
            case '0':
                App.WxService.navigateBack()
                break
            default:
                break
        }
    },
    onLoad() {
        // this.sum()
    },
    onShow() {
        this.getCarts()
    },
    getCarts() {
        App.HttpService.getCartByUser()
        .then(data => {
            console.log('购物车data',data)
            if (data.meta.code == 0) {
                data.data.forEach(n => n.goods.thumb_url = App.renderImage(n.goods.images[0] && n.goods.images[0].path))
                this.setData({
                    'carts.items': data.data,
                    'prompt.hidden': data.data.length,
                })
            }
        })
    },
    bindCheckbox: function(e) {
        /*绑定点击事件，将checkbox样式改变为选中与非选中*/
        //拿到下标值，以在carts作遍历指示用
        var index = parseInt(e.currentTarget.dataset.index);
        //console.log(index)
        //原始的icon状态
        var checked = this.data.selected[index].select;
        //console.log(selected)
        var carts = this.data.selected;
        console.log(carts)
        // // 对勾选状态取反
        carts[index].select = !checked;
        // // 写回经点击修改后的数组
        this.setData({
            selected: carts
        });
        this.sum()
    },
    bindSelectAll: function() {
        // 环境中目前已选状态
        var selectedAllStatus = this.data.selectedAllStatus;
        // 取反操作
         selectedAllStatus = !selectedAllStatus;
        // 购物车数据，关键是处理selected值
        // var carts = this.data.carts;
        // // 遍历
        // for (var i = 0; i < carts.length; i++) {
        //     carts[i].selected = selectedAllStatus;
        // }
        var carts = this.data.selected
        carts[0].select = selectedAllStatus
        this.setData({
            selectedAllStatus: selectedAllStatus,
            // carts: carts
            selected:carts
        });
        this.sum()
    },
    sum: function() {
        var carts = this.data.carts.items;
        console.log(carts)
        // 计算总金额
        var total = 0;
        for (var i = 0; i < carts.length; i++) {
            // if (!carts[i].selected) {
            //     total += carts[i].totalAmount;
            //     console.log(total)
            // }
            if(this.data.selectedAllStatus){
                total += carts[i].totalAmount;
                console.log(carts[i].totalAmount)
            }
        }
        // 写回经点击修改后的数组
        this.setData({
            // carts: carts,
            total: '￥' + total
        });
    },
    onPullDownRefresh() {
        this.getCarts()
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    confirmOrder(e) {
        console.log(e)
        App.WxService.setStorageSync('confirmOrder', this.data.carts.items)
        App.WxService.navigateTo('/pages/order/confirm/index')
    },
    del(e) {
        const id = e.currentTarget.dataset.id

        App.WxService.showModal({
            title: '友情提示', 
            content: '确定要删除这个宝贝吗？', 
        })
        .then(data => {
            if (data.confirm == 1) {
                App.HttpService.delCartByUser(id)
                .then(data => {
                    console.log(data)
                    if (data.meta.code == 0) {
                        this.getCarts()
                    }
                })
            }
        })
    },
    clear() {
        App.WxService.showModal({
            title: '友情提示', 
            content: '确定要清空购物车吗？', 
        })
        .then(data => {
            if (data.confirm == 1) {
                App.HttpService.clearCartByUser()
                .then(data => {
                    console.log(data)
                    if (data.meta.code == 0) {
                        this.getCarts()
                    }
                })
            }
        })
    },
    onTapEdit(e) {
        console.log(e.currentTarget.dataset.index)
        this.setData({
            canEdit: !!e.currentTarget.dataset.value
        })
    },
    bindKeyInput(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.detail.value)
        if (total < 0 || total > 100) return
        this.putCartByUser(id, {
            total: total
        })
    },
    putCartByUser(id, params) {
        App.HttpService.putCartByUser(id, params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.getCarts()
            }
        })
    },
    decrease(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1) return
        this.putCartByUser(id, {
            total: total - 1
        })
    },
    increase(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 100) return
        this.putCartByUser(id, {
            total: total + 1
        })
    },
})