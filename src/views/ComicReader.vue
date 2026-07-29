<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUI } from '@/composables/useUI'
import { getNextComicInQueue } from '@/stores/appStore'

const router = useRouter()
const route = useRoute()
const { toast, modal } = useUI()

// --------------------------------------------------
// 1. 基础参数与基础控制
// --------------------------------------------------
const comicId = computed(() => (route.query.id as string) || 'online-1')
const source = computed(() => (route.query.source as 'online' | 'offline') || 'online')

const currentPage = ref(1)
const totalPages = ref(32)
const isDoublePage = ref(false) // 单/双页
const isRTL = ref(true) // RTL 从右往左
const showControls = ref(true) // 悬浮控制条显隐
const isFullscreen = ref(false) // 全屏状态
const showSettings = ref(false) // 显示设置面板

// --------------------------------------------------
// 2. 截图新增高级偏好设置项（网页端适配）
// --------------------------------------------------
const pageFit = ref<'contain' | 'cover' | 'width'>('contain') // 页面缩放：匹配屏幕/覆盖/适应宽度
const autoTurnInterval = ref(0) // 自动翻页(秒)，0 为关闭
const keepScreenOn = ref(false) // 屏幕常亮
const showClock = ref(true) // 显示时钟
const showProgress = ref(true) // 显示进度
const showBattery = ref(true) // 显示电量
const showPageGap = ref(true) // 显示页面间隔
const customBrightness = ref(false) // 自定义屏幕亮度
const brightnessValue = ref(100) // 屏幕亮度 (20 - 100)

// 时钟与电量实时状态
const currentTime = ref('')
const batteryLevel = ref('100%')

// 模拟图源列表
const pages = computed(() =>
  Array.from(
    { length: totalPages.value },
    (_, i) =>
      `https://via.placeholder.com/800x1200/121214/ffffff?text=${source.value.toUpperCase()}+P.${i + 1}`,
  ),
)

// 监听路由参数变化：当自动切入下一本作品时，重置阅读器页码为第 1 页
watch(
  () => route.query.id,
  () => {
    currentPage.value = 1
    // 如果有真实的图源接口，在这里重新请求对应 comicId 的图片列表
  },
)

// --------------------------------------------------
// 📖 连贯读取队列调度核心
// --------------------------------------------------
// 📖 连贯读取队列调度核心 (确保脚本中只保留这一份定义)
const handleNextInQueue = async () => {
  // 查找队列里的下一作品
  const nextComic = getNextComicInQueue(comicId.value, source.value)

  if (nextComic) {
    const confirmed = await modal.confirm(
      `《${nextComic.title}》\n是否直接继续阅读清单中的下一本？`,
      '当前本子已全部读完 📖',
    )

    if (confirmed) {
      toast.success(`自动无缝切入：《${nextComic.title}》`)

      // 使用 replace 替换当前页面路由，实现优雅连贯切换
      router.replace({
        path: '/reader',
        query: {
          id: nextComic.id,
          source: nextComic.source,
        },
      })
    }
  } else {
    // 队列中已经没有更多本子了
    await modal.alert('清单中的所有本子都已经全部读完啦！🎉', '阅读完毕')
  }
}

// --------------------------------------------------
// 📖 计算双页模式渲染视图
// --------------------------------------------------
const visiblePageIndices = computed(() => {
  if (!isDoublePage.value) {
    return [currentPage.value - 1]
  }
  if (currentPage.value === 1) {
    return [0]
  }
  const secondPageIndex = currentPage.value
  if (secondPageIndex >= totalPages.value) {
    return [currentPage.value - 1]
  }
  const pageA = currentPage.value - 1
  const pageB = secondPageIndex
  return isRTL.value ? [pageB, pageA] : [pageA, pageB]
})

// --------------------------------------------------
// 🔄 翻页逻辑与清单调度
// --------------------------------------------------
const handlePrevPage = () => {
  const step = isDoublePage.value && currentPage.value > 1 ? 2 : 1
  if (currentPage.value - step >= 1) {
    currentPage.value -= step
  } else {
    toast.info('已经是第一页了')
  }
}

const handleNextPage = async () => {
  const step = isDoublePage.value && currentPage.value > 1 ? 2 : 1

  if (currentPage.value + step <= totalPages.value) {
    currentPage.value += step
  } else {
    // 读到最后一页再往后按，触发连贯调度
    await handleNextInQueue()
  }
}

// --------------------------------------------------
// ⚙️ Web API 功能实现（自动翻页/常亮/电量/时钟）
// --------------------------------------------------

// 1. 自动翻页定时器
let autoTurnTimer: unknown = null
watch([autoTurnInterval, currentPage], ([interval]) => {
  if (autoTurnTimer) clearInterval(autoTurnTimer)
  if (interval > 0) {
    autoTurnTimer = setInterval(() => {
      if (currentPage.value < totalPages.value) {
        handleNextPage()
      } else {
        clearInterval(autoTurnTimer)
      }
    }, interval * 1000)
  }
})

