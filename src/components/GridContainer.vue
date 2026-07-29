<script setup lang="ts">
import { viewMode } from '@/stores/viewMode'
import PagiNation from './PagiNation.vue'
import ItemCard from './ItemCard.vue'

// 规定传入的数据项基础格式,any得改成unknown
interface Item {
  id: string | number
  title: string
  [key: string]: unknown
}

defineProps<{
  items: Item[]
  currentPage?: number
  totalPages?: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()
</script>

<template>
  <div class="grid-container-wrapper">
    <!-- 核心：根据全局 viewMode 动态绑类名，切换 CSS Grid 列数 -->
    <div class="card-grid" :class="viewMode">
      <!-- 卡片... -->
      <ItemCard v-for="item in items" :key="item.id" :title="item.title" />
    </div>

    <!-- 用新封装的分页组件直接替换原来的 footer -->
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @change="(page) => emit('page-change', page)"
    />
  </div>
</template>

<style scoped>
.grid-container-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  gap: 20px;
}

/* 网格基础布局 */
.card-grid {
  display: grid;
  gap: 16px;
  flex: 1;
}

/* ─── 1. 卡片模式：5 列布局 (5x5，单页 25 条) ─── */
.card-grid.card {
  grid-template-columns: repeat(4, 1fr);
}

/* ─── 2. 名片模式：支持 3 列 (3x8，单页 24 条) 或 2 列 (2x12) ─── */
.card-grid.compact {
  /* 目前设定为 3 列（3x8）。如果想切成 2 列（2x12），只需把 3 改成 2 即可
     如果想要修改名片内容，去ItenCard，这里只负责布局
  */
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 底部分页栏样式 */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #2a2a2a;
  margin-top: auto;
}

.page-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #3a3a3a;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #007acc;
  border-color: #007acc;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  color: #888;
  font-size: 0.9rem;
}
</style>
