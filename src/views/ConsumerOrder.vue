<template>
    <div class="consumer-order-page">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>客戶訂單管理</span>
                    <el-button type="primary" @click="openCreateDialog">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增訂單
                    </el-button>
                </div>
            </template>

            <el-table :data="orders" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序號" width="60" />
                <el-table-column prop="orderID" label="訂單ID" width="200">
                    <template #default="{ row }">
                        {{ row.orderID || row.OrderID }}
                    </template>
                </el-table-column>
                <el-table-column prop="totalProductNumber" label="總產品數量" width="120">
                    <template #default="{ row }">
                        {{ row.totalProductNumber || row.TotalProductNumber }}
                    </template>
                </el-table-column>
                <el-table-column prop="mainProcessType" label="主要製程類型" width="150">
                    <template #default="{ row }">
                        <el-tag :type="getProcessTypeTag(
                            row.mainProcessType !== undefined
                                ? row.mainProcessType
                                : row.MainProcessType
                        )
                            ">
                            {{
                                getProcessTypeLabel(
                                    row.mainProcessType !== undefined ? row.mainProcessType : row.MainProcessType
                                )
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="批次設置" width="200">
                    <template #default="{ row }">
                        <div v-if="row.productBatchSetup || row.ProductBatchSetup">
                            <el-tag v-if="(row.productBatchSetup?.isUseBatch || row.ProductBatchSetup?.IsUseBatch)"
                                type="success" size="small">
                                使用批次
                            </el-tag>
                            <el-tag v-else type="info" size="small">不使用批次</el-tag>
                            <span v-if="row.productBatchSetup?.isUseBatch || row.ProductBatchSetup?.IsUseBatch"
                                class="batch-info">
                                (每批
                                {{
                                    row.productBatchSetup?.numberOfProductsPerBatch ||
                                    row.ProductBatchSetup?.NumberOfProductsPerBatch
                                }}
                                個)
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="子流程數量" width="120">
                    <template #default="{ row }">
                        <el-tag type="info">
                            {{ getSubProcessList(row).length }} 個
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
                        <el-button link type="primary" size="small" @click="handleEdit(row)">編輯</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 創建/編輯訂單對話框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" @close="resetForm"
            :close-on-click-modal="false" draggable>
            <el-form ref="orderFormRef" :model="orderForm" :rules="formRules" label-width="140px">
                <el-form-item label="訂單ID" prop="orderID">
                    <el-input v-model="orderForm.orderID" placeholder="請輸入訂單ID" :disabled="isEditMode" />
                    <div v-if="isEditMode" class="form-hint">
                        <el-text type="info" size="small">訂單ID不可修改</el-text>
                    </div>
                </el-form-item>

                <el-form-item label="總產品數量" prop="totalProductNumber">
                    <el-input-number v-model="orderForm.totalProductNumber" :min="1" placeholder="請輸入總產品數量"
                        style="width: 100%" />
                </el-form-item>

                <el-form-item label="主要製程類型" prop="mainProcessType">
                    <el-select v-model="orderForm.mainProcessType" placeholder="請選擇主要製程類型" style="width: 100%">
                        <el-option v-for="type in processTypes" :key="type.value" :label="type.label"
                            :value="type.value" />
                    </el-select>
                </el-form-item>

                <el-divider>批次設置</el-divider>

                <el-form-item label="是否使用批次">
                    <el-switch v-model="orderForm.productBatchSetup.isUseBatch" />
                </el-form-item>

                <el-form-item v-if="orderForm.productBatchSetup.isUseBatch" label="每批產品數量"
                    prop="productBatchSetup.numberOfProductsPerBatch">
                    <el-input-number v-model="orderForm.productBatchSetup.numberOfProductsPerBatch" :min="1" :max="100"
                        placeholder="請輸入每批產品數量" style="width: 100%" />
                </el-form-item>

                <el-divider>子流程列表</el-divider>

                <el-form-item label="子流程設置">
                    <div class="sub-process-list">
                        <div v-for="(subProcess, index) in orderForm.subProcessList" :key="index"
                            class="sub-process-item">
                            <el-card shadow="hover" class="sub-process-card">
                                <template #header>
                                    <div class="sub-process-header">
                                        <span>子流程 {{ index + 1 }}</span>
                                        <el-button type="danger" size="small" text @click="removeSubProcess(index)">
                                            <el-icon>
                                                <Delete />
                                            </el-icon>
                                            刪除
                                        </el-button>
                                    </div>
                                </template>
                                <el-form-item :label="`子流程類型`" :prop="`subProcessList.${index}.subProcessType`" :rules="{
                                    required: true,
                                    message: '請選擇子流程類型',
                                    trigger: 'change'
                                }">
                                    <el-select v-model="subProcess.subProcessType" placeholder="請選擇子流程類型"
                                        style="width: 100%">
                                        <el-option v-for="type in subProcessTypes" :key="type.value" :label="type.label"
                                            :value="type.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="製程時間(小時)" :prop="`subProcessList.${index}.processTimeInHours`"
                                    :rules="{
                                        required: true,
                                        message: '請輸入製程時間',
                                        trigger: 'blur',
                                        type: 'number',
                                        min: 0
                                    }">
                                    <el-input-number v-model="subProcess.processTimeInHours" :min="0" :precision="2"
                                        :step="0.1" placeholder="請輸入製程時間(小時)" style="width: 100%" />
                                </el-form-item>
                                <el-form-item label="製程設備">
                                    <el-select multiple v-model="subProcess.processDevicesList" placeholder="請選擇製程設備"
                                        style="width: 100%">
                                        <el-option-group v-for="group in devices" :key="group.label"
                                            :label="group.label">
                                            <el-option v-for="device in group.value" :key="device.deviceID"
                                                :label="device.deviceName" :value="device.deviceID" />
                                        </el-option-group>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="暫存區">
                                    <el-select multiple v-model="subProcess.bufferDevicesList" placeholder="請選擇暫存區"
                                        style="width: 100%">
                                        <el-option v-for="device in devices[1].value" :key="device.deviceID"
                                            :label="device.deviceName" :value="device.deviceID" />
                                    </el-select>
                                </el-form-item>
                            </el-card>
                        </div>
                        <el-button type="primary" plain @click="addSubProcess" style="width: 100%; margin-top: 10px">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            新增子流程
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitting">確定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看訂單詳情對話框 -->
        <el-dialog v-model="viewDialogVisible" title="訂單詳情" width="900px">
            <el-descriptions :column="1" border v-if="selectedOrder">
                <el-descriptions-item label="訂單ID">
                    {{ selectedOrder.orderID || selectedOrder.OrderID }}
                </el-descriptions-item>
                <el-descriptions-item label="總產品數量">
                    {{ selectedOrder.totalProductNumber || selectedOrder.TotalProductNumber }}
                </el-descriptions-item>
                <el-descriptions-item label="主要製程類型">
                    {{
                        getProcessTypeLabel(
                            selectedOrder.mainProcessType !== undefined
                                ? selectedOrder.mainProcessType
                                : selectedOrder.MainProcessType
                        )
                    }}
                </el-descriptions-item>
                <el-descriptions-item label="使用批次">
                    <el-tag :type="(selectedOrder.productBatchSetup?.isUseBatch ||
                        selectedOrder.ProductBatchSetup?.IsUseBatch)
                        ? 'success'
                        : 'info'
                        ">
                        {{
                            selectedOrder.productBatchSetup?.isUseBatch ||
                                selectedOrder.ProductBatchSetup?.IsUseBatch
                                ? '是'
                                : '否'
                        }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item v-if="
                    selectedOrder.productBatchSetup?.isUseBatch ||
                    selectedOrder.ProductBatchSetup?.IsUseBatch
                " label="每批產品數量">
                    {{
                        selectedOrder.productBatchSetup?.numberOfProductsPerBatch ||
                        selectedOrder.ProductBatchSetup?.NumberOfProductsPerBatch
                    }}
                </el-descriptions-item>
                <el-descriptions-item label="子流程列表">
                    <div v-if="getSubProcessList(selectedOrder).length > 0" class="sub-process-display">
                        <div v-for="(subProcess, index) in getSubProcessList(selectedOrder)" :key="index">
                            <el-tag :type="getSubProcessTagType(subProcess.type)"
                                style="margin-right: 8px; margin-bottom: 4px">
                                {{ getSubProcessTypeLabel(subProcess.type) }} ({{ subProcess.time }}小時)
                            </el-tag>
                            <span style="font-size: 14px;" v-if="index < getSubProcessList(selectedOrder).length - 1">
                                &rarr;
                            </span>
                        </div>
                    </div>
                    <span v-else class="text-muted">無</span>
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConsumerOrderStore } from '@/store/consumerOrder'
import { useDeviceStore } from '@/store/deviceStore'
import { createConsumerOrder, updateConsumerOrder, deleteConsumerOrder } from '@/api/services/consumerOrder'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

