<script setup lang="ts">
import { ref, reactive } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'apply', filters: typeof filterState): void
}>()

// 1. E 站 10 大分类及其经典代表色
interface CategoryConfig {
  key: string
  label: string
  color: string
}

const categories: CategoryConfig[] = [
  { key: 'doujinshi', label: 'Doujinshi', color: '#e53935' }, // 红色
  { key: 'manga', label: 'Manga', color: '#f57c00' }, // 橙色
  { key: 'imageSet', label: 'Image Set', color: '#3949ab' }, // 蓝色
  { key: 'gameCg', label: 'Game CG', color: '#2e7d32' }, // 绿色
  { key: 'artistCg', label: 'Artist CG', color: '#cddc39' }, // 黄绿
  { key: 'cosplay', label: 'Cosplay', color: '#8e24aa' }, // 紫色
  { key: 'nonH', label: 'Non-H', color: '#424242' }, // 深灰
  { key: 'asianPorn', label: 'Asian Porn', color: '#d81b60' }, // 粉红
  { key: 'western', label: 'Western', color: '#00e676' }, // 亮绿
  { key: 'misc', label: 'Misc', color: '#757575' }, // 灰色
]

// 2. 响应式筛选状态表单（与 EhViewer 参数一一对应）
const filterState = reactive({
  // 选中的分类 (默认全选，或部分选中)
  activeCategories: new Set<string>([
    'doujinshi',
    'manga',
    'imageSet',
    'gameCg',
    'artistCg',
    'cosplay',
    'asianPorn',
    'western',
    'misc',
  ]),
  keyword: '',
  language: 'Chinese',
  onlyRemoved: false,
  onlyTorrents: false,
  minPages: null as number | null,
  maxPages: null as number | null,
  minRating: 1,
  disableLangFilter: false,
  disableUploaderFilter: false,
  disableTagFilter: false,
})

// 切换分类勾选
const toggleCategory = (key: string) => {
  if (filterState.activeCategories.has(key)) {
    filterState.activeCategories.delete(key)
  } else {
    filterState.activeCategories.add(key)
  }
}

// 重置所有筛选参数
const handleReset = () => {
  filterState.activeCategories = new Set(categories.map((c) => c.key))
  filterState.keyword = ''
  filterState.language = 'Chinese'
  filterState.onlyRemoved = false
  filterState.onlyTorrents = false
  filterState.minPages = null
  filterState.maxPages = null
  filterState.minRating = 1
  filterState.disableLangFilter = false
  filterState.disableUploaderFilter = false
  filterState.disableTagFilter = false
}

// 确认应用筛选
const handleApply = () => {
  emit('apply', { ...filterState })
  emit('update:visible', false)
}