// 2. 屏幕常亮 Wake Lock API
let wakeLockSentinel: unknown = null
watch(keepScreenOn, async (val) => {
  if (val && 'wakeLock' in navigator) {
    try {
      wakeLockSentinel = await (navigator as unknown).wakeLock.request('screen')
      toast.success('已开启屏幕常亮')
    } catch {
      toast.info('当前浏览器不支持屏幕常亮锁')
    }
  } else if (wakeLockSentinel) {
    wakeLockSentinel.release()
    wakeLockSentinel = null
  }
})

// 3. 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// 4. 时钟与电量刷新
let clockTimer: unknown = null
const updateStatusInfo = async () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if ('getBattery' in navigator) {
    try {
      const b: unknown = await (navigator as unknown).getBattery()
      batteryLevel.value = `${Math.round(b.level * 100)}%`
    } catch {
      batteryLevel.value = '100%'
    }
  }
}

// 5. 键盘快捷键绑定
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    isRTL.value ? handleNextPage() : handlePrevPage()
  } else if (e.key === 'ArrowRight') {
    isRTL.value ? handlePrevPage() : handleNextPage()
  } else if (e.key === ' ') {
    handleNextPage()
  } else if (e.key.toLowerCase() === 'f') {
    toggleFullscreen()
  } else if (e.key === 'Escape') {
    showControls.value = !showControls.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  updateStatusInfo()
  clockTimer = setInterval(updateStatusInfo, 30000) // 30秒更新一次状态
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (autoTurnTimer) clearInterval(autoTurnTimer)
  if (clockTimer) clearInterval(clockTimer)
  if (wakeLockSentinel) wakeLockSentinel.release()
})
</script>

<template>
  <div class="reader-viewport" :class="{ 'rtl-mode': isRTL }">
    <div
      v-if="customBrightness"
      class="brightness-overlay"
      :style="{ opacity: (100 - brightnessValue) / 100 }"
    ></div>

    <Transition name="fade-top">
      <div v-if="showControls" class="floating-header">
        <button class="back-btn" @click="router.back()">‹ 退出阅读</button>

        <div class="header-info">
          <span class="comic-title">📖 作品ID: {{ comicId }}</span>
          <span class="source-tag">{{
            source === 'online' ? '🌐 在线流加载' : '📚 本地挂载'
          }}</span>
        </div>

        <div class="status-widgets">
          <span v-if="showClock" class="widget-item">🕒 {{ currentTime }}</span>
          <span v-if="showBattery" class="widget-item">🔋 {{ batteryLevel }}</span>
          <span v-if="showProgress" class="page-indicator"
            >{{ currentPage }} / {{ totalPages }}</span
          >
          <button class="settings-btn" @click.stop="showSettings = !showSettings" title="阅读设置">
            ⚙️
          </button>
        </div>
      </div>
    </Transition>

    <div class="canvas-stage" @click="showControls = !showControls">
      <div class="click-zone prev-zone" @click.stop="handlePrevPage" title="上一页"></div>
      <div class="click-zone next-zone" @click.stop="handleNextPage" title="下一页"></div>

      <div
        class="images-wrapper"
        :class="{
          'double-page': isDoublePage && currentPage > 1,
          'has-gap': showPageGap,
        }"
      >
        <img
          v-for="pageIdx in visiblePageIndices"
          :key="pageIdx"
          :src="pages[pageIdx]"
          class="manga-page-img"
          :class="`fit-${pageFit}`"
          alt="Manga Page"
        />
      </div>
    </div>

    <Transition name="fade-bottom">
      <div v-if="showControls" class="floating-footer">
        <div v-if="showProgress" class="slider-row">
          <button class="step-btn" @click="handlePrevPage">‹</button>
          <input
            v-model.number="currentPage"
            type="range"
            min="1"
            :max="totalPages"
            class="page-slider"
          />
          <button class="step-btn" @click="handleNextPage">›</button>
        </div>

        <div class="control-row">
          <button
            class="control-btn"
            :class="{ active: isDoublePage }"
            @click="isDoublePage = !isDoublePage"
          >
            {{ isDoublePage ? '📖 双页模式' : '📄 单页模式' }}
          </button>

          <button class="control-btn" :class="{ active: isRTL }" @click="isRTL = !isRTL">
            {{ isRTL ? '◀ 从右至左 (RTL)' : '从左至右 (LTR) ▶' }}
          </button>

          <button class="control-btn" @click="toggleFullscreen">
            {{ isFullscreen ? '📉 退出全屏' : '📺 全屏模式' }}
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="slide-left">
      <div v-if="showSettings" class="settings-drawer" @click.stop>
        <div class="drawer-header">
          <h3>⚙️ 阅读设置</h3>
          <button class="close-btn" @click="showSettings = false">✕</button>
        </div>

        <div class="drawer-body">
          <div class="setting-item">
            <label>页面缩放</label>
            <select v-model="pageFit" class="setting-select">
              <option value="contain">匹配屏幕</option>
              <option value="cover">覆盖屏幕</option>
              <option value="width">适应宽度</option>
            </select>
          </div>

          <div class="setting-item column">
            <div class="setting-label-row">
              <label>自动翻页(秒)</label>
              <span>{{ autoTurnInterval === 0 ? '关闭' : `${autoTurnInterval}秒` }}</span>
            </div>
            <input
              v-model.number="autoTurnInterval"
              type="range"
              min="0"
              max="20"
              step="1"
              class="setting-range"
            />
          </div>

          <hr class="divider" />

          <div class="setting-item switch-row">
            <label>屏幕常亮</label>
            <input v-model="keepScreenOn" type="checkbox" class="toggle-switch" />
          </div>

          <div class="setting-item switch-row">
            <label>显示时钟</label>
            <input v-model="showClock" type="checkbox" class="toggle-switch" />
          </div>

          <div class="setting-item switch-row">
            <label>显示进度</label>
            <input v-model="showProgress" type="checkbox" class="toggle-switch" />
          </div>

          <div class="setting-item switch-row">
            <label>显示电量</label>
            <input v-model="showBattery" type="checkbox" class="toggle-switch" />
          </div>

          <div class="setting-item switch-row">
            <label>显示页面间隔</label>
            <input v-model="showPageGap" type="checkbox" class="toggle-switch" />
          </div>

          <hr class="divider" />

          <div class="setting-item switch-row">
            <label>自定义屏幕亮度</label>
            <input v-model="customBrightness" type="checkbox" class="toggle-switch" />
          </div>

          <div v-if="customBrightness" class="setting-item column">
            <div class="setting-label-row">
              <label>屏幕亮度</label>
              <span>{{ brightnessValue }}%</span>
            </div>
            <input
              v-model.number="brightnessValue"
              type="range"
              min="20"
              max="100"
              class="setting-range"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.reader-viewport {
  position: fixed;
  inset: 0;
  background-color: #0d0d0f;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
}

