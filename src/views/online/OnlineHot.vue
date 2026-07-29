<script setup lang="ts">
import { ref, computed } from 'vue'
import GridContainer from '@/components/GridContainer.vue'
import { generateOnlineComics } from '@/utils/mockData'

// 1. 生成 192 条热门画作数据（刚好 8 页，每页 24 条）
const allHotComics = ref(
  generateOnlineComics(192).map((comic, i) => ({
    ...comic,
    id: `online-hot-${i + 1}`,
    title: `🔥 [全站热播] ${comic.title.replace(/^\[Hanazono\]\s*/, '')}`,
  })),
)

// 2. 分页控制逻辑
const pageSize = 24
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(allHotComics.value.length / pageSize))

// 动态计算当前页数据切片
const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allHotComics.value.slice(start, start + pageSize)
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
