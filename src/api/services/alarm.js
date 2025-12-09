/**
 * 告警相关 API
 */

import { get, post, put, deleteRequest } from '../request'
import { API_ENDPOINTS } from '../config'

/**
 * 获取告警列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.status - 状态筛选
 * @returns {Promise} 告警列表
 */
export function getAlarmList(params = {}) {
    return get(API_ENDPOINTS.alarm.list, params)
}

/**
 * 获取单个告警详情
 * @param {string|number} id - 告警 ID
 * @returns {Promise} 告警详情
 */
export function getAlarm(id) {
    return get(API_ENDPOINTS.alarm.get(id))
}

/**
 * 创建告警
 * @param {Object} data - 告警数据
 * @returns {Promise} 创建的告警
 */
export function createAlarm(data) {
    return post(API_ENDPOINTS.alarm.create, data)
}

/**
 * 更新告警
 * @param {string|number} id - 告警 ID
 * @param {Object} data - 更新的数据
 * @returns {Promise} 更新后的告警
 */
export function updateAlarm(id, data) {
    return put(API_ENDPOINTS.alarm.update(id), data)
}

/**
 * 删除告警
 * @param {string|number} id - 告警 ID
 * @returns {Promise}
 */
export function deleteAlarm(id) {
    return deleteRequest(API_ENDPOINTS.alarm.delete(id))
}

