import __config from '../etc/config'
import WxResource from 'WxResource'
import Interceptors from 'Interceptors'

// class HttpResource {
//     constructor(url, paramDefaults, actions, options) {
//         Object.assign(this, {
//         	url,
//     		paramDefaults,
//     		actions,
//     		options,
//             $$basePath: __config.basePath
//         })
//         const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions || {}, this.options || {})
//         resource.setDefaults({
//             interceptors: Interceptors
//         })
//         return resource
//     }
//
//     setUrl(url) {
//     	return `${this.$$basePath}${url}`
//     }
// }
const setUrl = (url) => `${__config.basePath}${url}`

const HttpResource = (url, paramDefaults, actions, options) => {
    //console.log('resource',1111)
    const resource = new WxResource(setUrl(url), paramDefaults, actions || {}, options || {})
    resource.setDefaults({
        interceptors: Interceptors
    })
    //console.log('resource',resource)
    return resource
}

export default HttpResource