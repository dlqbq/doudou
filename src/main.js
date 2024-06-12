import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPeer } from "@/services/PeerService";
import { router } from "@/routes/index";
import App from '@/App.vue'

createApp(App)
    .use(router)
    .use(createPinia())
    .use(createPeer())
    .mount('#app')
