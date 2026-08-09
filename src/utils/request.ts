import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useMicroStore } from '@/store/micro'
import { getBus, isInWujie } from '@/micro/wujie'
import { BUS_EVENTS } from '@/micro/bus'

const service: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 15000,
  // 数组参数序列化为重复键，便于后端 Spring 绑定 String[]
  paramsSerializer: { indexes: null }
})

// 请求拦截：注入双 token 头
//   Authorization: Bearer <token>  -> WeiTokenFilter 读取
//   token: <token>                  -> Controller @RequestHeader String token 读取
service.interceptors.request.use((config) => {
  const micro = useMicroStore()
  if (micro.token) {
    config.headers['Authorization'] = `Bearer ${micro.token}`
    config.headers['token'] = micro.token
  }
  return config
})

// 响应拦截：拆 Result<T>（成功码 "20000"）+ 401 上报主应用
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== undefined && String(res.code) !== '20000') {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res.data !== undefined ? res.data : res
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      // 子应用不做 token refresh，统一交主应用处理登录态
      if (isInWujie()) {
        getBus().$emit(BUS_EVENTS.UNAUTHORIZED)
      } else {
        ElMessage.error('未登录或登录已失效')
      }
      return Promise.reject(error)
    }
    const msg = error.response?.data?.msg || error.message || '网络异常'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>
}

export default service
