<script setup lang="ts">
import { ref } from 'vue'
import GridContainer from '@/components/GridContainer.vue'

const currentPage = ref(1)
const totalPages = ref(10)

// 模拟在线首页数据
const items = ref(
  Array.from({ length: 24 }, (_, i) => ({
    id: `online-home-${i + 1}`,
    title: `🌐 在线热门推荐资源 #${i + 1}`,
  })),
)

const handlePageChange = (page: number) => {
  currentPage.value = page
  // 后续在这里对接后端接口获取新一页数据
}
</script>

<template>
  <div class="page-wrapper">
    <GridContainer
      :items="items"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.page-wrapper {
  height: 100%;
}
</style>
