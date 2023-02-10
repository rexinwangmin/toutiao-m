// 请求模块
import axios from 'axios'
import store from '@/store'
// 处理超过 2^52 的数出现的误差
import JISONBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',

  // 自定义后端返回的原始顺序
  transformResponse: [function (data) {
    // axios默认在这里处理后端返回的数据
    // return data
    try {
      return JISONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config配置对象：本次请求的配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里要返回config ，否则请求就出不了
  return config
}, function (error) {
  // 请求出错， 还没有发出
  return Promise.reject(error)
})

// 响应拦截器

export default request
