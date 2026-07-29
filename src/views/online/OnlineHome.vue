<script setup lang="ts">
import { ref, computed } from 'vue'
import GridContainer from '@/components/GridContainer.vue'
import { generateOnlineComics } from '@/utils/mockData'

// 1. 一次性生成 108 条单机模拟数据
const allComics = ref(generateOnlineComics(108))

// 2. 分页逻辑控制
const pageSize = 24 // 每页显示 12 条
const currentPage = ref(1)

// 动态计算总页数 (108 / 12 = 9 页)
const totalPages = computed(() => Math.ceil(allComics.value.length / pageSize))

// 动态切片展示当前页的数据
const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allComics.value.slice(start, start + pageSize)
})

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  // 切换页面时滚动回顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="online-home-view">
    <GridContainer
      :items="currentPageItems"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.online-home-view {
  padding: 20px;
  min-height: 100%;
}
</style>
