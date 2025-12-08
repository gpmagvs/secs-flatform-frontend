<script setup>
import { onMounted } from 'vue'
import { useConsumerOrderStore } from '@/store/consumerOrder'
import { useDeviceStore } from '@/store/deviceStore'
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
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