/* 屏幕亮度黑级滤镜 overlay */
.brightness-overlay {
  position: absolute;
  inset: 0;
  background-color: #000;
  pointer-events: none;
  z-index: 3008;
}

/* 浮动顶栏/底栏 */
.floating-header,
.floating-footer {
  position: absolute;
  left: 0;
  right: 0;
  background: rgba(18, 18, 22, 0.92);
  backdrop-filter: blur(10px);
  z-index: 3010;
  padding: 12px 24px;
  display: flex;
  align-items: center;
}

.floating-header {
  top: 0;
  justify-content: space-between;
  border-bottom: 1px solid #2d2d32;
}

.floating-footer {
  bottom: 0;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #2d2d32;
}

.back-btn {
  background: #242428;
  border: 1px solid #3a3a3d;
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.status-widgets {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: #aaa;
}

.settings-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 2px 6px;
}

/* 主画布及图片缩放类 */
.canvas-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
}

.click-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 25%;
  z-index: 3005;
}
.prev-zone {
  left: 0;
}
.next-zone {
  right: 0;
}

.images-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: 100%;
  gap: 0;
}

.images-wrapper.has-gap {
  gap: 12px;
}

.manga-page-img {
  max-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.manga-page-img.fit-contain {
  object-fit: contain;
  max-width: 100%;
}

.manga-page-img.fit-cover {
  object-fit: cover;
  width: 100vw;
  height: 100vh;
}

.manga-page-img.fit-width {
  width: 100%;
  max-height: none;
}

.images-wrapper.double-page .manga-page-img {
  max-width: 50vw;
}

/* 侧滑设置抽屉样式 */
.settings-drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: #18181c;
  z-index: 3020;
  border-left: 1px solid #2d2d32;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5);
  color: #eee;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1.2rem;
  cursor: pointer;
}

.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.setting-item.column {
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

.setting-label-row {
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 0.85rem;
}

.setting-select {
  background: #242428;
  border: 1px solid #38383c;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}

.setting-range {
  accent-color: #007acc;
  cursor: pointer;
}

.toggle-switch {
  accent-color: #007acc;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.divider {
  border: none;
  border-top: 1px solid #2a2a2d;
  margin: 4px 0;
}

/* 动画效果 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.25s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 600px;
}

.page-slider {
  flex: 1;
  accent-color: #007acc;
}

.control-row {
  display: flex;
  gap: 12px;
}

.control-btn {
  background: #242428;
  border: 1px solid #38383c;
  color: #ccc;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.82rem;
  cursor: pointer;
}

.control-btn.active {
  background: #007acc;
  border-color: #007acc;
  color: #fff;
}
</style>
