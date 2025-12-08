//
import { getProcessDeviceList, getBufferDeviceList } from '@/api/services'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
    state: () => ({
        processDevices: [],
        bufferDevices: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchProcessDevices(params = {}) {
            this.loading = true
            this.error = null
            try {
                const data = await getProcessDeviceList(params)
                this.processDevices = data || []
            } catch (err) {
                this.error = err
                this.processDevices = []
            } finally {
                this.loading = false
            }
        },
        async fetchBufferDevices(params = {}) {
            this.loading = true
            this.error = null
            try {
                const data = await getBufferDeviceList(params)
                this.bufferDevices = data || []
            } catch (err) {
                this.error = err
                this.bufferDevices = []
            } finally {
                this.loading = false
            }
        }
    }
})