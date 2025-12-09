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
          <div class="table-toolbar">
            <el-button type="primary" @click="openCreateDialog('process')">
              <el-icon>
                <Plus />
              </el-icon>
              新增製程設備
            </el-button>
          </div>
          <el-table :data="processDevices" style="width: 100%" v-loading="loading">
            <el-table-column prop="deviceID" label="設備ID" width="190" />
            <el-table-column prop="deviceName" label="設備名稱" />
            <!-- <el-table-column prop="status" label="狀態" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'Online' ? 'success' : 'danger'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column> -->
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="BUFFER 設備" name="buffer">
          <div class="table-toolbar">
            <el-button type="primary" @click="openCreateDialog('buffer')">
              <el-icon>
                <Plus />
              </el-icon>
              新增 BUFFER 設備
            </el-button>
          </div>
          <el-table :data="bufferDevices" style="width: 100%" v-loading="loading">
            <el-table-column prop="deviceID" label="設備ID" width="190" />
            <el-table-column prop="deviceName" label="設備名稱" />
            <!-- <el-table-column prop="status" label="狀態" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'Online' ? 'success' : 'danger'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column> -->
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 創建設備對話框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="resetForm">
      <el-form ref="deviceFormRef" :model="deviceForm" :rules="formRules" label-width="100px">
        <el-form-item label="設備ID" prop="DeviceName">
          <el-input v-model="deviceForm.DeviceID" placeholder="請輸入設備ID" />
        </el-form-item>
        <el-form-item label="設備名稱" prop="DeviceName">
          <el-input v-model="deviceForm.DeviceName" placeholder="請輸入設備名稱" />
        </el-form-item>
        <!-- <el-form-item label="狀態" prop="status">
          <el-select v-model="deviceForm.status" placeholder="請選擇狀態" style="width: 100%">
            <el-option label="在線" value="Online" />
            <el-option label="離線" value="Offline" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="描述" prop="description">
          <el-input v-model="deviceForm.description" type="textarea" :rows="3" placeholder="請輸入設備描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            確定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDeviceStore } from '@/store/deviceStore'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const deviceStore = useDeviceStore()
const activeTab = ref('process')
const loading = ref(false)
const dialogVisible = ref(false)
const deviceType = ref('process') // 'process' 或 'buffer'
const submitting = ref(false)
const deviceFormRef = ref(null)

const processDevices = computed(() => deviceStore.processDevices)
const bufferDevices = computed(() => deviceStore.bufferDevices)

const dialogTitle = computed(() => {
  return deviceType.value === 'process' ? '新增製程設備' : '新增 BUFFER 設備'
})

const deviceForm = ref({
  id: '',
  name: '',
  status: 'Online',
  description: ''
})

const formRules = {
  id: [
    { required: true, message: '請輸入設備ID', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '請輸入設備名稱', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '請選擇狀態', trigger: 'change' }
  ]
}

const openCreateDialog = (type) => {
  deviceType.value = type
  dialogVisible.value = true
}

const resetForm = () => {
  deviceForm.value = {
    id: '',
    name: '',
    status: 'Online',
    description: ''
  }
  deviceFormRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!deviceFormRef.value) return

  await deviceFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (deviceType.value === 'process') {
        await deviceStore.createProcessDevice(deviceForm.value)
        ElMessage.success('製程設備創建成功')
      } else {
        await deviceStore.createBufferDevice(deviceForm.value)
        ElMessage.success('BUFFER 設備創建成功')
      }
      dialogVisible.value = false
      resetForm()
    } catch (error) {
      ElMessage.error('創建設備失敗')
    } finally {
      submitting.value = false
    }
  })
}

onMounted(async () => {
  loading.value = true
  try {
    await deviceStore.fetchProcessDevices()
    await deviceStore.fetchBufferDevices()
  } catch (error) {
    ElMessage.error('載入設備數據失敗')
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

.table-toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
