<script setup>
import { onMounted } from 'vue'
import { useConsumerOrderStore } from '@/store/consumerOrder'
import { useDeviceStore } from '@/store/deviceStore'
import Header from '@/components/Header.vue'

const consumerOrderStore = useConsumerOrderStore()
const deviceStore = useDeviceStore()

onMounted(() => {
  consumerOrderStore.fetchOrders()
  deviceStore.fetchProcessDevices()
  deviceStore.fetchBufferDevices()
})
</script>

<template>
  <div id="app">
    <el-container>
      <Header />
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.el-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
