/**
 * API 模块统一导出
 * 这是 API 模块的主入口文件
 */

// 导出配置
export { API_CONFIG, API_ENDPOINTS } from './config'

// 导出请求方法
export {
  request,
  get,
  post,
  put,
  patch,
  deleteRequest,
  addRequestInterceptor,
  addResponseInterceptor
} from './request'

// 导出拦截器设置
export { setupInterceptors } from './interceptors'

// 导出所有服务
export * from './services'

