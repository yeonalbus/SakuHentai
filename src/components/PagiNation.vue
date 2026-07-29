<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage?: number
    totalPages?: number
  }>(),
  {
    currentPage: 1,
    totalPages: 1,
  },
)

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

// 输入框绑定的跳转页码
const inputPage = ref('')

// 安全触发切页（防止超出范围）
const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('change', page)
}

// 点击“跳页”按钮或回车
const handleInputJump = () => {
  const target = parseInt(inputPage.value, 10)
  if (!isNaN(target) && target >= 1 && target <= props.totalPages) {
    goToPage(target)
    inputPage.value = ''
  }
}

// 动态计算连续展示的前 5 个页码（比如当前是 1，显示 1,2,3,4,5）
const continuousPages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, Math.min(props.currentPage, props.totalPages - 4))
  const end = Math.min(props.totalPages, start + 4)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 动态计算 +10、+20 偏移页码
const plus10Page = computed(() => props.currentPage + 10)
const plus20Page = computed(() => props.currentPage + 20)
</script>

<template>
  <div class="custom-pagination">
    <!-- 1. 当前页 status -->
    <div class="pill-btn status">{{ currentPage }} of {{ totalPages }}</div>

    <!-- 2. 连续页码按钮 -->
    <button
      v-for="p in continuousPages"
      :key="p"
      class="pill-btn page-num"
      :class="{ active: p === currentPage }"
      @click="goToPage(p)"
    >
      {{ p }}
    </button>

    <!-- 3. +10 跨度跳页（只有当目标页小于总页数时才显示） -->
    <template v-if="plus10Page < totalPages">
      <span class="symbol">»</span>
      <button class="pill-btn offset" @click="goToPage(plus10Page)">
        {{ plus10Page }}
      </button>
    </template>

    <!-- 4. +20 跨度跳页 -->
    <button v-if="plus20Page < totalPages" class="pill-btn offset" @click="goToPage(plus20Page)">
      {{ plus20Page }}
    </button>

    <!-- 5. 省略号与尾页 -->
    <template v-if="currentPage < totalPages - 5">
      <span class="symbol">...</span>
      <button class="pill-btn tail" @click="goToPage(totalPages)">尾页 »</button>
    </template>

    <!-- 6. 输入框手动跳页 -->
    <div class="jump-box">
      <input v-model="inputPage" type="text" class="jump-input" @keyup.enter="handleInputJump" />
      <button class="pill-btn jump-btn" @click="handleInputJump">跳页</button>
    </div>
  </div>
</template>

<style scoped>
.custom-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 0;
}

/* 椭圆型统一按钮基类 */
.pill-btn {
  background-color: transparent;
  color: #aaa;
  border: 1px solid #3a3a3a;
  border-radius: 20px; /* 椭圆胶囊造型 */
  padding: 4px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pill-btn:hover {
  border-color: #00a896;
  color: #fff;
}

/* 激活状态（青蓝色高亮） */
.pill-btn.active {
  background-color: #00a896;
  border-color: #00a896;
  color: #fff;
  font-weight: bold;
}

.pill-btn.status {
  cursor: default;
  color: #888;
  border-color: #2a2a2a;
}

.symbol {
  color: #555;
  font-size: 0.9rem;
  padding: 0 2px;
}

/* 跳转输入框样式 */
.jump-box {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
}

.jump-input {
  width: 50px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #555;
  color: #fff;
  text-align: center;
  font-size: 0.85rem;
  padding: 2px 0;
  outline: none;
}

.jump-input:focus {
  border-bottom-color: #00a896;
}
</style>
