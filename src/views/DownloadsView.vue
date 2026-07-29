<script setup lang="ts">
import { ref } from 'vue'

// 模拟下载任务状态
const tasks = ref([
  {
    id: 1,
    title: '[画师名] 热门长篇全彩漫画集 [350P]',
    progress: 68,
    speed: '4.2 MB/s',
    status: 'downloading', // downloading | paused | error_lock | error
  },
  {
    id: 2,
    title: '高画质限定本子资源 C102',
    progress: 42,
    speed: '0 KB/s',
    status: 'error_lock', // 需要点击解锁
  },
  {
    id: 3,
    title: '离线离线存档打包文件',
    progress: 100,
    speed: '已完成',
    status: 'completed',
  },
])

const handleUnlock = (taskId: number) => {
  // 修改前: alert(`触发解封/解锁逻辑，解锁任务 ID: ${taskId}`)
  window.alert(`触发解封/解锁逻辑，解锁任务 ID: ${taskId}`)
}
</script>

<template>
  <div class="downloads-page">
    <h2 class="page-title">⬇️ 下载任务列表</h2>

    <div class="task-list">
      <div v-for="task in tasks" :key="task.id" class="download-card">
        <!-- 封面图 -->
        <div class="cover-box">🖼️</div>

        <!-- 详细数据栏 -->
        <div class="task-info">
          <div class="task-header">
            <span class="task-title">{{ task.title }}</span>
            <span class="task-speed">{{ task.speed }}</span>
          </div>

          <!-- 进度条 -->
          <div class="progress-bar-bg">
            <div
              class="progress-bar-fill"
              :class="task.status"
              :style="{ width: task.progress + '%' }"
            ></div>
          </div>

          <!-- 底部状态指示器与错误拦截处理 -->
          <div class="task-footer">
            <span class="progress-text">{{ task.progress }}%</span>

            <!-- 报错/锁阻断提醒 -->
            <button
              v-if="task.status === 'error_lock'"
              class="status-tag lock-btn"
              @click="handleUnlock(task.id)"
            >
              🔒 需要配额/GP解锁 (点击处理)
            </button>
            <span v-else-if="task.status === 'downloading'" class="status-tag downloading">
              正在下载...
            </span>
            <span v-else-if="task.status === 'completed'" class="status-tag completed">
              ✓ 完成
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.downloads-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title {
  font-size: 1.3rem;
  color: #fff;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.download-card {
  display: flex;
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 12px;
  gap: 16px;
  align-items: center;
}

.cover-box {
  width: 60px;
  height: 80px;
  background-color: #262626;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #e0e0e0;
}

.task-speed {
  color: #007acc;
  font-family: monospace;
}

/* 进度条样式 */
.progress-bar-bg {
  height: 6px;
  background-color: #262626;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #007acc;
  transition: width 0.3s ease;
}
.progress-bar-fill.error_lock {
  background-color: #e6a23c;
}
.progress-bar-fill.completed {
  background-color: #67c23a;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #888;
}

.status-tag.lock-btn {
  background-color: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
  border: 1px solid #e6a23c;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.status-tag.lock-btn:hover {
  background-color: #e6a23c;
  color: #000;
}
</style>
