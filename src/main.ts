import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)

//入口文件挂载插件
app.use(createPinia())
app.use(router)
app.mount('#app')
