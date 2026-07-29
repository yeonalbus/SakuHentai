<script setup lang="ts">
import { ref } from 'vue'

// 模拟排查出的重复/多版本数据组
const duplicateGroups = ref([
  {
    id: 'dup-1',
    reason: '完全重复 (100% Hash 匹配)',
    itemA: { title: '作品A_扫图版.zip', size: '120MB', date: '2026-01-10' },
    itemB: { title: '作品A_副本.zip', size: '120MB', date: '2026-03-12' },
  },
  {
    id: 'dup-2',
    reason: '更高画质 / 增补新版本',
    itemA: { title: '作品B_[单行本_1080P].epub', size: '250MB', date: '2025-11-20' },
    itemB: { title: '作品B_[单行本_4K无修正].epub', size: '580MB', date: '2026-05-01' },
  },
])

const handleResolve = (groupId: string, action: string) => {
  // 修改前: alert(`处理组 ${groupId}: ${action}`)
  window.alert(`处理组 ${groupId}: ${action}`)
}
</script>

<template>
  <div class="maintenance-page">
    <h2 class="page-title">🛠️ 本地书库维护与查重</h2>

    <div class="group-list">
      <div v-for="group in duplicateGroups" :key="group.id" class="dup-card">
        <div class="dup-header">
          <span class="dup-reason">⚠️ {{ group.reason }}</span>
        </div>

        <div class="comparison-box">
          <!-- A 版本 -->
          <div class="file-item">
            <span class="file-name">{{ group.itemA.title }}</span>
            <span class="file-meta">{{ group.itemA.size }} | {{ group.itemA.date }}</span>
            <button class="action-btn" @click="handleResolve(group.id, 'keepA')">仅保留此项</button>
          </div>

          <div class="vs-divider">VS</div>

          <!-- B 版本 -->
          <div class="file-item">
            <span class="file-name">{{ group.itemB.title }}</span>
            <span class="file-meta">{{ group.itemB.size }} | {{ group.itemB.date }}</span>
            <button class="action-btn" @click="handleResolve(group.id, 'keepB')">仅保留此项</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title {
  font-size: 1.3rem;
  color: #fff;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dup-card {
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
}

.dup-reason {
  color: #e6a23c;
  font-size: 0.85rem;
  font-weight: bold;
}

.comparison-box {
  display: flex;
  align-items: center;
  margin-top: 12px;
  gap: 16px;
}

.file-item {
  flex: 1;
  background-color: #222;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-name {
  font-size: 0.85rem;
  color: #eee;
}
.file-meta {
  font-size: 0.75rem;
  color: #777;
}

.vs-divider {
  color: #555;
  font-weight: bold;
  font-size: 0.9rem;
}

.action-btn {
  background-color: #2a2a2a;
  color: #007acc;
  border: 1px solid #3a3a3a;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  align-self: flex-start;
  margin-top: 4px;
}
.action-btn:hover {
  background-color: #007acc;
  color: #fff;
}
</style>
