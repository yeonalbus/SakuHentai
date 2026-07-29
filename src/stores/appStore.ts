import { ref, watch } from 'vue'
import type { Bookshelf, ComicItem, CardViewMode, OnlineComic, OfflineComic } from '@/types/comic'

// 辅助函数：从 localStorage 安全读取 JSON 数据
function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch (e) {
    console.error(`读取 LocalStorage [${key}] 失败`, e)
    return defaultValue
  }
}

// --------------------------------------------------
// 1. 全局视图模式 (Card / Compact)
// --------------------------------------------------
export const viewMode = ref<CardViewMode>(loadStorage('app_view_mode', 'card'))

watch(viewMode, (newVal) => {
  localStorage.setItem('app_view_mode', JSON.stringify(newVal))
})

export const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'card' ? 'compact' : 'card'
}

// --------------------------------------------------
// 2. 自定义书架列表 (Bookshelves)
// --------------------------------------------------
const defaultBookshelves: Bookshelf[] = [
  { id: 'shelf-1', name: '热血必看', count: 12, comicIds: [] },
  { id: 'shelf-2', name: '纯爱战神', count: 5, comicIds: [] },
  { id: 'shelf-3', name: '待分类本地本', count: 28, comicIds: [] },
]

export const bookshelves = ref<Bookshelf[]>(loadStorage('app_bookshelves', defaultBookshelves))

watch(
  bookshelves,
  (newVal) => {
    localStorage.setItem('app_bookshelves', JSON.stringify(newVal))
  },
  { deep: true },
)

/** 新建书架 */
export const addBookshelf = (name: string) => {
  if (!name.trim()) return
  const newShelf: Bookshelf = {
    id: `shelf-${Date.now()}`,
    name: name.trim(),
    count: 0,
    comicIds: [],
  }
  bookshelves.value.push(newShelf)
}

/** 删除书架 */
export const removeBookshelf = (id: string) => {
  bookshelves.value = bookshelves.value.filter((b) => b.id !== id)
}

// --------------------------------------------------
// 3. 悬浮阅读清单 (Reading List Queue) - 统一状态
// --------------------------------------------------

// 统一在线与离线清单状态持久化
export const onlineReadingList = ref<ComicItem[]>(loadStorage('app_online_reading_list', []))
export const offlineReadingList = ref<ComicItem[]>(loadStorage('app_offline_reading_list', []))

watch(
  onlineReadingList,
  (val) => {
    localStorage.setItem('app_online_reading_list', JSON.stringify(val))
  },
  { deep: true },
)

watch(
  offlineReadingList,
  (val) => {
    localStorage.setItem('app_offline_reading_list', JSON.stringify(val))
  },
  { deep: true },
)

/** 🎯 统一的添加/移除阅读清单函数 */
export const toggleReadingList = (comic: ComicItem) => {
  const targetList = comic.source === 'online' ? onlineReadingList : offlineReadingList
  const index = targetList.value.findIndex((item) => item.id === comic.id)

  if (index >= 0) {
    targetList.value.splice(index, 1)
  } else {
    targetList.value.push(comic)
  }
}

/** 清空指定来源的阅读清单 */
export const clearReadingList = (source: 'online' | 'offline') => {
  if (source === 'online') onlineReadingList.value = []
  else offlineReadingList.value = []
}

/** 🎯 核心调度函数：获取队列中的下一个作品 */
export const getNextComicInQueue = (
  currentId: string,
  source: 'online' | 'offline',
): ComicItem | null => {
  const list = source === 'online' ? onlineReadingList.value : offlineReadingList.value

  // 1. 如果当前清单为空，直接返回 null
  if (!list || list.length === 0) return null

  // 2. 查找当前作品在队列中的位置
  const currentIndex = list.findIndex((item) => item.id === currentId)

  // 3. 关键容错：如果当前玩的本子还没加入清单（或者处于测试直接进来的状态）
  //    默认将清单中的第一本作为“下一本”
  if (currentIndex === -1) {
    return list[0]
  }

  // 4. 如果已经是清单里的最后一本，返回 null
  if (currentIndex >= list.length - 1) {
    return null
  }

  // 5. 顺畅返回清单里的下一本
  return list[currentIndex + 1]
}
