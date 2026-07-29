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
    path: '/online/hot',
    name: 'OnlineHot',
    component: () => import('@/views/online/OnlineHot.vue'),
  },
  {
    path: '/online/sub',
    name: 'OnlineSub',
    component: () => import('@/views/online/OnlineSub.vue'),
  },
  {
    path: '/online/history',
    name: 'OnlineHistory',
    component: () => import('@/views/online/OnlineHistory.vue'),
  },
  {
    path: '/online/toplist',
    name: 'OnlineTop',
    component: () => import('@/views/online/OnlineTop.vue'),
  },
  {
    path: '/offline/home',
    name: 'OfflineHome',
    component: () => import('@/views/offline/OfflineHome.vue'),
  },
  {
    path: '/offline/update',
    name: 'OfflineUpdate',
    component: () => import('@/views/offline/OfflineUpdate.vue'),
  },
  {
    path: '/offline/bookcase',
    name: 'OfflineBookcase',
    component: () => import('@/views/offline/OfflineBookcase.vue'),
  },
  {
    path: '/offline/maintain',
    name: 'OfflineMaintain',
    component: () => import('@/views/offline/OfflineMaintain.vue'),
  },
  {
    path: '/offline/toplist',
    name: 'OfflineToplist',
    component: () => import('@/views/offline/OfflineToplist.vue'),
  },
  {
    path: '/offline/history',
    name: 'OfflineHistory',
    component: () => import('@/views/offline/OfflineHistory.vue'),
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
  {
    path: '/:pathMatch(.*)*',
    redirect: '/NotFound', // 或指向专门的 404 组件
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
