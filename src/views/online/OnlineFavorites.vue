<script setup lang="ts">
import { ref } from 'vue'
import GridContainer from '@/components/GridContainer.vue'

const activeFav = ref(0) // 当前选中的收藏夹 0-9
const currentPage = ref(1)
const totalPages = ref(6)

// E 站 Fav 0 - Fav 9 的 10 种经典代表配色
const favColors = [
  '#444444', // Fav 0 (黑色/暗灰)
  '#d00000', // Fav 1 (红色)
  '#e06000', // Fav 2 (橙色)
  '#c09000', // Fav 3 (黄色)
  '#009000', // Fav 4 (绿色)
  '#50a000', // Fav 5 (浅绿)
  '#0080a0', // Fav 6 (青色)
  '#0040c0', // Fav 7 (蓝色)
  '#7000b0', // Fav 8 (紫色)
  '#c00070', // Fav 9 (粉色)
]

// 模拟数据
const items = ref(
  Array.from({ length: 25 }, (_, i) => ({
    id: `fav-item-${i + 1}`,
    title: `⭐ 收藏夹 Favorites ${activeFav.value} 中的作品 #${i + 1}`,
  })),
)

const selectFav = (favIndex: number) => {
  activeFav.value = favIndex
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>

<template>
  <div class="favorites-page">
    <!-- 2x5 网格顶栏 -->
    <div class="fav-grid">
      <button
        v-for="i in 10"
        :key="i - 1"
        class="fav-btn"
        :class="{ active: activeFav === i - 1 }"
        :style="{
          '--fav-color': favColors[i - 1],
          backgroundColor: activeFav === i - 1 ? favColors[i - 1] : '#1a1a1a',
          borderColor: activeFav === i - 1 ? favColors[i - 1] : '#2a2a2a',
        }"
        @click="selectFav(i - 1)"
      >
        <span class="fav-dot" :style="{ backgroundColor: favColors[i - 1] }"></span>
        Favorite {{ i - 1 }}
      </button>
    </div>

    <!-- 列表展现区 -->
    <GridContainer
      :items="items"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.favorites-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* 2 行 5 列网格布局 */
.fav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 强制分成 5 列等宽 */
  gap: 8px; /* 按钮间距 */
  padding-bottom: 12px;
  border-bottom: 1px solid #2a2a2a;
}

.fav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  color: #aaa;
  border: 1px solid #2a2a2a;
  padding: 8px 0; /* 稍微拉高点击区域 */
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fav-btn:hover {
  border-color: var(--fav-color) !important;
  color: #fff;
}

.fav-btn.active {
  color: #fff;
  font-weight: bold;
  box-shadow: 0 0 8px var(--fav-color);
}

.fav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>
