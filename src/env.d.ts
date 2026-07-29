/// <reference types="vite/client" />

// 告诉 TypeScript：任何以 .vue 结尾的文件都是一个 Vue 组件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 不传 generic 参数，直接使用默认定义
  const component: DefineComponent
  export default component
}
