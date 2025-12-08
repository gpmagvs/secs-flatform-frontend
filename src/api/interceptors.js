/**
 * API 拦截器配置
 * 在这里配置全局的请求和响应拦截器
 */

import { addRequestInterceptor, addResponseInterceptor } from './request'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../store/user'

/**
 * 配置请求拦截器
 */
export function setupRequestInterceptors() {
  // 添加 Token 到请求头
  addRequestInterceptor((config) => {
    const userStore = useUserStore()
    
    // 如果用户已登录，添加 Token
    if (userStore.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${userStore.token}`
      }
    }
    
    return config
  })
  
  // 可以添加更多请求拦截器
  // 例如：添加请求 ID、记录请求日志等
}

/**
 * 配置响应拦截器
 */
export function setupResponseInterceptors() {
  // 处理 Token 过期
  addResponseInterceptor(
    // 成功响应处理
    (response) => {
      // 可以在这里统一处理成功响应
      // 例如：提取公共数据、格式化响应等
      return response
    },
    // 错误响应处理
    async (error) => {
      // 处理 401 未授权错误（Token 过期）
      if (error.status === 401) {
        const userStore = useUserStore()
        
        // 清除用户信息
        userStore.logout()
        
        // 显示提示
        ElMessage.warning('登录已过期，请重新登录')
        
        // 可以在这里跳转到登录页
        // router.push('/login')
      }
      
      // 处理 403 禁止访问
      if (error.status === 403) {
        ElMessage.error('没有权限访问该资源')
      }
      
      // 处理 404 未找到
      if (error.status === 404) {
        ElMessage.error('请求的资源不存在')
      }
      
      // 处理 500 服务器错误
      if (error.status >= 500) {
        ElMessage.error('服务器错误，请稍后重试')
      }
      
      return Promise.reject(error)
    }
  )
}

/**
 * 初始化所有拦截器
 */
export function setupInterceptors() {
  setupRequestInterceptors()
  setupResponseInterceptors()
}

