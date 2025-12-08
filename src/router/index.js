import { createRouter, createWebHistory } from 'vue-router'
import ApiExample from '@/api/example.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首頁'
    }
  },
  {
    path: '/device',
    name: 'Device',
    component: () => import('@/views/Device.vue'),
    meta: {
      title: '設備管理'
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order.vue'),
    meta: {
      title: '訂單管理'
    }
  },
  {
    path: '/consumer-order',
    name: 'ConsumerOrder',
    component: () => import('@/views/ConsumerOrder.vue'),
    meta: {
      title: '客戶訂單管理'
    }
  },
  {
    path: '/alarm',
    name: 'Alarm',
    component: () => import('@/views/Alarm.vue'),
    meta: {
      title: '警報中心',
    }
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import('@/views/Monitor.vue'),
    meta: {
      title: '監控面板'
    }
  },
  {
    path: '/api-example',
    name: 'ApiExample',
    component: ApiExample,
    meta: {
      title: 'API 範例',
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - SECS Platform`
  }
  next()
})

export default router

