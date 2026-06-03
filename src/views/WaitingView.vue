<template>
    <div class="card">
        <div class="card-header">
            <h1>⏳ 等待中</h1>
            <p class="subtitle">{{ store.isHost ? '分享ID给好友' : '已连接到房间' }}</p>
        </div>

        <div class="waiting-content">
            <StatusIndicator :status="store.status" />

            <p class="id-label">
                {{ store.isHost ? '你的房间ID（点击复制）' : '房间ID' }}
            </p>
            <div class="peer-id-box" @click="copyId">
                {{ store.peerId || '生成中...' }}
            </div>
            <p v-if="copyMsg" class="copy-msg">{{ copyMsg }}</p>
        </div>

        <div class="ready-badges">
            <span class="ready-badge" :class="{ 'is-ready': store.isReady }">
                🟢 我: {{ store.isReady ? '已准备' : '未准备' }}
            </span>
            <span class="ready-badge" :class="{ 'is-ready': store.rivalReady }">
                {{ store.rivalReady ? '🟢' : '🔴' }} 对手: {{ store.rivalReady ? '已准备' : '未准备' }}
            </span>
        </div>

        <button class="btn btn-success btn-block" @click="toggleReady" :disabled="store.status !== 6">
            {{ store.isReady ? '取消准备' : '✅ 准备' }}
        </button>

        <p v-if="store.isReady && store.rivalReady" class="ready-hint">
            🎯 双方已准备，即将开始...
        </p>

        <button class="btn btn-outline btn-block back-btn" @click="leave">
            ↩️ 返回大厅
        </button>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { roomStorage } from '../services/roomStorage'
import StatusIndicator from '../components/common/StatusIndicator.vue'

const router = useRouter()
const store = useGameStore()
const copyMsg = ref('')
let heartbeat = null
let hasNavigated = false  // 🔑 防止重复跳转

const copyId = () => {
    if (store.peerId && navigator.clipboard) {
        navigator.clipboard.writeText(store.peerId).then(() => {
            copyMsg.value = '✅ 已复制！分享给好友'
            setTimeout(() => copyMsg.value = '', 2000)
        }).catch(() => {
            copyMsg.value = '复制失败，请手动复制'
            setTimeout(() => copyMsg.value = '', 2000)
        })
    }
}

const toggleReady = () => {
    if (store.status !== 6) return
    store.isReady = !store.isReady
    store.sendData({ type: store.isReady ? 'ready' : 'cancel-ready' })
    store.checkBothReady()
}

const leave = () => {
    store.disconnect()
    router.push('/lobby')
}

// 🔑 监听 gameStarted 变化
watch(() => store.gameStarted, (val) => {
    if (val && !hasNavigated) {
        hasNavigated = true
        console.log('👀 检测到游戏开始，准备跳转到游戏页面')
        // 使用 nextTick 确保状态同步
        setTimeout(() => {
            router.replace('/game')
        }, 100)
    }
}, { immediate: true })

onMounted(() => {
    hasNavigated = false
    console.log('⏳ 等待页面挂载')

    if (!store.username || !store.peerId) {
        router.push('/')
        return
    }

    // 🔑 如果游戏已经开始，直接跳转
    if (store.gameStarted) {
        console.log('🎮 游戏已经开始，直接跳转')
        hasNavigated = true
        router.replace('/game')
        return
    }

    if (store.isHost) {
        heartbeat = setInterval(() => {
            roomStorage.updateHeartbeat(store.peerId)
        }, 8000)
    }
})

onUnmounted(() => {
    if (heartbeat) clearInterval(heartbeat)
    console.log('👋 等待页面卸载')
})
</script>

<style scoped>
.waiting-content {
    text-align: center;
}

.id-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
}

.copy-msg {
    font-size: 0.75rem;
    color: var(--success);
    margin-top: 0.25rem;
}

.ready-hint {
    text-align: center;
    margin-top: 0.5rem;
    color: var(--gold);
    font-weight: 600;
    animation: pulse 1.5s infinite;
}

.back-btn {
    margin-top: 0.75rem;
}
</style>