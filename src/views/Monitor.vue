<template>
  <div class="monitor-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalDevices }}</div>
            <div class="stat-label">總設備數</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-value">{{ stats.onlineDevices }}</div>
            <div class="stat-label">在線設備</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-value">{{ stats.activeOrders }}</div>
            <div class="stat-label">活躍訂單</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-value">{{ stats.activeAlarms }}</div>
            <div class="stat-label">活躍警報</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>系統狀態</span>
          </template>
          <div class="status-content">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="SECS 連接狀態">
                <el-tag type="success">已連接</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="系統運行時間">
                2 天 5 小時 30 分鐘
              </el-descriptions-item>
              <el-descriptions-item label="最後更新時間">
                {{ new Date().toLocaleString() }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>快速操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/device')">
              設備管理
            </el-button>
            <el-button type="success" @click="$router.push('/order')">
              訂單管理
            </el-button>
            <el-button type="warning" @click="$router.push('/alarm')">
              警報中心
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDeviceStore } from '@/store/deviceStore'
import { useConsumerOrderStore } from '@/store/consumerOrder'

const deviceStore = useDeviceStore()
const orderStore = useConsumerOrderStore()

const stats = computed(() => {
  const processDevices = deviceStore.processDevices || []
  const bufferDevices = deviceStore.bufferDevices || []
  const orders = orderStore.orders || []

  const totalDevices = processDevices.length + bufferDevices.length
  const onlineDevices = [
    ...processDevices,
    ...bufferDevices
  ].filter(d => d.status === 'Online').length

  const activeOrders = orders.filter(o =>
    o.status === 'Pending' || o.status === 'Processing'
  ).length

  return {
    totalDevices,
    onlineDevices,
    activeOrders,
    activeAlarms: 0 // 可以从告警 store 获取
  }
})
</script>

<style scoped>
.monitor-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.monitor-page .el-row {
  width: 100%;
}

.monitor-page .el-row:first-child {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  height: 100%;
}

.stat-item {
  padding: 20px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.status-content {
  padding: 10px 0;
}

.quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mt-4 {
  margin-top: 20px;
}
</style>
