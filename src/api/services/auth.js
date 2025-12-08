/**
 * 认证相关 API
 */

import { post, get } from '../request'
import { API_ENDPOINTS } from '../config'

/**
 * 用户登录
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise} 登录结果
 */
export function login(credentials) {
  return post(API_ENDPOINTS.auth.login, credentials)
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return post(API_ENDPOINTS.auth.logout)
}

/**
 * 刷新 Token
 * @returns {Promise} 新的 Token
 */
export function refreshToken() {
  return get(API_ENDPOINTS.auth.refresh)
}

