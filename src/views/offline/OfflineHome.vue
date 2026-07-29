<script setup lang="ts">
import { ref, computed } from 'vue'
import GridContainer from '@/components/GridContainer.vue'
import { generateOfflineComics } from '@/utils/mockData'
import type { OfflineComic } from '@/types/comic'

// 1. 生成 192 条本地离线作品数据（刚好 8 页，每页 24 条）
const allOfflineComics = ref<OfflineComic[]>(generateOfflineComics(192))

// 2. 分页控制逻辑
const pageSize = 24
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(allOfflineComics.value.length / pageSize))

// 动态计算当前页切片
const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allOfflineComics.value.slice(start, start + pageSize)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="page-wrapper">
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
}
</style>
