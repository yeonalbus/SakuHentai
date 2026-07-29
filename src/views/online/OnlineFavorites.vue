<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import GridContainer from '@/components/GridContainer.vue'
import { generateOnlineComics } from '@/utils/mockData'
import type { OnlineComic } from '@/types/comic'

const activeFav = ref(0) // 当前选中的收藏夹 0 ~ 9
const currentPage = ref(1)
const pageSize = 24

// E 站 10 色 Favorite 经典代表配色
const favColors = [
  '#7f7f7f', // Fav 0 (灰色/深灰)
  '#f00000', // Fav 1 (红色)
  '#ff7800', // Fav 2 (橙色)
  '#f0d000', // Fav 3 (黄色)
  '#00a000', // Fav 4 (绿色)
  '#98e020', // Fav 5 (浅绿)
  '#00a0a0', // Fav 6 (青色)
  '#0000f0', // Fav 7 (蓝色)
  '#a000a0', // Fav 8 (紫色)
  '#f000a0', // Fav 9 (粉色)
]

// 1. 根据当前选中的 activeFav，动态生成该收藏夹下的本子列表 (例如生成 48 条，共 2 页)
const favComicList = ref<OnlineComic[]>([])

const loadFavData = () => {
  // 随机生成 30 ~ 60 条数据模拟当前收藏夹收藏的内容
  const count = Math.floor(Math.random() * 30) + 30
  favComicList.value = generateOnlineComics(count).map((item, i) => ({
    ...item,
    id: `fav-${activeFav.value}-${i + 1}`,
    title: `⭐ [Fav ${activeFav.value}] ${item.title.replace(/^\[Hanazono\]\s*/, '')}`,
    isFavorite: true,
    favIndex: activeFav.value, // 强行绑定当前选中的 Fav 颜色
  }))
}

// 初始化与切换收藏夹时重新加载数据
watch(
  activeFav,
  () => {
    currentPage.value = 1
    loadFavData()
  },
  { immediate: true },
)

// 2. 分页切片计算
const totalPages = computed(() => Math.ceil(favComicList.value.length / pageSize))

const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return favComicList.value.slice(start, start + pageSize)
})

const selectFav = (favIndex: number) => {
  activeFav.value = favIndex
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="favorites-page">
    <div class="fav-grid">
      <button
        v-for="i in 10"
        :key="i - 1"
        class="fav-btn"
        :class="{ active: activeFav === i - 1 }"
        :style="{
          backgroundColor: activeFav === i - 1 ? favColors[i - 1] : '#1a1a1d',
          borderColor: activeFav === i - 1 ? favColors[i - 1] : '#2a2a2d',
          color: activeFav === i - 1 ? '#ffffff' : '#aaa',
        }"
        @click="selectFav(i - 1)"
      >
        <span class="fav-dot" :style="{ backgroundColor: favColors[i - 1] }"></span>
        Favorites {{ i - 1 }}
      </button>
    </div>

    <GridContainer
      :items="currentPageItems"
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
  padding: 20px;
  min-height: 100%;
}

/* 2 行 5 列网格布局 */
.fav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 列等宽 */
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a2a2a;
}

.fav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #2a2a2d;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.fav-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.15);
}

.fav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
