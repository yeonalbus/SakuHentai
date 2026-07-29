import type { OnlineComic, OfflineComic } from '@/types/comic'

// 丰富真实 Tag 库 (E 站经典 Tag 风格)
const mockTags = [
  'female:big breasts',
  'female:sole female',
  'female:nun',
  'female:glasses',
  'male:sole male',
  'male:shotacon',
  'language:chinese',
  'language:translated',
  'artist:hiten',
  'artist:tsukino',
  'group:circle_a',
  'parody:original',
  'character:reimu',
  'full color',
  'uncensored',
]

const categories = ['Doujinshi', 'Manga', 'Artist CG', 'Game CG', 'Non-H']

/**
 * 随机生成在线漫画数据
 * @param count 生成条数
 */
export function generateOnlineComics(count = 50): OnlineComic[] {
  return Array.from({ length: count }, (_, i) => {
    const idNum = i + 1
    // 随机挑 2-5 个标签
    const shuffledTags = [...mockTags].sort(() => 0.5 - Math.random())
    const tags = shuffledTags.slice(0, Math.floor(Math.random() * 4) + 2)

    // 使用简单的 SVG 占位图，带随机颜色背景，防止网络加载失败
    const bgColors = ['2a2a2a', '1e293b', '311b92', '1b5e20', '4a148c', '3e2723']
    const color = bgColors[i % bgColors.length]
    const coverUrl = `https://via.placeholder.com/300x400/${color}/ffffff?text=Comic+${idNum}`

    return {
      id: `online-${i + 1}`,
      title: `[Hanazono] [汉化] 极品本子作品名称 #${i + 1}`,
      coverUrl: `https://via.placeholder.com/300x400/2a2a2a/ffffff?text=Comic+${i + 1}`,
      source: 'online',
      tags: ['female:nun', 'language:chinese', 'full color'],
      rating: 4.7,
      pageCount: 32,
      updatedAt: '2026-07-29',
      category: 'Doujinshi',
      uploader: 'E_User',
      // 👇 测试收藏色框 (前 10 条模拟 Favorite 0 ~ 9)
      isFavorite: i < 10,
      favIndex: i < 10 ? i : undefined,
      // 👇 测试已下载绿标 (偶数条显示已下载)
      isDownloaded: i % 2 === 0,
    }
  })
}

/**
 * 随机生成离线漫画数据
 * @param count 生成条数
 */
export function generateOfflineComics(count = 50): OfflineComic[] {
  return Array.from({ length: count }, (_, i) => {
    const idNum = i + 1
    const shuffledTags = [...mockTags].sort(() => 0.5 - Math.random())
    const tags = shuffledTags.slice(0, Math.floor(Math.random() * 3) + 2)

    return {
      id: `offline-${idNum}`,
      title: `📖 [本地扫描] 深度学习资料包作品 #${idNum}`,
      coverUrl: `https://via.placeholder.com/300x400/262626/cccccc?text=Offline+${idNum}`,
      source: 'offline',
      tags,
      rating: Number((3.0 + Math.random() * 2.0).toFixed(1)),
      pageCount: Math.floor(Math.random() * 150) + 20,
      updatedAt: `2026-06-${String(Math.max(1, 28 - i)).padStart(2, '0')}`,
      localPath: `D:/Comics/Collection_2026/comic_${idNum}.zip`,
      fileSize: Math.floor(Math.random() * 300 + 50) * 1024 * 1024, // Bytes
      readCount: Math.floor(Math.random() * 80),
      needsUpdate: i % 7 === 0,
    }
  })
}
