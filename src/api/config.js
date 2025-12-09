/**
 * API 配置文件
 */

// API 基础配置
export const API_CONFIG = {
    // API 基础 URL
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7107',

    // 请求超时时间（毫秒）
    timeout: 30000,

    // 默认请求头
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

// API 端点配置
export const API_ENDPOINTS = {
    // 示例端点
    auth: {
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh'
    },

    // 根据后端 API 添加更多端点
    secs: {
        state: '/api/secs/state',
        connect: '/api/secs/connect',
        disconnect: '/api/secs/disconnect'
    },

    alarm: {
        list: '/api/alarm',
        get: (id) => `/api/alarm/${id}`,
        create: '/api/alarm',
        update: (id) => `/api/alarm/${id}`,
        delete: (id) => `/api/alarm/${id}`
    },

    carrier: {
        list: '/api/carrier',
        get: (id) => `/api/carrier/${id}`
    },

    vehicle: {
        list: '/api/vehicle',
        get: (id) => `/api/vehicle/${id}`,
        state: '/api/vehicle/state'
    },

    log: {
        history: '/api/log/history',
        search: '/api/log/search'
    },
    consumerOrder: {
        list: '/api/DCSEmu/GetConsumerOrders',
        createOrder: '/api/DCSEmu/CreateOrder',
        updateOrder: (orderID) => `/api/DCSEmu/UpdateOrder/${orderID}`,
        deleteOrder: (orderID) => `/api/DCSEmu/DeleteOrder/${orderID}`,
    },
    device: {
        processDeviceList: '/api/DCSEmu/GetProcessDevices',
        bufferDeviceList: '/api/DCSEmu/GetBufferDevices',
        createProcessDevice: '/api/DCSEmu/CreateProcessDevice',
        createBufferDevice: '/api/DCSEmu/CreateBufferDevice',
    }
}

