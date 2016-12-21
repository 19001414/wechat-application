Object.assign = Object.assign && typeof Object.assign === 'function' ? Object.assign : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }
Array.from = Array.from && typeof Array.from === 'function' ? Array.from : obj => [].slice.call(obj)

//import polyfill from 'assets/plugins/polyfill.min'
// console.log('Array.from', typeof Array.from)
// console.log('Object.assign', typeof Object.assign)
// import WxValidate from 'helpers/WxValidate'
// import HttpResource from 'helpers/HttpResource'
// import HttpService from 'helpers/HttpService'
// import WxService from 'helpers/WxService'
// import Tools from 'helpers/Tools'
// import Config from 'etc/config'
import __WxValidate from 'helpers/WxValidate'
import __HttpResource from 'helpers/HttpResource'
import __HttpService from 'helpers/HttpService'
import __WxService from 'helpers/WxService'
import __Tools from 'helpers/Tools'
import __Config from 'etc/config'

App({
	onLaunch() {
		console.log('onLaunch')
		//console.log('token', this.WxService.getStorageSync('token'))
		// console.log('__HttpResource', typeof __HttpResource)
		// console.log('HttpResource', typeof this.HttpResource)
		this.signIn()
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')
	},
	signIn() {
		if (this.WxService.getStorageSync('token')) return
		this.HttpService.signIn({
			username: 'admin', 
			password: '123456', 
		})
		.then(data => {
			console.log(data)
			if (data.meta.code == 0) {
				this.WxService.setStorageSync('token', data.data.token)
			}
		})
	},
	getUserInfo() {
		return this.WxService.login()
		.then(data => {
			console.log(data)
			return this.WxService.getUserInfo()
		})
		.then(data => {
			console.log(data)
			this.globalData.userInfo = data.userInfo
			return this.globalData.userInfo
		})
	},
	globalData: {
		userInfo: null
	},
	renderImage(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
	// WxValidate: WxValidate, 
	// HttpResource: HttpResource, 
	// HttpService: new HttpService, 
	// WxService: new WxService, 
	// Tools: new Tools, 
	// Config: Config, 
	WxValidate: __WxValidate, 
	HttpResource: __HttpResource, 
	HttpService: new __HttpService, 
	WxService: new __WxService, 
	Tools: new __Tools, 
	Config: __Config, 
})