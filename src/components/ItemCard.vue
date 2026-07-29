<script setup lang="ts">
import { computed } from 'vue'
import { viewMode } from '@/stores/viewMode'
import { useRouter } from 'vue-router'
import type { ComicItem, OnlineComic } from '@/types/comic'

interface RankedComicItem extends ComicItem {
  rank?: number
}

const props = defineProps<{
  comic: RankedComicItem
  mode?: 'card' | 'compact'
  size?: 'large' | 'normal' | 'small'
}>()

const router = useRouter()

const currentMode = computed(() => props.mode || viewMode.value)

// --------------------------------------------------
// 卡片点击跳转函数
// --------------------------------------------------
const handleCardClick = () => {
  if (!props.comic || !props.comic.id) return

  // 根据 source 自动区分跳转至在线还是离线详情页，并携带 id 参数
  if (props.comic.source === 'online') {
    router.push(`/online/detail?id=${props.comic.id}`)
  } else {
    router.push(`/offline/detail?id=${props.comic.id}`)
  }
}

// --------------------------------------------------
// 1. E-Hentai 经典 Fav 0 ~ Fav 9 10 色调色盘
// --------------------------------------------------
const favColors: Record<number, string> = {
  0: '#7f7f7f', // Fav 0: 灰色/深灰 (深色模式下用 7f7f7f)
  1: '#f00000', // Fav 1: 红色
  2: '#ff7800', // Fav 2: 橙色
  3: '#f0d000', // Fav 3: 黄色
  4: '#00a000', // Fav 4: 绿色
  5: '#98e020', // Fav 5: 浅绿
  6: '#00a0a0', // Fav 6: 青色
  7: '#0000f0', // Fav 7: 蓝色
  8: '#a000a0', // Fav 8: 紫色
  9: '#f000a0', // Fav 9: 粉色
}

// 计算当前画框颜色（只有 isFavorite 为 true 且有 favIndex 时触发）
const favoriteBorderColor = computed(() => {
  const onlineComic = props.comic as OnlineComic
  if (onlineComic.isFavorite && onlineComic.favIndex !== undefined) {
    return favColors[onlineComic.favIndex] || '#007acc'
  }
  return null
})

// 显示标签截断
const displayTags = computed(() => props.comic.tags?.slice(0, 4) || [])
</script>

<template>
  <div
    v-if="comic"
    class="item-card"
    :class="[
      currentMode,
      size || 'normal',
      { 'has-rank': comic.rank, 'is-fav': favoriteBorderColor },
    ]"
    :style="
      favoriteBorderColor
        ? { borderColor: favoriteBorderColor, boxShadow: `0 0 8px ${favoriteBorderColor}40` }
        : {}
    "
    @click="handleCardClick"
  >
    <div v-if="comic.rank" class="rank-badge" :class="`rank-${comic.rank}`">
      {{ comic.rank }}
    </div>

    <template v-if="currentMode === 'compact'">
      <div class="compact-cover">
        <img :src="comic.coverUrl" :alt="comic.title" class="cover-img" />
      </div>

      <div class="compact-info">
        <h4 class="info-title" :title="comic.title">
          {{ comic.title || '未命名作品' }}
        </h4>

        <div class="info-meta-line">
          <span v-if="comic.rating" class="rating">⭐ {{ comic.rating }}</span>
          <span v-if="comic.source === 'online'" class="uploader">{{
            (comic as OnlineComic).uploader || '匿名'
          }}</span>
          <span v-if="comic.pageCount" class="pages">{{ comic.pageCount }}P</span>
        </div>

        <div class="info-tags-area">
          <span v-for="tag in displayTags" :key="tag" class="tag-pill">{{ tag }}</span>
          <span v-if="comic.tags && comic.tags.length > 4" class="tag-more">...</span>

          <span v-if="comic.isDownloaded" class="downloaded-badge compact-dl"> ✓ 已下载 </span>
        </div>
      </div>

      <div class="compact-side-meta">
        <span class="side-date">{{ comic.updatedAt || '--' }}</span>
        <span
          v-if="comic.source === 'online' && (comic as OnlineComic).category"
          class="side-category"
        >
          {{ (comic as OnlineComic).category }}
        </span>
      </div>
    </template>

    <template v-if="currentMode === 'card'">
      <div class="card-cover-wrapper">
        <img :src="comic.coverUrl" :alt="comic.title" class="cover-img" />

        <span v-if="comic.isDownloaded" class="downloaded-badge card-dl"> ✓ 已下载 </span>

        <span v-if="comic.pageCount" class="floating-pages">{{ comic.pageCount }}P</span>
      </div>

      <div class="card-info-footer">
        <h4 class="info-title" :title="comic.title">
          {{ comic.title || '未命名作品' }}
        </h4>

        <div class="info-meta-line">
          <span v-if="comic.rating" class="rating">⭐ {{ comic.rating }}</span>
          <span
            v-if="comic.source === 'online' && (comic as OnlineComic).category"
            class="category-text"
          >
            {{ (comic as OnlineComic).category }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ─── 基础卡片 ─── */
.item-card {
  position: relative;
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ─── 绿色「已下载」标签 ─── */
.downloaded-badge {
  background-color: #10b981; /* 经典 Emerald 绿 */
  color: #ffffff;
  font-weight: bold;
  border-radius: 4px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

/* 卡片右上角浮标 */
.downloaded-badge.card-dl {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 0.7rem;
  padding: 3px 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  z-index: 2;
}

/* 名片标签末端标 */
.downloaded-badge.compact-dl {
  font-size: 0.68rem;
  padding: 2px 6px;
  margin-left: 4px;
}

/* ─── 1. 名片布局 (compact) ─── */
.item-card.compact {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 12px;
  height: 105px; /* 👈 调大高度 */
}

.compact-cover {
  width: 70px;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #222;
}

.compact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
}

.compact-info .info-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-meta-line {
  display: flex;
  gap: 10px;
  font-size: 0.75rem;
  color: #888;
}

.rating {
  color: #ffc107;
}

.info-tags-area {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  max-height: 26px;
  overflow: hidden;
}

.tag-pill {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 12px;
  background-color: rgba(0, 122, 204, 0.12);
  color: #007acc;
  border: 1px solid rgba(0, 122, 204, 0.25);
  white-space: nowrap;
}

.compact-side-meta {
  width: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  font-size: 0.75rem;
  color: #666;
  flex-shrink: 0;
  border-left: 1px solid #2a2a2a;
  padding-left: 10px;
}

.side-category {
  padding: 1px 6px;
  border-radius: 4px;
  background-color: #2a2a2d;
  color: #aaa;
}

/* ─── 2. 卡片布局 (card) ─── */
.item-card.card {
  display: flex;
  flex-direction: column;
}

.card-cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: #222;
  border-bottom: 1px solid #2a2a2a;
}

.floating-pages {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 4px;
}

.card-info-footer {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-info-footer .info-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.category-text {
  color: #888;
}

/* ─── 排行角标 ─── */
.rank-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 22px;
  height: 22px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 4px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 3;
  border: 1px solid #444;
}

.rank-badge.rank-1 {
  background-color: #ffd700;
  color: #000;
  border-color: #ffd700;
}
.rank-badge.rank-2 {
  background-color: #c0c0c0;
  color: #000;
  border-color: #c0c0c0;
}
.rank-badge.rank-3 {
  background-color: #b08d57;
  color: #000;
  border-color: #b08d57;
}
</style>
