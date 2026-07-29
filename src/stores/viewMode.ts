import { ref } from 'vue'

export type ViewMode = 'card' | 'compact'

// 全局响应式状态：默认 'card'（卡片），支持切换为 'compact'（名片）
export const viewMode = ref<ViewMode>('card')

// 切换函数
export const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'card' ? 'compact' : 'card'
}
