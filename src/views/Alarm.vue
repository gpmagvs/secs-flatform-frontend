<template>
  <div class="alarm-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>告警中心</span>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      
      <el-table :data="alarmList" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="title" label="告警标题" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="告警内容" />
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'Resolved' ? 'success' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAlarmList } from '@/api/services/alarm'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const alarmList = ref([])
const loading = ref(false)

const getLevelType = (level) => {
  const levelMap = {
    'low': 'info',
    'medium': 'warning',
    'high': 'danger',
    'critical': 'danger'
  }
  return levelMap[level?.toLowerCase()] || 'info'
}

const handleRefresh = async () => {
  await fetchAlarms()
}

const fetchAlarms = async () => {
  loading.value = true
  try {
    const data = await getAlarmList({ page: 1, pageSize: 50 })
    alarmList.value = Array.isArray(data) ? data : []
  } catch (error) {
    ElMessage.error('加载告警数据失败')
    alarmList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAlarms()
})
</script>

<style scoped>
.alarm-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.alarm-page .el-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.alarm-page .el-card :deep(.el-card__body) {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.alarm-page .el-table {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

