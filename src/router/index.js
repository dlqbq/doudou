import { createRouter, createWebHashHistory } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const routes = [
    {
        path: '/',
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

// 路由守卫
router.beforeEach((to, from) => {
    const store = useGameStore()
    if (to.path !== '/' && !store.username) {
        return '/'
    }
    return true
})

export default router