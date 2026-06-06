import { createRouter, createWebHashHistory } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const routes = [
    {
        path: '/',
        name: 'Preload',
        component: () => import('../views/PreloadView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/lobby',
        name: 'Lobby',
        component: () => import('../views/LobbyView.vue')
    },
    {
        path: '/waiting',
        name: 'Waiting',
        component: () => import('../views/WaitingView.vue')
    },
    {
        path: '/game',
        name: 'Game',
        component: () => import('../views/GameView.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {
    const store = useGameStore()
    // 预加载和登录页不需要登录
    if (to.path === '/' || to.path === '/login') return true
    if (!store.username) return '/login'
    return true
})

export default router