<script setup lang="ts">
import { ref, computed } from 'vue'
import GridContainer from '@/components/GridContainer.vue'
import { generateOnlineComics } from '@/utils/mockData'

// 1. 生成 120 条关注作者更新数据（刚好 5 页，每页 24 条）
const allSubComics = ref(
  generateOnlineComics(120).map((comic, i) => ({
    ...comic,
    id: `online-sub-${i + 1}`,
    title: `📡 [订阅更新] ${comic.title.replace(/^\[Hanazono\]\s*/, '')}`,
  })),
)

// 2. 分页控制逻辑
const pageSize = 24
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(allSubComics.value.length / pageSize))

// 动态计算当前页数据切片
const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allSubComics.value.slice(start, start + pageSize)
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
