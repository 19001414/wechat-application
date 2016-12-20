import __config from '../etc/config'//引入服务器路径配置文件
import es6 from '../assets/plugins/es6-promise'//引入支持promise的插件库
//import poly from '../assets/plugins/polyfill.min.js'

class ServiceBase {
    constructor() {
        //Object.assign() 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
        Object.assign(this, {
            $$basePath: __config.basePath
        })
        this.__init()
    }

    __init() {
        const that = this

        // 方法名后缀字符串
        that.suffix = 'Request'

        // 发起请求所支持的方法
        that.instanceSource = {
            method: [
                'OPTIONS', 
                'GET', 
                'HEAD', 
                'POST', 
                'PUT', 
                'DELETE', 
                'TRACE', 
                'CONNECT',
            ]
        }

        // 遍历对象构造方法，方法名以小写字母+后缀名
        for(let key in that.instanceSource) {   
            that.instanceSource[key].forEach(function(method) {
                that[method.toLowerCase() + that.suffix] = function() {
                    return that.__getPromise(es6.Promise, that.__getResolver(that.__defaultRequest, [method, ...Array.from(arguments)], that))
                }
            })
        }
    }
    
    /**
     * __getPromise
     */
    //判断是否存在promise
    __getPromise(Promise, resolver) {
        if(Promise) return new Promise(resolver)
        throw new Error('Promise library is not supported')
    }

    /**
     * __getResolver
     */
    __getResolver(method, args, context) {
        return function(resolve, reject) {
            method.apply(context, args)(resolve, reject)
        }
    }

    /**
     * 以wx.request作为底层方法
     * @param {String} method 请求方法
     * @param {String} url    接口地址
     * @param {Object} params 请求参数
     */
    __defaultRequest(method = '', url = '', params = {}) {
        const $$header = this.setHeaders()//设置请求头
        const $$url = `${this.$$basePath}${this.$$prefix}${url}`//设置路径

        return function(resolve, reject) {
            wx.request({
                url: $$url,
                method: method,
                data: params,
                header: $$header,
                success: res => {
                    if (res.statusCode === 401) {
                        wx.removeStorageSync('token')
                    }
                    resolve(res.data)
                },
                fail: res => reject(res),
            })
        }
    }

    /*
     * 设置请求的 header , header 中不能设置 Referer
     */
    setHeaders() {
        return {
        	// 'Accept': 'application/json', 
        	// 'Content-type': 'application/json', 
            'Authorization': 'Bearer ' + wx.getStorageSync('token'), 
        }
    }
}

export default ServiceBase