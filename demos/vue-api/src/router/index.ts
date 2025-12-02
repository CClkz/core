import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/api',
    name: 'HomeApi',
    component: () => import('@/views/HomeApi.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
