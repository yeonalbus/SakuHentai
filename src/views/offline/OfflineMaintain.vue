<script setup lang="ts">
import { ref } from 'vue'
import { useUI } from '@/composables/useUI'

const { modal, toast } = useUI()

interface DuplicateGroup {
  id: string
  reason: string
  itemA: { title: string; size: string; date: string; path: string }
  itemB: { title: string; size: string; date: string; path: string }
}

// 模拟排查出的本地重复/多版本文件组
const duplicateGroups = ref<DuplicateGroup[]>([
  {
    id: 'dup-1',
    reason: '完全重复 (100% Hash 匹配)',
    itemA: {
      title: '作品A_扫图版.zip',
      size: '120MB',
      date: '2026-01-10',
      path: 'D:/Comics/A_scan.zip',
    },
    itemB: {
      title: '作品A_副本.zip',
      size: '120MB',
      date: '2026-03-12',
      path: 'D:/Comics/A_copy.zip',
    },
  },
  {
    id: 'dup-2',
    reason: '更高画质 / 增补新版本',
    itemA: {
      title: '作品B_[单行本_1080P].epub',
      size: '250MB',
      date: '2025-11-20',
      path: 'D:/Comics/B_1080.epub',
    },
    itemB: {
      title: '作品B_[单行本_4K无修正].epub',
      size: '580MB',
      date: '2026-05-01',
      path: 'D:/Comics/B_4K.epub',
    },
  },
])

// 解决重复文件：仅保留其中一项，删除另一项
const handleResolve = async (groupId: string, keepOption: 'A' | 'B') => {
  const group = duplicateGroups.value.find((g) => g.id === groupId)
  if (!group) return

  const kept = keepOption === 'A' ? group.itemA : group.itemB
  const removed = keepOption === 'A' ? group.itemB : group.itemA

  const confirmed = await modal.confirm(
    `确定保留「${kept.title}」并彻底删除副本「${removed.title}」吗？`,
    '处理重复文件',
  )

  if (confirmed) {
    // 从列表中移除已处理的这组重复项
    duplicateGroups.value = duplicateGroups.value.filter((g) => g.id !== groupId)
    toast.success(`清理成功，仅保留了：${kept.title}`)
  }
}

// 扫描更新状态
const isScanning = ref(false)
const handleStartScan = () => {
  isScanning.value = true
  toast.info('正在扫描本地磁盘画库...')
  setTimeout(() => {
    isScanning.value = false
    toast.success('扫描完成！未发现新增冲突项')
  }, 1500)
}
</script>

<template>
  <div class="maintenance-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">🛠️ 本地书库维护与查重</h2>
        <p class="subtitle">自动扫描硬盘中 Hash 冲突、多版本或文件损坏的离线本子</p>
      </div>

      <button class="scan-btn" :disabled="isScanning" @click="handleStartScan">
        {{ isScanning ? '扫描中...' : '🔍 重新全盘扫描' }}
      </button>
    </div>

    <div v-if="duplicateGroups.length === 0" class="empty-box">
      <span class="icon">🎉</span>
      <p>恭喜！本地画库极其干净，暂无重复或异常文件。</p>
    </div>

    <div v-else class="group-list">
      <div v-for="group in duplicateGroups" :key="group.id" class="dup-card">
        <div class="dup-header">
          <span class="dup-reason">⚠️ {{ group.reason }}</span>
          <span class="dup-id">Group #{{ group.id }}</span>
        </div>

        <div class="comparison-box">
          <div class="file-item">
            <div class="file-info">
              <span class="file-name">{{ group.itemA.title }}</span>
              <span class="file-meta">{{ group.itemA.size }} | {{ group.itemA.date }}</span>
              <span class="file-path">{{ group.itemA.path }}</span>
            </div>
            <button class="action-btn" @click="handleResolve(group.id, 'A')">仅保留此项</button>
          </div>

          <div class="vs-divider">VS</div>

          <div class="file-item">
            <div class="file-info">
              <span class="file-name">{{ group.itemB.title }}</span>
              <span class="file-meta">{{ group.itemB.size }} | {{ group.itemB.date }}</span>
              <span class="file-path">{{ group.itemB.path }}</span>
            </div>
            <button class="action-btn" @click="handleResolve(group.id, 'B')">仅保留此项</button>
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
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a2a2a;
}

.page-title {
  font-size: 1.3rem;
  color: #fff;
  margin: 0;
}

.subtitle {
  font-size: 0.85rem;
  color: #888;
  margin: 4px 0 0 0;
}

.scan-btn {
  background: #007acc;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.88rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.scan-btn:hover {
  opacity: 0.85;
}
.scan-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #888;
}

.empty-box .icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dup-card {
  background-color: #1a1a1d;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  padding: 16px;
}

.dup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dup-reason {
  color: #f59e0b;
  font-size: 0.88rem;
  font-weight: bold;
}

.dup-id {
  font-size: 0.75rem;
  color: #666;
  font-family: monospace;
}

.comparison-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-item {
  flex: 1;
  background-color: #242428;
  padding: 14px;
  border-radius: 6px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
}

.file-meta {
  font-size: 0.78rem;
  color: #888;
}

.file-path {
  font-size: 0.72rem;
  color: #007acc;
  font-family: monospace;
  word-break: break-all;
}

.vs-divider {
  font-weight: bold;
  color: #555;
  font-size: 0.85rem;
}

.action-btn {
  background-color: #2a2a2e;
  border: 1px solid #444;
  color: #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #007acc;
  border-color: #007acc;
  color: #fff;
}
</style>