const orderStore = useConsumerOrderStore()
const deviceStore = useDeviceStore()

const loading = ref(false)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const submitting = ref(false)
const orderFormRef = ref(null)
const selectedOrder = ref(null)
const isEditMode = ref(false)
const editingOrderID = ref(null)

const orders = computed(() => orderStore.orders)

const dialogTitle = computed(() => {
    return isEditMode.value ? '編輯客戶訂單' : '新增客戶訂單'
})

const devices = computed(() => deviceStore.getDevicesWithGroup)

// 製程類型選項 (對應 C# 枚舉值: 0=AOI_AOS_INSPECTION, 1=YELLOW_LIGHT_AREA, 2=MOLDING_AND_BAKING)
const processTypes = [
    { label: '光學檢測製程', value: 0 },
    { label: '黃光區製程', value: 1 },
    { label: '壓模與烘烤製程', value: 2 }
]

// 子流程類型選項 (對應 C# 枚舉值: 0=MOLDING, 1=BAKING, 2=ANNEALING, 3=OTP)
const subProcessTypes = [
    { label: '壓膜', value: 0 },
    { label: '烘烤', value: 1 },
    { label: '退火', value: 2 },
    { label: 'OTP', value: 3 }
]

// 將主要製程類型轉換為數字（支持字符串和數字）
const convertMainProcessTypeToNumber = (type) => {
    if (typeof type === 'number') return type
    if (typeof type === 'string') {
        const typeMap = {
            'AOI_AOS_INSPECTION': 0,
            'YELLOW_LIGHT_AREA': 1,
            'MOLDING_AND_BAKING': 2
        }
        return typeMap[type] !== undefined ? typeMap[type] : 2
    }
    return 2 // 默認值
}

