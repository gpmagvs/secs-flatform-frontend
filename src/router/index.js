import { createRouter, createWebHistory } from 'vue-router'
import ApiExample from '@/api/example.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/api-example',
    name: 'ApiExample',
    component: ApiExample
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

