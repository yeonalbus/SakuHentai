<script setup lang="ts">
import { ref } from 'vue'
// 控制书架菜单的展开/折叠状态
const isBookshelfOpen = ref(false)

// 模拟用户创建的书架列表
const customBookshelves = ref([
  { id: 'fav-all', name: '必看精品', count: 12 },
  { id: 'fav-artist', name: '特定画师合集', count: 45 },
  { id: 'fav-temp', name: '待分类缓存', count: 8 },
])

const toggleBookshelf = () => {
  isBookshelfOpen.value = !isBookshelfOpen.value
}

const createNewBookshelf = () => {
  // 修改前: const name = prompt('请输入新书架名称：')
  const name = window.prompt('请输入新书架名称：')
  if (name) {
    customBookshelves.value.push({
      id: `shelf-${Date.now()}`,
      name,
      count: 0,
    })
  }
}
</script>

<template>
  <div class="nav-group">
    <span class="group-title">📚 离线模式</span>
    <router-link to="/offline/home">首页</router-link>
    <router-link to="/offline/update">更新</router-link>
    <router-link to="/offline/maintain">维护</router-link>
    <router-link to="/offline/toplist">排行榜</router-link>
    <router-link to="/offline/history">历史记录</router-link>
    <!-- 可折叠的书架父级项 -->
    <div class="foldable-item">
      <div class="foldable-header" @click="toggleBookshelf">
        <span>书架</span>
        <span class="arrow" :class="{ open: isBookshelfOpen }">❯</span>
      </div>
      <!-- 折叠展开的子列表 -->
      <div v-show="isBookshelfOpen" class="foldable-body">
        <router-link
          v-for="shelf in customBookshelves"
          :key="shelf.id"
          :to="`/offline/bookshelf?id=${shelf.id}`"
          class="sub-nav-item"
        >
          <span class="shelf-name">{{ shelf.name }}</span>
          <span class="shelf-count">{{ shelf.count }}</span>
        </router-link>

        <!-- 新建书架按钮 -->
        <button class="add-shelf-btn" @click="createNewBookshelf">➕ 新建书架</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.foldable-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  color: #aaa;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.foldable-header:hover {
  background-color: #2a2a2a;
  color: #fff;
}

.arrow {
  font-size: 0.75rem;
  transition: transform 0.2s;
}
.arrow.open {
  transform: rotate(90deg);
}

.foldable-body {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  margin-top: 2px;
  gap: 2px;
}

.sub-nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem !important;
  color: #888 !important;
}

.shelf-count {
  font-size: 0.75rem;
  background-color: #262626;
  padding: 1px 6px;
  border-radius: 10px;
  color: #666;
}

.add-shelf-btn {
  background: transparent;
  border: 1px dashed #3a3a3a;
  color: #888;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: left;
  margin-top: 4px;
}
.add-shelf-btn:hover {
  border-color: #007acc;
  color: #007acc;
}
</style>
