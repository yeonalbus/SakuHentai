//配置路由表
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

//显式声明 : RouteRecordRaw[]
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/online/home',
  },
  {
    path: '/online/home',
    name: 'OnlineHome',
    component: () => import('@/views/online/OnlineHome.vue'),
  },
  {
    path: '/online/favorites',
    name: 'OnlineFavorites',
    component: () => import('@/views/online/OnlineFavorites.vue'),
  },
  {
    path: '/offline/home',
    name: 'OfflineHome',
    component: () => import('@/views/offline/OfflineHome.vue'),
  },
  {
    path: '/downloads',
    name: 'Downloads',
    component: () => import('@/views/DownloadsView.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
