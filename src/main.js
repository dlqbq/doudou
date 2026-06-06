import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { RESOURCE_BASE_URL } from './config'
import './assets/styles/main.css'

const app = createApp(App)

// 注入到全局
app.provide('resourceBaseUrl', RESOURCE_BASE_URL)
app.config.globalProperties.$resourceBaseUrl = RESOURCE_BASE_URL

app.use(createPinia())
app.use(router)
app.mount('#app')