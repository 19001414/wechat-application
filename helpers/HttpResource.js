import __config from '../etc/config'
import WxResource from 'WxResource'

// 拦截器
const interceptors = [{
	request: function(request) {
		request.header = request.header || {}
		request.requestTimestamp = new Date().getTime()
		//console.log('interceptors', wx.getStorageSync('token'))
		if (request.url.indexOf('/api') !== -1 && wx.getStorageSync('token')) {
            request.header.Authorization = 'Bearer ' + wx.getStorageSync('token')
			// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4MzY4OTYxNGUyNzQ2NDc3MTY2YzFlNyIsImlhdCI6MTQ4MjIxNjAwNywiZXhwIjoxNDgyMjE5NjA3fQ.iqIDp--VORBLlNLLqvPc92TWMpPhNvUZMW0WTK6WZFA"
			// 
        }
		//console.log('header',request.header)
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000
		})
		return request
	},
	requestError: function(requestError) {
		wx.hideToast()
		return requestError
	},
	response: function(response) {
		response.responseTimestamp = new Date().getTime()
		if(response.statusCode === 401) {
			wx.removeStorageSync('token')
		}
		wx.hideToast()
		return response
	},
	responseError: function(responseError) {
		wx.hideToast()
		return responseError
	},
}]

// 设置请求路径
const setUrl = (url) => `${__config.basePath}${url}`

// 返回实例对象
const HttpResource = (url, paramDefaults, actions, options) => {
    const resource = new WxResource(setUrl(url), paramDefaults, actions || {}, options || {})
    resource.setDefaults({
        interceptors: interceptors
    })
    return resource
}

export default HttpResource