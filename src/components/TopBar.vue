<script setup lang="ts">
import { ref } from 'vue'
import RandomPicker from './RandomPicker.vue'
import FilterDrawer from './FilterDrawer.vue'
import SearchBar from './SearchBar.vue'
import ReadingList from './ReadingList.vue'
import { useUI } from '@/composables/useUI'

const { toast } = useUI()

// 1. 控制筛选抽屉显隐的响应式变量
const isFilterOpen = ref(false)

// 2. 处理筛选应用逻辑
const handleApplyFilters = (filters: any) => {
  console.log('应用筛选条件：', filters)
  toast.success('筛选条件已生效')
  // 这里后续可将 filters 写入 store 或触发全局列表刷新
}
</script>

<template>
  <header class="top-bar">
    <!-- 1. 随机抽卡 -->
    <RandomPicker />

    <!-- 2. 筛选按钮 + 抽屉组件 -->
    <button class="filter-trigger-btn" @click="isFilterOpen = true">
      <span>⚙️ 筛选</span>
    </button>
    <FilterDrawer v-model:visible="isFilterOpen" @apply="handleApplyFilters" />

    <!-- 3. 搜索栏 (自适应拉伸占满剩余空间) -->
    <div class="search-wrapper">
      <SearchBar />
    </div>

    <!-- 4. 离线/在线阅读书架或清单 -->
    <ReadingList />
  </header>
</template>

<style scoped>
.top-bar {
  height: 56px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px; /* 内部零件之间的间距 */
}

/* 筛选按钮样式 */
.filter-trigger-btn {
  background-color: #242428;
  border: 1px solid #3a3a3d;
  color: #ccc;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.filter-trigger-btn:hover {
  background-color: #2e2e33;
  border-color: #007acc;
  color: #fff;
}

/* 搜索栏外壳，自动吸收剩余宽度 */
.search-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}
</style>
