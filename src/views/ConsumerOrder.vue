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
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 創建訂單對話框 -->
        <el-dialog v-model="dialogVisible" title="新增客戶訂單" width="600px" @close="resetForm">
            <el-form ref="orderFormRef" :model="orderForm" :rules="formRules" label-width="140px">
                <el-form-item label="訂單ID" prop="orderID">
                    <el-input v-model="orderForm.orderID" placeholder="請輸入訂單ID" />
                </el-form-item>

                <el-form-item label="總產品數量" prop="totalProductNumber">
                    <el-input-number v-model="orderForm.totalProductNumber" :min="1" :max="1000" placeholder="請輸入總產品數量"
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
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitting">確定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看訂單詳情對話框 -->
        <el-dialog v-model="viewDialogVisible" title="訂單詳情" width="600px">
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
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConsumerOrderStore } from '@/store/consumerOrder'
import { createConsumerOrder } from '@/api/services/consumerOrder'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const orderStore = useConsumerOrderStore()
const loading = ref(false)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const submitting = ref(false)
const orderFormRef = ref(null)
const selectedOrder = ref(null)

const orders = computed(() => orderStore.orders)

// 製程類型選項 (對應 C# 枚舉值: 0=AOI_AOS_INSPECTION, 1=YELLOW_LIGHT_AREA, 2=MOLDING_AND_BAKING)
const processTypes = [
    { label: '光學檢測製程', value: 0 },
    { label: '黃光區製程', value: 1 },
    { label: '壓模與烘烤製程', value: 2 }
]

// 訂單表單
const orderForm = ref({
    orderID: '',
    totalProductNumber: 1,
    mainProcessType: 2, // 默認為壓模與烘烤製程
    productBatchSetup: {
        isUseBatch: false,
        numberOfProductsPerBatch: 2
    }
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
    dialogVisible.value = true
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
        }
    }
    orderFormRef.value?.clearValidate()
}

// 提交表單
const handleSubmit = async () => {
    if (!orderFormRef.value) return

    await orderFormRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
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
                }
            }

            await createConsumerOrder(orderData)
            ElMessage.success('訂單創建成功')
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
        await ElMessageBox.confirm('確定要刪除此訂單嗎？', '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        // TODO: 調用刪除 API
        ElMessage.success('訂單已刪除')
        await orderStore.fetchOrders()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('刪除訂單失敗')
        }
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
</style>
