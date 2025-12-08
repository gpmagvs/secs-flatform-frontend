import { get, post } from '../request'
import { API_ENDPOINTS } from '../config'

export function getConsumerOrderList(params = {}) {
    return get(API_ENDPOINTS.consumerOrder.list, params)
}

export function createConsumerOrder(data) {
    return post(API_ENDPOINTS.consumerOrder.createOrder, data)
}

