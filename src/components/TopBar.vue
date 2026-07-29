<script setup lang="ts">
import RandomPicker from './RandomPicker.vue'
import FilterBar from './FilterBar.vue'
import SearchBar from './SearchBar.vue'
import ReadingList from './ReadingList.vue'
</script>

<template>
  <header class="top-bar">
    <!-- 按从左到右的顺序依次摆放 -->
    <RandomPicker />
    <FilterBar />
    <SearchBar />
    <ReadingList />
  </header>
</template>

<style scoped>
.top-bar {
  height: 56px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px; /* 内部每个零件之间的间距 */
}
</style>
