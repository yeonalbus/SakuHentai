<script setup lang="ts">
import { computed } from 'vue'
import { viewMode as globalViewMode, type ViewMode } from '@/stores/viewMode'

const props = defineProps<{
  title?: string
  cover?: string
  size?: 'normal' | 'large' | 'top1'
  rank?: number
  mode?: ViewMode // 支持外部传参覆盖；若不传，则默认读取全局 viewMode
}>()

// 优先使用传入的 mode，否则使用全局状态
const currentMode = computed(() => props.mode || globalViewMode.value)
</script>

<template>
  <div class="item-card" :class="[currentMode, size || 'normal', { 'has-rank': rank }]">
    <!-- 名次角标 -->
    <div v-if="rank" class="rank-badge" :class="`rank-${rank}`">
      {{ rank }}
    </div>

    <!-- 1. 封面区域 -->
    <div class="cover-wrapper">
      <div class="placeholder-img">🖼️</div>
    </div>

    <!-- 2. 信息区域 -->
    <div class="card-info">
      <div class="card-title" :title="title">{{ title || '未命名资源名称' }}</div>

      <!-- 名片模式下可补充更多细节区域（如标签、更新时间等） -->
      <div v-if="currentMode === 'compact'" class="compact-meta">
        <span class="tag">标签 A</span>
        <span class="tag">2026-05-20</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 通用基础样式 ─── */
.item-card {
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-2px);
  border-color: #007acc;
}

/* ─── 1. 卡片模式 (card)：垂直竖排 ─── */
.item-card.card {
  display: flex;
  flex-direction: column;
}

.item-card.card .cover-wrapper {
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-card.card .card-info {
  padding: 10px;
}

.item-card.card .card-title {
  font-size: 0.85rem;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── 2. 名片模式 (compact)：横向扁平 ─── */
.item-card.compact {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 12px;
  height: 150px; /* 固定高度 */
}

.item-card.compact .cover-wrapper {
  width: 100px;
  height: 100%;
  flex-shrink: 0;
  background-color: #262626;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-card.compact .card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
}

.item-card.compact .card-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.compact-meta {
  display: flex;
  gap: 8px;
}

.compact-meta .tag {
  font-size: 0.75rem;
  color: #888;
  background-color: #262626;
  padding: 2px 6px;
  border-radius: 4px;
}

/* ─── 冠军 / 特殊尺寸保留 ─── */
.item-card.top1 {
  border-color: #ffd700;
}

.rank-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.75rem;
  z-index: 2;
}
.rank-badge.rank-1 {
  background: #ffd700;
  color: #000;
}
.rank-badge.rank-2 {
  background: #c0c0c0;
  color: #000;
}
.rank-badge.rank-3 {
  background: #b08d57;
  color: #000;
}
</style>
