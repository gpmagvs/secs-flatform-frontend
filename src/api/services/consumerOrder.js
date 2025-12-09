import { get, post, put, deleteRequest } from '../request'
import { API_ENDPOINTS } from '../config'

export function getConsumerOrderList(params = {}) {
    return get(API_ENDPOINTS.consumerOrder.list, params)
}

export function createConsumerOrder(data) {
    return post(API_ENDPOINTS.consumerOrder.createOrder, data)
}

export function updateConsumerOrder(orderID, data) {
    return put(API_ENDPOINTS.consumerOrder.updateOrder(orderID), data)
}

export function deleteConsumerOrder(orderID) {
    return deleteRequest(API_ENDPOINTS.consumerOrder.deleteOrder(orderID))
}
