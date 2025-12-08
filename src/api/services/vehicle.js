/**
 * 车辆相关 API
 */

import { get } from '../request'
import { API_ENDPOINTS } from '../config'

/**
 * 获取车辆列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 车辆列表
 */
export function getVehicleList(params = {}) {
  return get(API_ENDPOINTS.vehicle.list, params)
}

/**
 * 获取单个车辆详情
 * @param {string|number} id - 车辆 ID
 * @returns {Promise} 车辆详情
 */
export function getVehicle(id) {
  return get(API_ENDPOINTS.vehicle.get(id))
}

/**
 * 获取车辆状态
 * @returns {Promise} 车辆状态信息
 */
export function getVehicleState() {
  return get(API_ENDPOINTS.vehicle.state)
}

