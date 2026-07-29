<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 核心优化：动态根据当前路由路径是否以 /online 开头来判定状态
// 这样即使用户在地址栏手动输入 URL 或通过侧边栏跳转，按钮文字图标也会 100% 保持精准同步
const isOnline = computed(() => route.path.startsWith('/online'))

const toggleMode = () => {
  // 当前是在线模式，点击切换到离线首页；反之切回在线首页
  if (isOnline.value) {
    router.push('/offline/home')
  } else {
    router.push('/online/home')
  }
}
</script>

<template>
  <button
    type="button"
    class="mode-toggle-btn"
    :title="isOnline ? '当前在线模式，点击切换为离线' : '当前离线模式，点击切换为在线'"
    @click="toggleMode"
  >
    <span class="icon">{{ isOnline ? '☀️' : '🌙' }}</span>
    <span class="label">{{ isOnline ? '在线' : '离线' }}</span>
  </button>
</template>

<style scoped>
.mode-toggle-btn {
  background-color: #242424;
  border: 1px solid #3a3a3a;
  color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  user-select: none;
}

.mode-toggle-btn:hover {
  background-color: #323232;
  border-color: #007acc;
}

.icon {
  font-size: 0.9rem;
}

.label {
  font-size: 0.75rem;
  color: #aaa;
}
</style>
