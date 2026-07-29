<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ModeToggle from '@/components/ModeToggle.vue'
// 1. 引入两个侧边栏组件
import OnlineSidebar from '@/components/OnlineSidebar.vue'
import OfflineSidebar from '@/components/OfflineSidebar.vue'

const route = useRoute()

// 2. 实时计算：如果当前路径以 '/online' 开头，就判定为在线模式
const isOnlineMode = computed(() => route.path.startsWith('/online'))
</script>

<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo-area">
        <span class="logo">E-Manager</span>
        <ModeToggle />
      </div>

      <nav class="nav-menu">
        <!-- 3. 用 v-if / v-else 切换对应的组件 -->
        <OnlineSidebar v-if="isOnlineMode" />
        <OfflineSidebar v-else />

        <!-- 全局通用的系统菜单保留在底部 -->
        <div class="nav-group">
          <span class="group-title">⚙️ 系统</span>
          <router-link to="/downloads">下载列表</router-link>
          <router-link to="/settings">系统设置</router-link>
        </div>
      </nav>
    </aside>

    <!-- 右侧主体内容显示区域 -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* 全局基础重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  background-color: #121212;
  color: #e0e0e0;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 240px;
  background-color: #1a1a1a;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
}

/* 让 Logo 标题和按钮在同一行并排显示 */
.logo-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px 20px 5px;
  border-bottom: 1px solid #2a2a2a;
  margin-bottom: 15px;
}

.logo {
  font-size: 1.1rem;
  font-weight: bold;
  color: #007acc;
}

.nav-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.group-title {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 8px;
  padding-left: 10px;
}

.nav-menu a {
  color: #aaa;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 2px;
  transition: all 0.2s;
}
.nav-menu a:hover {
  background-color: #2a2a2a;
  color: #fff;
}
.nav-menu a.router-link-active {
  background-color: #007acc;
  color: #fff;
  font-weight: bold;
}

/* 主区域样式 */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