// 將子流程類型轉換為數字（支持字符串和數字）
const convertSubProcessTypeToNumber = (type) => {
    if (typeof type === 'number') return type
    if (typeof type === 'string') {
        const typeMap = {
            'MOLDING': 0,
            'BAKING': 1,
            'ANNEALING': 2,
            'OTP': 3
        }
        return typeMap[type] !== undefined ? typeMap[type] : null
    }
    return null
}

// 獲取子流程類型標籤
const getSubProcessTypeLabel = (type) => {
    if (typeof type === 'number') {
        const typeMap = {
            0: '壓膜',
            1: '烘烤',
            2: '退火',
            3: 'OTP'
        }
        return typeMap[type] || `未知類型(${type})`
    }
    const typeMap = {
        MOLDING: '壓膜',
        BAKING: '烘烤',
        ANNEALING: '退火',
        OTP: 'OTP',
        0: '壓膜',
        1: '烘烤',
        2: '退火',
        3: 'OTP'
    }
    return typeMap[type] || type
}

// 訂單表單
const orderForm = ref({
    orderID: '',
    totalProductNumber: 1,
    mainProcessType: 2, // 默認為壓模與烘烤製程
    productBatchSetup: {
        isUseBatch: false,
        numberOfProductsPerBatch: 2
    },
    subProcessList: [] // 子流程列表
})

