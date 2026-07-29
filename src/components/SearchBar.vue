<template>
  <div class="search-box">
    <span class="search-icon">🔍</span>
    <!-- input 本身保留，但通过 CSS 把背景和边框全部去掉了 -->
    <input type="text" placeholder="同时搜索在线与离线资源..." />
  </div>
</template>

<style scoped>
/* 伪装外壳：把背景改成暗色，加上圆角 */
.search-box {
  display: flex;
  align-items: center;
  background-color: #2a2a2a; /* 和你的主色调融为一体的暗灰色 */
  border: 1px solid #3a3a3a;
  border-radius: 8px; /* 现代风圆角 */
  padding: 6px 12px;
  width: 100%;
  transition: all 0.2s ease;
}

/* 鼠标点进去（Focus）时的效果：边框微微发亮 */
.search-box:focus-within {
  border-color: #007acc; /* 变成和你 Logo 一致的主题蓝 */
  background-color: #333;
}

.search-icon {
  font-size: 0.9rem;
  margin-right: 8px;
  opacity: 0.6;
}

/* 剥离原生 input 的丑陋样式 */
.search-box input {
  background: transparent; /* 背景透明，透出外层的暗色 */
  border: none; /* 抹掉原生黑框 */
  outline: none; /* 抹掉原生的蓝/黑聚焦外发光 */
  color: #e0e0e0; /* 输入文字变白色 */
  font-size: 0.9rem;
  width: 100%;
}

/* 占位符提示词（placeholder）的颜色 */
.search-box input::placeholder {
  color: #777;
}
</style>
