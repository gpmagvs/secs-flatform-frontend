/**
 * HTTP 请求封装
 * 基于 fetch API，提供统一的请求接口
 */

import { API_CONFIG } from './config'
import { ElMessage, ElMessageBox } from 'element-plus'

// 请求拦截器队列
const requestInterceptors = []
// 响应拦截器队列
const responseInterceptors = []

/**
 * 添加请求拦截器
 * @param {Function} interceptor - 拦截器函数，接收 config，返回 config 或 Promise<config>
 */
export function addRequestInterceptor(interceptor) {
    requestInterceptors.push(interceptor)
}

/**
 * 添加响应拦截器
 * @param {Function} fulfilled - 成功处理函数，接收 response，返回 response 或 Promise<response>
 * @param {Function} rejected - 错误处理函数，接收 error，返回 error 或 Promise<error>
 */
export function addResponseInterceptor(fulfilled, rejected) {
    responseInterceptors.push({ fulfilled, rejected })
}

/**
 * 处理请求拦截器
 */
async function applyRequestInterceptors(config) {
    let processedConfig = { ...config }

    for (const interceptor of requestInterceptors) {
        processedConfig = await interceptor(processedConfig)
    }

    return processedConfig
}

/**
 * 处理响应拦截器
 */
async function applyResponseInterceptors(response, error = null) {
    if (error) {
        let processedError = error
        for (const interceptor of responseInterceptors) {
            if (interceptor.rejected) {
                processedError = await interceptor.rejected(processedError)
            }
        }
        throw processedError
    } else {
        let processedResponse = response
        for (const interceptor of responseInterceptors) {
            if (interceptor.fulfilled) {
                processedResponse = await interceptor.fulfilled(processedResponse)
            }
        }
        return processedResponse
    }
}

/**
 * 创建 AbortController 用于超时控制
 */
function createTimeoutController(timeout) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    return { controller, timeoutId }
}

/**
 * 处理错误响应
 */
async function handleErrorResponse(response) {
    let errorMessage = '请求失败'

    try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
    } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
    }

    const error = new Error(errorMessage)
    error.status = response.status
    error.statusText = response.statusText
    error.response = response

    return error
}

/**
 * 发送 HTTP 请求
 * @param {Object} config - 请求配置
 * @param {string} config.url - 请求 URL
 * @param {string} config.method - 请求方法 (GET, POST, PUT, DELETE 等)
 * @param {Object} config.data - 请求体数据
 * @param {Object} config.params - URL 查询参数
 * @param {Object} config.headers - 请求头
 * @param {number} config.timeout - 超时时间（毫秒）
 * @param {boolean} config.showError - 是否显示错误消息（默认 true）
 * @returns {Promise} 响应数据
 */
export async function request(config) {
    try {
        // 应用请求拦截器
        const processedConfig = await applyRequestInterceptors({
            ...API_CONFIG,
            ...config,
            headers: {
                ...API_CONFIG.headers,
                ...config.headers
            }
        })

        // 构建完整 URL
        let url = processedConfig.url
        if (!url.startsWith('http')) {
            url = `${processedConfig.baseURL}${url}`
        }

        // 添加查询参数
        if (processedConfig.params) {
            const params = new URLSearchParams(processedConfig.params)
            url += `?${params.toString()}`
        }

        // 创建超时控制器
        const { controller, timeoutId } = createTimeoutController(processedConfig.timeout)

        // 准备请求选项
        const requestOptions = {
            method: processedConfig.method || 'GET',
            headers: processedConfig.headers,
            signal: controller.signal
        }

        // 添加请求体（如果不是 GET 或 HEAD）
        if (processedConfig.data && !['GET', 'HEAD'].includes(requestOptions.method)) {
            if (processedConfig.data instanceof FormData) {
                // FormData 不需要设置 Content-Type，浏览器会自动设置
                requestOptions.body = processedConfig.data
                delete requestOptions.headers['Content-Type']
            } else {
                requestOptions.body = JSON.stringify(processedConfig.data)
            }
        }

        // 发送请求
        const response = await fetch(url, requestOptions)
        clearTimeout(timeoutId)

        // 处理响应
        let responseData
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json()
        } else {
            responseData = await response.text()
        }

        // 检查响应状态
        if (!response.ok) {
            const error = await handleErrorResponse(response)

            // 应用响应拦截器（错误情况）
            const processedError = await applyResponseInterceptors(null, error)

            // 显示错误消息
            if (processedConfig.showError !== false) {
                ElMessage.error(processedError.message || '请求失败')
            }

            throw processedError
        }

        // 应用响应拦截器（成功情况）
        const processedResponse = await applyResponseInterceptors({
            data: responseData,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: processedConfig
        })

        return processedResponse.data
    } catch (error) {
        // 处理网络错误或超时
        if (error.name === 'AbortError') {
            const timeoutError = new Error('请求超时')
            timeoutError.isTimeout = true

            if (config.showError !== false) {
                ElMessage.error('请求超时，请稍后重试')
            }

            const processedError = await applyResponseInterceptors(null, timeoutError)
            throw processedError
        }

        // 应用响应拦截器（错误情况）
        const processedError = await applyResponseInterceptors(null, error)

        if (config.showError !== false && !error.isTimeout) {
            ElMessage.error(processedError.message || '网络错误，请稍后重试')
        }

        throw processedError
    }
}

/**
 * GET 请求
 */
export function get(url, params = {}, config = {}) {
    return request({
        url,
        method: 'GET',
        params,
        ...config
    })
}

/**
 * POST 请求
 */
export function post(url, data = {}, config = {}) {
    return request({
        url,
        method: 'POST',
        data,
        ...config
    })
}

/**
 * PUT 请求
 */
export function put(url, data = {}, config = {}) {
    return request({
        url,
        method: 'PUT',
        data,
        ...config
    })
}

/**
 * PATCH 请求
 */
export function patch(url, data = {}, config = {}) {
    return request({
        url,
        method: 'PATCH',
        data,
        ...config
    })
}

/**
 * DELETE 请求
 */
export function deleteRequest(url, config = {}) {
    return request({
        url,
        method: 'DELETE',
        ...config
    })
}

// 默认导出 request 函数
export default request

