/**
 * 载具相关 API
 */

import { get } from '../request'
import { API_ENDPOINTS } from '../config'

/**
 * 获取载具列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 载具列表
 */
export function getCarrierList(params = {}) {
  return get(API_ENDPOINTS.carrier.list, params)
}

/**
 * 获取单个载具详情
 * @param {string|number} id - 载具 ID
 * @returns {Promise} 载具详情
 */
export function getCarrier(id) {
  return get(API_ENDPOINTS.carrier.get(id))
}

