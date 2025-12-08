<template>
  <div class="device-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>設備管理</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="製程設備" name="process">
          <el-table :data="processDevices" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="設備ID" width="120" />
            <el-table-column prop="name" label="設備名稱" />
            <el-table-column prop="status" label="狀態" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'Online' ? 'success' : 'danger'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="BUFFER 設備" name="buffer">
          <el-table :data="bufferDevices" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="設備ID" width="120" />
            <el-table-column prop="name" label="設備名稱" />
            <el-table-column prop="status" label="狀態" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'Online' ? 'success' : 'danger'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDeviceStore } from '@/store/deviceStore'
import { ElMessage } from 'element-plus'

const deviceStore = useDeviceStore()
const activeTab = ref('process')
const loading = ref(false)

const processDevices = computed(() => deviceStore.processDevices)
const bufferDevices = computed(() => deviceStore.bufferDevices)

onMounted(async () => {
  loading.value = true
  try {
    await deviceStore.fetchProcessDevices()
    await deviceStore.fetchBufferDevices()
  } catch (error) {
    ElMessage.error('加载设备数据失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.device-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.device-page .el-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.device-page .el-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
}

.device-page .el-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.device-page .el-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: auto;
}

.device-page .el-table {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
