<template>
  <div class="order-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <el-button type="primary" @click="handleCreateOrder">
            <el-icon><Plus /></el-icon>
            新建订单
          </el-button>
        </div>
      </template>
      
      <el-table :data="orders" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orderId" label="订单ID" width="150" />
        <el-table-column prop="carrierId" label="载具ID" width="120" />
        <el-table-column prop="fromLocation" label="起始位置" />
        <el-table-column prop="toLocation" label="目标位置" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConsumerOrderStore } from '@/store/consumerOrder'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const orderStore = useConsumerOrderStore()
const loading = ref(false)

const orders = computed(() => orderStore.orders)

const getStatusType = (status) => {
  const statusMap = {
    'Pending': 'warning',
    'Processing': 'primary',
    'Completed': 'success',
    'Failed': 'danger'
  }
  return statusMap[status] || 'info'
}

const handleCreateOrder = () => {
  ElMessage.info('创建订单功能待实现')
}

onMounted(async () => {
  loading.value = true
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    ElMessage.error('加载订单数据失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.order-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.order-page .el-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.order-page .el-card :deep(.el-card__body) {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.order-page .el-table {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

