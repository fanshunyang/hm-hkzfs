/**
 * 创建自己的 axios 实例
 */

import axios from 'axios'
import { BASE_URL } from './url'
import {gainToken,removeToken} from '../utils'
// console.log('在 URL 中读取到接口地址为：', process.env.REACT_APP_URL)

// 创建 axios 实例
const API = axios.create({
  // 配置接口的公共路径
  baseURL: BASE_URL
  // baseURL: 'http://api.itcast.cn/'
})

// 进行 axios 拦截器的处理
//请求拦截器
//判断是否以/user开头并且不是登录或者注册，此时才能添加token
API.interceptors.request.use(config =>{
  // console.log('惠惠',config);
  const {url} = config
  if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
    config.headers.authorization = gainToken() 
  }
   return config
})
//响应拦截器
API.interceptors.response.use(response=>{
  const {status} =response.data
if (status === 400) {
  //这里说明token失效移除掉token
  removeToken()
}
  // console.log('响应拦截',response);
  return response
})

// 导入实例
export { API }
