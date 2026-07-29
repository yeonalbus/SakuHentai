<script setup lang="ts">
/*
Vue 3 最推荐的语法糖（Composition API）。
它让我们定义的所有变量和函数自动暴露给下面的 <template> 使用，不需要再写繁琐的 export default { components: ... } 了。
*/

// 1. 引入 Vue 的响应式 API 和路由 API
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 2. 定义响应式状态：isOnline（默认在线模式）
/*
定义一个响应式变量。普通 JS 变量修改后界面不会动，
而用 ref() 包裹的值改变时，Vue 会自动去更新 UI。
[注意点：]
在 <script> 中读写 ref 变量必须加 .value（如 isOnline.value = ...）；
但在 <template> 模板里，Vue 会自动解包，直接写 isOnline 即可。
*/
const isOnline = ref(true)

// 3. 定义点击切换模式的逻辑函数
const toggleMode = () => {
  // 在 script 中修改 ref 变量的值，必须加 .value
  isOnline.value = !isOnline.value

  // 切换模式的同时，自动跳转到对应的首页
  if (isOnline.value) {
    //router.push 是 Vue Router 提供的一个方法，意思是“用代码控制页面进行跳转”
    router.push('/online/home')
  } else {
    router.push('/offline/home')
  }
}
</script>

<template>
  <!-- @click 绑定点击事件，:title 动态绑定鼠标悬浮提示 -->
  <!--@ 是 v-on: 的简写，代表绑定 DOM 事件。这里相当于原生 JS 的 addEventListener('click', toggleMode)-->
  <!-- `:title=` 冒号 : 是 v-bind: 的简写，表示属性值是一个 JS 表达式（支持写三元运算符 a ? b : c），而不是死的固定字符串。-->
  <button
    type="button"
    class="mode-toggle-btn"
    :title="isOnline ? '当前在线模式，点击切换为离线' : '当前离线模式，点击切换为在线'"
    @click="toggleMode"
  >
    <!-- {{ }} 三元表达式：根据 isOnline 的值动态渲染图标和文字 -->
    <span class="icon">{{ isOnline ? '☀️' : '🌙' }}</span>
    <span class="label">{{ isOnline ? '在线' : '离线' }}</span>
  </button>
</template>

<style scoped>
/*
scoped 确保 CSS 样式只作用于当前组件，不会污染外部
<style scoped>:加上 scoped 后，Vue 会自动为组件里的元素生成独一无二的随机属性标号，确保这里的 .mode-toggle-btn 样式绝对不会影响到其他页面的按钮
*/
.mode-toggle-btn {
  background-color: #242424;
  border: 1px solid #3a3a3a;
  color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  user-select: none;
}

.mode-toggle-btn:hover {
  background-color: #323232;
  border-color: #007acc;
}

.icon {
  font-size: 0.9rem;
}

.label {
  font-size: 0.75rem;
  color: #aaa;
}
</style>
