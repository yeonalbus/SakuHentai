<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { bookshelves } from '@/stores/appStore'
import GridContainer from '@/components/GridContainer.vue'
import { generateOfflineComics } from '@/utils/mockData'
import type { OfflineComic } from '@/types/comic'

const route = useRoute()

// 1. 根据 URL 里的 ?id= 匹配当前书架信息
const currentShelfId = computed(() => (route.query.id as string) || '')

const currentShelf = computed(() => {
  return (
    bookshelves.value.find((s) => s.id === currentShelfId.value) || {
      id: 'unknown',
      name: '离线书架',
      count: 0,
    }
  )
})

// 2. 模拟该书架收录的本地漫画数据
const shelfComics = ref<OfflineComic[]>([])
const currentPage = ref(1)
const pageSize = 24

// 当切换书架 ID 时，重新生成该书架专属的模拟本子
watch(
  currentShelfId,
  () => {
    currentPage.value = 1
    // 这里随机生成 15 - 40 条数据模拟书架内容
    const mockCount = Math.floor(Math.random() * 25) + 15
    shelfComics.value = generateOfflineComics(mockCount)
    // 更新当前书架的数据统计
    currentShelf.value.count = mockCount
  },
  { immediate: true },
)

const totalPages = computed(() => Math.ceil(shelfComics.value.length / pageSize))

const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return shelfComics.value.slice(start, start + pageSize)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="offline-bookshelf-view">
    <div class="shelf-header">
      <div class="title-area">
        <span class="icon">📁</span>
        <h2 class="shelf-title">{{ currentShelf.name }}</h2>
        <span class="shelf-badge">{{ shelfComics.length }} 部作品</span>
      </div>
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
.offline-bookshelf-view {
  padding: 20px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shelf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a2a2a;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 1.5rem;
}

.shelf-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.shelf-badge {
  font-size: 0.75rem;
  background-color: rgba(0, 122, 204, 0.2);
  color: #007acc;
  border: 1px solid rgba(0, 122, 204, 0.4);
  padding: 2px 8px;
  border-radius: 12px;
}
</style>
