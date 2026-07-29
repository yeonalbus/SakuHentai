<script setup lang="ts">
import { ref } from 'vue'
import GridContainer from '@/components/GridContainer.vue'

const currentPage = ref(1)
const totalPages = ref(2)

const items = ref(
  Array.from({ length: 24 }, (_, i) => ({
    id: `offline-up-${i + 1}`,
    title: `🔄 本地检测到有新话/增补的作品 #${i + 1}`,
  })),
)

const handlePageChange = (page: number) => {
  currentPage.value = page
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
