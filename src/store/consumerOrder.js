import { defineStore } from 'pinia'
import { getConsumerOrderList } from '@/api/services'

export const useConsumerOrderStore = defineStore('consumerOrder', {
    state: () => ({
        orders: [],
        orderDetail: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchOrders(params = {}) {
            this.loading = true
            this.error = null
            try {
                const data = await getConsumerOrderList(params)
                console.log(data)
                this.orders = data || []
            } catch (err) {
                this.error = err
                this.orders = []
            } finally {
                this.loading = false
            }
        },
        async createOrder(data) {
            this.loading = true
            this.error = null
            try {
                const response = await createConsumerOrder(data)
                // 如果接口返回新订单，可以直接添加
                if (response.data) {
                    this.orders.unshift(response.data)
                }
                return response
            } catch (err) {
                this.error = err
                throw err
            } finally {
                this.loading = false
            }
        },

        async updateOrder(orderId, data) {
            this.loading = true
            this.error = null
            try {
                const response = await consumerOrderApi.updateConsumerOrder(orderId, data)
                // 更新本地 orders 列表
                if (response.data) {
                    const idx = this.orders.findIndex(o => o.id === orderId)
                    if (idx !== -1) {
                        this.orders[idx] = response.data
                    }
                    if (this.orderDetail && this.orderDetail.id === orderId) {
                        this.orderDetail = response.data
                    }
                }
                return response
            } catch (err) {
                this.error = err
                throw err
            } finally {
                this.loading = false
            }
        },

        async deleteOrder(orderId) {
            this.loading = true
            this.error = null
            try {
                await consumerOrderApi.deleteConsumerOrder(orderId)
                this.orders = this.orders.filter(order => order.id !== orderId)
                if (this.orderDetail && this.orderDetail.id === orderId) {
                    this.orderDetail = null
                }
            } catch (err) {
                this.error = err
                throw err
            } finally {
                this.loading = false
            }
        },

        clearOrders() {
            this.orders = []
            this.orderDetail = null
            this.error = null
        }
    }
})
