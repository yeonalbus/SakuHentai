<script setup lang="ts">
import { ref, computed } from 'vue'
import GridContainer from '@/components/GridContainer.vue'
import { generateOnlineComics } from '@/utils/mockData'
import { useUI } from '@/composables/useUI'
import type { OnlineComic } from '@/types/comic'

const { modal, toast } = useUI()

// 1. 生成 72 条历史浏览记录（刚好 3 页）
const historyComics = ref<OnlineComic[]>(
  generateOnlineComics(72).map((comic, i) => ({
    ...comic,
    id: `online-his-${i + 1}`,
    title: `🕒 [浏览历史] ${comic.title.replace(/^\[Hanazono\]\s*/, '')}`,
    updatedAt: `2026-07-29 ${18 - Math.floor(i / 4)}:20`, // 模拟今天不同时间段看的记录
  })),
)

const pageSize = 24
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(historyComics.value.length / pageSize))

const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return historyComics.value.slice(start, start + pageSize)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 清空浏览历史记录
const handleClearHistory = async () => {
  const confirmed = await modal.confirm('确定要清空所有的在线浏览历史记录吗？', '清空历史')
  if (confirmed) {
    historyComics.value = []
    toast.info('在线浏览历史记录已清空')
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="history-header">
      <div class="header-left">
        <h2 class="title">🕒 在线浏览历史</h2>
        <span class="count-badge">共 {{ historyComics.length }} 条记录</span>
      </div>

      <button v-if="historyComics.length > 0" class="clear-btn" @click="handleClearHistory">
        🗑️ 清空历史记录
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
.page-wrapper {
  padding: 20px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a2a2a;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.count-badge {
  font-size: 0.75rem;
  color: #888;
  background-color: #222225;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #333;
}

.clear-btn {
  background: transparent;
  border: 1px solid #3a3a3a;
  color: #aaa;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}
</style>
