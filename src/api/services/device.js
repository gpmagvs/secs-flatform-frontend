import { get, post } from '../request'
import { API_ENDPOINTS } from '../config'

export function getProcessDeviceList(params = {}) {

    return get(API_ENDPOINTS.device.processDeviceList, params)
}

export function getBufferDeviceList(params = {}) {
    return get(API_ENDPOINTS.device.bufferDeviceList, params)
}