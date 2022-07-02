/*
 * @Author: Axios封装
 * @Date: 2022-01-28 10:39:03
 * @LastEditTime: 2022-01-28 17:23:08
 * @LastEditors: kyy
 * @Description: axios 封装文件
 */
import axios from 'axios'
import qs from 'qs'
import { reactive } from 'vue'
import store from '../store'
import router from '../router/index'
// import { dataList } from '@components/aspin/data'
// import { storage } from '../storage/storage'
// import { removePending, addPending } from './pending'

interface Res {
  urls: any
  roles: any
}
// const obj: Res = reactive({
//   urls: import.meta.env.VITE_API_DOMAIN,
//   roles: storage.get(store.state.Roles)
// })
// axios.defaults.baseURL = obj.urls
axios.defaults.timeout = 5000
axios.defaults.withCredentials = false
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 允许跨域
axios.defaults.headers.post['Access-Control-Allow-Origin-Type'] = '*'

// 请求拦截器
axios.interceptors.request.use(
  function request(config: any) {
    // removePending(config) // 在请求开始前，对之前的请求做检查取消操作
    // addPending(config) // 将当前请求添加到 pending 中
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      // qs序列化
      // eslint-disable-next-line no-param-reassign
      config.data = qs.parse(config.data)
    }
    // 若是有做鉴权token , 就给头部带上token
    // if (storage.get(store.state.Roles)) {
    //   // eslint-disable-next-line no-param-reassign
    //   config.headers.Authorization = storage.get(store.state.Roles) as string
    // }
    return config
  },
  (error) => {
    // message.error(error.data.error.message)
    // return Promise.reject(error.data.error.message)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  function response(config) {
    // dataList.show = true
    // removePending(config) // 在请求结束后，移除本次请求
    if (config.status === 200 || config.status === 204) {
      setTimeout(() => {
        // dataList.show = false
      }, 1000)

      return Promise.resolve(config)
    }
    return Promise.reject(config)
  },
  // eslint-disable-next-line consistent-return
  (error: any) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          // message.error(`发出的请求有错误，服务器没有进行新建或修改数据的操作==>${error.response.status}`)
          break

        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401: // 重定向
          // message.error(`token:登录失效==>${error.response.status}:${store.state.Roles}`)
          // storage.remove(store.state.Roles)
          // storage.get(store.state.Roles)
          router.replace({
            path: '/Login'
          })
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          // message.error(`用户得到授权，但是访问是被禁止的==>${error.response.status}`)
          break
        case 404:
          // message.error(`网络请求不存在==>${error.response.status}`)
          break
        case 406:
          // message.error(`请求的格式不可得==>${error.response.status}`)
          break
        case 410:
          // message.error(`请求的资源被永久删除，且不会再得到的==>${error.response.status}`)
          break
        case 422:
          // message.error(`当创建一个对象时，发生一个验证错误==>${error.response.status}`)
          break
        case 500:
          // message.error(`服务器发生错误，请检查服务器==>${error.response.status}`)
          break
        case 502:
          // message.error(`网关错误==>${error.response.status}`)
          break
        case 503:
          // message.error(`服务不可用，服务器暂时过载或维护==>${error.response.status}`)
          break
        case 504:
          // message.error(`网关超时==>${error.response.status}`)
          break
        default:
          // message.error(`其他错误错误==>${error.response.status}`)
      }
      return Promise.reject(error.response)
    }
    store.commit('changeNetwork', false)
  }
)
export default axios

