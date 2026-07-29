<script setup lang="ts">
import { computed } from 'vue'
import ItemCard from '@/components/ItemCard.vue'

// 模拟官方 TOP 25 数据
const allItems = Array.from({ length: 24 }, (_, i) => ({
  id: `online-rank-${i + 1}`,
  title: `🌐 官方全站热度榜单条目 #${i + 1}`,
  score: 99999 - i * 1200,
  rank: i + 1,
}))

const topThree = computed(() => allItems.slice(0, 3))
const restItems = computed(() => allItems.slice(3, 25))
</script>

<template>
  <div class="leaderboard-page">
    <h2 class="page-title">🏆 官方全站热度榜 (TOP 25)</h2>

    <!-- 前 3 名领奖台 -->
    <div class="podium-section">
      <div v-if="topThree[1]" class="podium-item rank-2-wrapper">
        <div class="podium-crown">🥈 NO.2</div>
        <ItemCard :title="topThree[1].title" :rank="2" size="large" mode="card" />
        <div class="rank-score">{{ topThree[1].score }} 热度</div>
      </div>

      <div v-if="topThree[0]" class="podium-item rank-1-wrapper">
        <div class="podium-crown gold">👑 NO.1 CHAMPION</div>
        <ItemCard :title="topThree[0].title" :rank="1" size="top1" mode="card" />
        <div class="rank-score gold-text">{{ topThree[0].score }} 热度</div>
      </div>

      <div v-if="topThree[2]" class="podium-item rank-3-wrapper">
        <div class="podium-crown">🥉 NO.3</div>
        <ItemCard :title="topThree[2].title" :rank="3" size="large" mode="card" />
        <div class="rank-score">{{ topThree[2].score }} 热度</div>
      </div>
    </div>

    <!-- 第 4 - 25 名列表 -->
    <div class="rest-section">
      <h3 class="section-subtitle">第 4 - 25 名</h3>
      <div class="card-grid">
        <div v-for="item in restItems" :key="item.id" class="grid-item-wrapper">
          <ItemCard :title="item.title" :rank="item.rank" mode="card" />
          <div class="sub-score">{{ item.score }} 热度</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 30px;
}
.page-title {
  font-size: 1.3rem;
  color: #fff;
}
.podium-section {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #2a2a2a;
}
.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 170px;
}
.rank-1-wrapper {
  width: 210px;
  transform: translateY(-10px);
}
.podium-crown {
  font-size: 0.85rem;
  font-weight: bold;
  color: #aaa;
  margin-bottom: 8px;
}
.podium-crown.gold {
  color: #ffd700;
  font-size: 1rem;
}
.rank-score {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #888;
}
.gold-text {
  color: #ffd700;
  font-weight: bold;
}
.section-subtitle {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 12px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.sub-score {
  font-size: 0.75rem;
  color: #666;
  text-align: right;
  margin-top: 4px;
}
</style>
