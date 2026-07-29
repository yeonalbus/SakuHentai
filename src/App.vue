<template>
  <!--搭建应用外壳-->
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo">E-Manager</div>

      <nav class="nav-menu">
        <div class="nav-group">
          <span class="group-title">🌐 在线模式</span>
          <router-link to="/online/home">首页</router-link>
          <router-link to="/online/favorites">我的收藏</router-link>
        </div>

        <div class="nav-group">
          <span class="group-title">📚 离线书库</span>
          <router-link to="/offline/home">离线首页</router-link>
        </div>

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
  width: 220px;
  background-color: #1a1a1a;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
}
.logo {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007acc;
  padding: 0 10px 20px;
  border-bottom: 1px solid #2a2a2a;
  margin-bottom: 15px;
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
/* Vue Router 自动追加的当前激活菜单样式 */
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
