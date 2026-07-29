import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 告诉 Vite：代码里的 @ 符号指向项目的 src 目录
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
