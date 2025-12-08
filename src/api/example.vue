<template>
    <div class="api-example">
        <el-card>
            <template #header>
                <h3>API 使用示例</h3>
            </template>

            <el-space direction="vertical" style="width: 100%">
                <!-- 基本请求示例 -->
                <el-card shadow="hover">
                    <h4>1. 基本 GET 请求</h4>
                    <el-button @click="handleGetAlarmList">获取告警列表</el-button>
                    <pre v-if="alarmList">{{ JSON.stringify(alarmList, null, 2) }}</pre>
                </el-card>

                <!-- 带参数请求示例 -->
                <el-card shadow="hover">
                    <h4>2. 带参数的请求</h4>
                    <el-button @click="handleGetVehicleState">获取车辆状态</el-button>
                    <pre v-if="vehicleState">{{ JSON.stringify(vehicleState, null, 2) }}</pre>
                </el-card>

                <!-- POST 请求示例 -->
                <el-card shadow="hover">
                    <h4>3. POST 请求</h4>
                    <el-button @click="handleCreateAlarm">创建告警</el-button>
                    <pre v-if="createdAlarm">{{ JSON.stringify(createdAlarm, null, 2) }}</pre>
                </el-card>

                <!-- 错误处理示例 -->
                <el-card shadow="hover">
                    <h4>4. 错误处理</h4>
                    <el-button @click="handleErrorRequest">测试错误处理</el-button>
                </el-card>
            </el-space>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAlarmList, getVehicleState, createAlarm } from '@/api/services'
import { get } from '@/api'

const alarmList = ref(null)
const vehicleState = ref(null)
const createdAlarm = ref(null)

// 示例 1: 基本 GET 请求
async function handleGetAlarmList() {
    try {
        alarmList.value = await getAlarmList({
            page: 1,
            pageSize: 10
        })
        ElMessage.success('获取告警列表成功')
    } catch (error) {
        console.error('获取告警列表失败:', error)
    }
}

// 示例 2: 获取车辆状态
async function handleGetVehicleState() {
    try {
        vehicleState.value = await getVehicleState()
        ElMessage.success('获取车辆状态成功')
    } catch (error) {
        console.error('获取车辆状态失败:', error)
    }
}

// 示例 3: POST 请求
async function handleCreateAlarm() {
    try {
        createdAlarm.value = await createAlarm({
            title: '测试告警',
            level: 'info',
            message: '这是一个测试告警',
            timestamp: new Date().toISOString()
        })
        ElMessage.success('创建告警成功')
    } catch (error) {
        console.error('创建告警失败:', error)
    }
}

// 示例 4: 错误处理
async function handleErrorRequest() {
    try {
        // 请求一个不存在的端点来测试错误处理
        await get('/api/nonexistent', {}, {
            showError: true // 会显示错误消息
        })
    } catch (error) {
        console.error('请求失败:', error)
        // 错误消息已经通过拦截器自动显示了
    }
}
</script>

<style scoped>
.api-example {
    padding: 20px;
}

pre {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    margin-top: 10px;
}
</style>