// 表單驗證規則
const formRules = {
    orderID: [{ required: true, message: '請輸入訂單ID', trigger: 'blur' }],
    totalProductNumber: [{ required: true, message: '請輸入總產品數量', trigger: 'blur' }],
    mainProcessType: [{ required: true, message: '請選擇主要製程類型', trigger: 'change' }],
    'productBatchSetup.numberOfProductsPerBatch': [
        {
            validator: (rule, value, callback) => {
                if (orderForm.value.productBatchSetup.isUseBatch && (!value || value < 1)) {
                    callback(new Error('請輸入每批產品數量'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

// 獲取製程類型標籤 (支持數字和字符串格式)
const getProcessTypeLabel = (type) => {
    // 處理數字類型
    if (typeof type === 'number') {
        const typeMap = {
            0: '光學檢測製程',
            1: '黃光區製程',
            2: '壓模與烘烤製程'
        }
        return typeMap[type] || `未知類型(${type})`
    }
    // 處理字符串類型（向後兼容）
    const typeMap = {
        AOI_AOS_INSPECTION: '光學檢測製程',
        YELLOW_LIGHT_AREA: '黃光區製程',
        MOLDING_AND_BAKING: '壓模與烘烤製程',
        0: '光學檢測製程',
        1: '黃光區製程',
        2: '壓模與烘烤製程'
    }
    return typeMap[type] || type
}

// 獲取製程類型標籤顏色 (支持數字和字符串格式)
const getProcessTypeTag = (type) => {
    // 處理數字類型
    if (typeof type === 'number') {
        const tagMap = {
            0: 'primary',
            1: 'warning',
            2: 'success'
        }
        return tagMap[type] || 'info'
    }
    // 處理字符串類型（向後兼容）
    const tagMap = {
        AOI_AOS_INSPECTION: 'primary',
        YELLOW_LIGHT_AREA: 'warning',
        MOLDING_AND_BAKING: 'success',
        0: 'primary',
        1: 'warning',
        2: 'success'
    }
    return tagMap[type] || 'info'
}

// 打開創建對話框
const openCreateDialog = () => {
    isEditMode.value = false
    editingOrderID.value = null
    resetForm()
    dialogVisible.value = true
}

// 打開編輯對話框
const handleEdit = (row) => {
    isEditMode.value = true
    editingOrderID.value = row.orderID || row.OrderID

    // 加載訂單數據到表單
    const order = row
    const mainProcessTypeValue = order.mainProcessType !== undefined
        ? order.mainProcessType
        : order.MainProcessType !== undefined
            ? order.MainProcessType
            : 2

    orderForm.value = {
        orderID: order.orderID || order.OrderID || '',
        totalProductNumber: order.totalProductNumber || order.TotalProductNumber || 1,
        mainProcessType: convertMainProcessTypeToNumber(mainProcessTypeValue),
        productBatchSetup: {
            isUseBatch: order.productBatchSetup?.isUseBatch || order.ProductBatchSetup?.IsUseBatch || false,
            numberOfProductsPerBatch: order.productBatchSetup?.numberOfProductsPerBatch || order.ProductBatchSetup?.NumberOfProductsPerBatch || 2
        },
        subProcessList: loadSubProcessListToForm(order)
    }

    dialogVisible.value = true
}

// 將訂單的子流程列表加載到表單格式
const loadSubProcessListToForm = (order) => {
    const subProcessArray = order.subProcessList || order.SubProcessList || []

    if (Array.isArray(subProcessArray)) {
        return subProcessArray.map((subProcess) => {
            const subProcessTypeValue = subProcess.subProcessType !== undefined
                ? subProcess.subProcessType
                : subProcess.SubProcessType !== undefined
                    ? subProcess.SubProcessType
                    : null

            return {
                subProcessType: convertSubProcessTypeToNumber(subProcessTypeValue),
                processTimeInHours: subProcess.processTimeInHours !== undefined
                    ? subProcess.processTimeInHours
                    : subProcess.ProcessTimeInHours !== undefined
                        ? subProcess.ProcessTimeInHours
                        : 0,
                processDevicesList: subProcess.processDevicesList || subProcess.ProcessDevicesList || [],
                bufferDevicesList: subProcess.bufferDevicesList || subProcess.BufferDevicesList || []
            }
        })
    }

    return []
}

// 添加子流程
const addSubProcess = () => {
    orderForm.value.subProcessList.push({
        subProcessType: null,
        processTimeInHours: 0,
        processDevicesList: [],
        bufferDevicesList: []
    })
}

// 刪除子流程
const removeSubProcess = (index) => {
    orderForm.value.subProcessList.splice(index, 1)
}


// 獲取子流程標籤顏色
const getSubProcessTagType = (type) => {
    const tagMap = {
        0: 'primary',
        1: 'warning',
        2: 'success',
        3: 'info'
    }
    return tagMap[type] || 'info'
}

// 從訂單對象中提取子流程列表（用於顯示）
const getSubProcessList = (order) => {
    const subProcessList = []
    const subProcessArray = order.subProcessList || order.SubProcessList || []

    // 如果是數組，直接遍歷（新格式）
    if (Array.isArray(subProcessArray)) {
        subProcessArray.forEach((subProcess) => {
            const processType =
                subProcess.subProcessType !== undefined
                    ? subProcess.subProcessType
                    : subProcess.SubProcessType !== undefined
                        ? subProcess.SubProcessType
                        : 0
            const processTime =
                subProcess.processTimeInHours !== undefined
                    ? subProcess.processTimeInHours
                    : subProcess.ProcessTimeInHours !== undefined
                        ? subProcess.ProcessTimeInHours
                        : 0

            subProcessList.push({
                type: processType,
                time: processTime
            })
        })
    }
    // 如果是對象（向後兼容舊格式），遍歷所有鍵值對
    else if (typeof subProcessArray === 'object' && subProcessArray !== null) {
        Object.keys(subProcessArray).forEach((key) => {
            const subProcess = subProcessArray[key]
            const processType =
                subProcess.subProcessType !== undefined
                    ? subProcess.subProcessType
                    : subProcess.SubProcessType !== undefined
                        ? subProcess.SubProcessType
                        : parseInt(key)
            const processTime =
                subProcess.processTimeInHours !== undefined
                    ? subProcess.processTimeInHours
                    : subProcess.ProcessTimeInHours !== undefined
                        ? subProcess.ProcessTimeInHours
                        : 0

            subProcessList.push({
                type: processType,
                time: processTime
            })
        })
    }

    // 保持順序（數組已經有序，不需要排序）
    return subProcessList
}

// 重置表單
const resetForm = () => {
    orderForm.value = {
        orderID: '',
        totalProductNumber: 1,
        mainProcessType: 2, // 默認為壓模與烘烤製程
        productBatchSetup: {
            isUseBatch: false,
            numberOfProductsPerBatch: 2
        },
        subProcessList: []
    }
    isEditMode.value = false
    editingOrderID.value = null
    orderFormRef.value?.clearValidate()
}

// 提交表單
const handleSubmit = async () => {
    if (!orderFormRef.value) return

    await orderFormRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
            // 轉換子流程列表為數組格式
            // 由於 SubProcessBase 是抽象類，System.Text.Json 無法直接反序列化
            // 需要後端配置多態序列化支持，或者使用自定義 JSON 轉換器
            // 後端使用 List<SubProcessBase>，支持相同類型的多個子流程並保持順序
            const subProcessTypeMap = {
                0: 'MoldingProcessState',
                1: 'BakingProcessState',
                2: 'AnnelingProcessState',
                3: 'OTPProcessState'
            }

            // 轉換為數組格式，保持順序，允許重複類型
            const subProcessArray = orderForm.value.subProcessList
                .filter((subProcess) => subProcess.subProcessType !== null && subProcess.subProcessType !== undefined)
                .map((subProcess) => ({
                    SubProcessType: subProcess.subProcessType, // 類型標識
                    ProcessTimeInHours: subProcess.processTimeInHours || 0,
                    ProcessDevicesList: subProcess.processDevicesList || [],
                    BufferDevicesList: subProcess.bufferDevicesList || []
                }))

            // 轉換表單數據為 API 格式
            const orderData = {
                OrderID: orderForm.value.orderID,
                TotalProductNumber: orderForm.value.totalProductNumber,
                MainProcessType: orderForm.value.mainProcessType,
                ProductBatchSetup: {
                    IsUseBatch: orderForm.value.productBatchSetup.isUseBatch,
                    NumberOfProductsPerBatch: orderForm.value.productBatchSetup.isUseBatch
                        ? orderForm.value.productBatchSetup.numberOfProductsPerBatch
                        : 0
                },
                SubProcessList: subProcessArray
            }

            if (isEditMode.value && editingOrderID.value) {
                // 更新訂單
                await updateConsumerOrder(editingOrderID.value, orderData)
                ElMessage.success('訂單更新成功')
            } else {
                // 創建訂單
                //檢查訂單是否存在
                const order = orderStore.orders.find(order => order.orderID === orderData.OrderID);
                if (order) {
                    ElMessage.error(`訂單 ID(${orderData.OrderID}) 已存在, 請確認是否為同一訂單`)
                    return
                }
                await createConsumerOrder(orderData)
                ElMessage.success('訂單創建成功')
            }

            dialogVisible.value = false
            resetForm()
            // 刷新訂單列表
            await orderStore.fetchOrders()
        } catch (error) {
            ElMessage.error('創建訂單失敗')
        } finally {
            submitting.value = false
        }
    })
}

// 查看訂單詳情
const handleView = (row) => {
    selectedOrder.value = row
    viewDialogVisible.value = true
}

// 刪除訂單
const handleDelete = async (row) => {
    try {
        const result = await ElMessageBox.confirm('確定要刪除此訂單嗎？', '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        if (result === 'confirm') {
            // TODO: 調用刪除 API
            await deleteConsumerOrder(row.orderID)
            ElMessage.success('訂單已刪除')
            await orderStore.fetchOrders()
        }
    } catch (error) {
        ElMessage.error('刪除訂單失敗')
    }
}

onMounted(async () => {
    loading.value = true
    try {
        await orderStore.fetchOrders()
    } catch (error) {
        ElMessage.error('載入訂單數據失敗')
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.consumer-order-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.consumer-order-page .el-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.consumer-order-page .el-card :deep(.el-card__body) {
    flex: 1;
    overflow: auto;
    padding: 20px;
}

.consumer-order-page .el-table {
    width: 100%;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.batch-info {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
}

.sub-process-list {
    width: 100%;
}

.sub-process-item {
    margin-bottom: 12px;
}

.sub-process-card {
    margin-bottom: 0;
}

.sub-process-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sub-process-display {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.text-muted {
    color: #909399;
    font-style: italic;
}

.form-hint {
    margin-top: 4px;
}
</style>
