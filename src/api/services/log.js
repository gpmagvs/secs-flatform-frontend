/**
 * 日志相关 API
 */

import { get, post } from '../request'
import { API_ENDPOINTS } from '../config'

/**
 * 获取日志历史
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.level - 日志级别
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @returns {Promise} 日志列表
 */
export function getLogHistory(params = {}) {
  return get(API_ENDPOINTS.log.history, params)
}

/**
 * 搜索日志
 * @param {Object} data - 搜索条件
 * @param {string} data.keyword - 关键词
 * @param {string} data.level - 日志级别
 * @param {string} data.startTime - 开始时间
 * @param {string} data.endTime - 结束时间
 * @returns {Promise} 搜索结果
 */
export function searchLog(data) {
  return post(API_ENDPOINTS.log.search, data)
}

