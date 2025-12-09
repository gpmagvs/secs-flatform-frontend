<template>
    <el-header class="app-header">
        <div class="header-container">
            <!-- Logo 和标题 -->
            <div class="header-logo">
                <h2 class="logo-text">SECS Platform</h2>
            </div>

            <!-- 导航菜单 -->
            <el-menu :default-active="activeMenu" mode="horizontal" class="header-menu" @select="handleMenuSelect"
                :ellipsis="false">
                <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
                    <el-icon v-if="item.icon">
                        <component :is="item.icon" />
                    </el-icon>
                    <span>{{ item.title }}</span>
                </el-menu-item>
            </el-menu>

            <!-- 右侧操作区 -->
            <div class="header-actions">
                <el-dropdown trigger="click">
                    <span class="user-info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span class="username">用戶</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>個人設置</el-dropdown-item>
                            <el-dropdown-item divided>退出登錄</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    House,
    Document,
    Setting,
    Bell,
    DataAnalysis,
    User
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 菜单配置
const menuItems = [
    {
        path: '/',
        title: '首頁',
        icon: House
    },
    {
        path: '/consumer-order',
        title: '客戶訂單',
        icon: Document
    },
    {
        path: '/device',
        title: '設備管理',
        icon: Setting
    },
    {
        path: '/order',
        title: '任務管理',
        icon: Document
    },
    {
        path: '/alarm',
        title: '警報中心',
        icon: Bell
    },
    {
        path: '/monitor',
        title: '監控面板',
        icon: DataAnalysis
    },
    {
        path: '/api-example',
        title: 'API 範例',
        icon: Document
    }
]

// 当前激活的菜单项
const activeMenu = computed(() => {
    return route.path
})

// 处理菜单选择
const handleMenuSelect = (path) => {
    router.push(path)
}
</script>

<style scoped>
.app-header {
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-container {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 0 20px;
}

.header-logo {
    display: flex;
    align-items: center;
    margin-right: 40px;
}

.logo-text {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #409eff;
    white-space: nowrap;
}

.header-menu {
    flex: 1;
    border-bottom: none;
    background-color: transparent;
}

.header-menu .el-menu-item {
    height: 60px;
    line-height: 60px;
    border-bottom: none;
}

.header-menu .el-menu-item:hover {
    background-color: #ecf5ff;
}

.header-menu .el-menu-item.is-active {
    color: #409eff;
    border-bottom: 2px solid #409eff;
}

.header-actions {
    display: flex;
    align-items: center;
    margin-left: auto;
}

.user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.user-info:hover {
    background-color: #f5f7fa;
}

.user-info .el-icon {
    margin-right: 6px;
    font-size: 18px;
}

.username {
    margin-right: 4px;
    font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header-container {
        padding: 0 10px;
    }

    .header-logo {
        margin-right: 10px;
    }

    .logo-text {
        font-size: 16px;
    }

    .header-menu {
        flex: 1;
        overflow-x: auto;
    }

    .header-menu .el-menu-item {
        padding: 0 10px;
        font-size: 14px;
    }
}
</style>
