//
import { getProcessDeviceList, getBufferDeviceList, createProcessDevice, createBufferDevice } from '@/api/services'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
    state: () => ({
        processDevices: [],
        bufferDevices: [],
        loading: false,
        error: null
    }),
    getters: {
        getProcessDevices: (state) => state.processDevices,
        getBufferDevices: (state) => state.bufferDevices,
        getDevicesWithGroup: (state) => {
            var devices = [
                { label: '製程設備', value: state.processDevices },
                { label: '儲架設備', value: state.bufferDevices }
            ]
            return devices
        }
    },
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
        },
        async createProcessDevice(deviceData) {
            try {
                const data = await createProcessDevice(deviceData)
                // 创建成功后刷新列表
                await this.fetchProcessDevices()
                return data
            } catch (err) {
                this.error = err
                throw err
            }
        },
        async createBufferDevice(deviceData) {
            try {
                const data = await createBufferDevice(deviceData)
                // 创建成功后刷新列表
                await this.fetchBufferDevices()
                return data
            } catch (err) {
                this.error = err
                throw err
            }
        }
    }
})