// 关闭抽屉
const handleClose = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Teleport to="body">
    <!-- 1. 暗色遮罩背景 -->
    <Transition name="fade">
      <div v-if="visible" class="filter-backdrop" @click="handleClose"></div>
    </Transition>

    <!-- 2. 筛选抽屉面板 -->
    <Transition name="slide">
      <div v-if="visible" class="filter-drawer">
        <!-- 顶栏：重置、标题与确认 -->
        <div class="drawer-header">
          <button class="icon-btn" title="重置筛选" @click="handleReset">🔄</button>
          <h2 class="drawer-title">筛选</h2>
          <button class="icon-btn apply-btn" title="完成" @click="handleApply">✓</button>
        </div>

        <!-- 滚动主内容区 -->
        <div class="drawer-body">
          <!-- A. E 站 10 色分类 2 行 5 列网格切块 -->
          <div class="category-grid">
            <button
              v-for="cat in categories"
              :key="cat.key"
              class="cat-chip"
              :class="{ disabled: !filterState.activeCategories.has(cat.key) }"
              :style="{
                backgroundColor: filterState.activeCategories.has(cat.key) ? cat.color : '#26262a',
                color: filterState.activeCategories.has(cat.key) ? '#ffffff' : '#666666',
              }"
              @click="toggleCategory(cat.key)"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- B. 关键词输入框 -->
          <div class="form-group">
            <label class="input-label">关键词</label>
            <input
              v-model="filterState.keyword"
              type="text"
              class="dark-input"
              placeholder="输入追加筛选关键词..."
            />
          </div>

          <!-- C. 语言下拉选择器 -->
          <div class="form-row">
            <span class="row-label">语言</span>
            <select v-model="filterState.language" class="dark-select">
              <option value="All">All (全部)</option>
              <option value="Chinese">Chinese (中文)</option>
              <option value="Japanese">Japanese (日文)</option>
              <option value="English">English (英文)</option>
            </select>
          </div>

          <!-- D. 仅搜索移除了的画廊 (开关) -->
          <div class="form-row">
            <span class="row-label">仅搜索移除了的画廊</span>
            <label class="toggle-switch">
              <input v-model="filterState.onlyRemoved" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- E. 只显示有种子的画廊 (开关) -->
          <div class="form-row">
            <span class="row-label">只显示有种子的画廊</span>
            <label class="toggle-switch">
              <input v-model="filterState.onlyTorrents" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- F. 页数范围范围框 -->
          <div class="form-row">
            <span class="row-label">页数范围 ❓</span>
            <div class="page-range-box">
              <input
                v-model.number="filterState.minPages"
                type="number"
                class="number-input"
                placeholder="Min"
              />
              <span class="range-text">到</span>
              <input
                v-model.number="filterState.maxPages"
                type="number"
                class="number-input"
                placeholder="Max"
              />
            </div>
          </div>

          <!-- G. 最低评分下拉框 -->
          <div class="form-row">
            <span class="row-label">最低评分</span>
            <select v-model="filterState.minRating" class="dark-select mini">
              <option :value="1">1 ⭐</option>
              <option :value="2">2 ⭐</option>
              <option :value="3">3 ⭐</option>
              <option :value="4">4 ⭐</option>
              <option :value="5">5 ⭐</option>
            </select>
          </div>

          <!-- H. 过滤器开关三连 -->
          <div class="form-row">
            <span class="row-label">禁用语言过滤</span>
            <label class="toggle-switch">
              <input v-model="filterState.disableLangFilter" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="form-row">
            <span class="row-label">禁用上传者过滤</span>
            <label class="toggle-switch">
              <input v-model="filterState.disableUploaderFilter" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="form-row">
            <span class="row-label">禁用标签过滤</span>
            <label class="toggle-switch">
              <input v-model="filterState.disableTagFilter" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩背景 */
.filter-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1999;
  backdrop-filter: blur(2px);
}

/* 抽屉主容器 */
.filter-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background-color: #141416;
  border-left: 1px solid #2a2a2d;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);
  color: #e0e0e0;
}

/* 顶栏 Header */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #242427;
}

.drawer-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #aaa;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
}

.icon-btn:hover {
  color: #fff;
  transform: scale(1.1);
}
.apply-btn {
  font-weight: bold;
  color: #10b981;
}

/* 滚动区 */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 10 色分类网格 (2 列等宽) */
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.cat-chip {
  padding: 10px 0;
  border-radius: 6px;
  border: none;
  font-size: 0.88rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.cat-chip.disabled {
  text-decoration: line-through;
  opacity: 0.5;
}

/* 表单与输入框 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.85rem;
  color: #888;
}

.dark-input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #444;
  color: #fff;
  padding: 6px 0;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.dark-input:focus {
  border-bottom-color: #007acc;
}

/* 行打布与下拉框 */
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #ddd;
}

.dark-select {
  background-color: #242428;
  color: #fff;
  border: 1px solid #3a3a3d;
  padding: 6px 12px;
  border-radius: 6px;
  outline: none;
  font-size: 0.85rem;
}

.dark-select.mini {
  width: 80px;
}

/* 页数范围输入 */
.page-range-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.number-input {
  width: 54px;
  height: 32px;
  background-color: #000;
  border: 1px solid #333;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  font-size: 0.85rem;
  outline: none;
}

.range-text {
  font-size: 0.8rem;
  color: #888;
}

/* 开关 Toggle Switch 样式 (经典紫色风格) */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #333;
  border-radius: 24px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: #888;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: rgba(124, 77, 255, 0.3);
}
input:checked + .slider:before {
  transform: translateX(20px);
  background-color: #7c4dff; /* 经典 EhViewer 紫色活开关 */
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
