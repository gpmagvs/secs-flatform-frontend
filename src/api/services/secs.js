/**
 * SECS 相关 API
 */

import { get, post } from '../request'
import { API_ENDPOINTS } from '../config'

/**
 * 获取 SECS 连接状态
 * @returns {Promise} SECS 状态信息
 */
export function getSecsState() {
    return get(API_ENDPOINTS.secs.state)
}

/**
 * 连接 SECS
 * @param {Object} config - 连接配置
 * @returns {Promise}
 */
export function connectSecs(config) {
    return post(API_ENDPOINTS.secs.connect, config)
}

/**
 * 断开 SECS 连接
 * @returns {Promise}
 */
export function disconnectSecs() {
    return post(API_ENDPOINTS.secs.disconnect)
}

