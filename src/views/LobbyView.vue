<template>
    <div class="card">
        <div class="card-header">
            <h1>🎮 游戏大厅</h1>
            <p class="subtitle">欢迎，{{ store.username }}</p>
        </div>

        <button class="btn btn-primary btn-block" @click="handleCreateGame">
            ✨ 创建游戏
        </button>

        <div class="divider-text">或加入已有房间</div>

        <JoinForm @join="handleJoinById" />

        <RoomList v-if="rooms.length > 0" :rooms="rooms" @join-room="handleJoinRoom" />
        <div v-else class="room-empty">
            📭 暂无房间<br><small>创建游戏后会出现在这里</small>
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { roomStorage } from '../services/roomStorage'
import JoinForm from '../components/lobby/JoinForm.vue'
import RoomList from '../components/lobby/RoomList.vue'
import { audioService } from '../services/audioService'

const router = useRouter()
const store = useGameStore()
const rooms = ref([])
const errorMsg = ref('')

let refreshTimer = null
let checkTimer = null
let heartbeat = null
let timeoutTimer = null

const refreshRooms = () => {
    rooms.value = roomStorage.getRooms()
}

const clearMyTimers = () => {
    if (checkTimer) {
        clearInterval(checkTimer)
        checkTimer = null
    }
    if (timeoutTimer) {
        clearTimeout(timeoutTimer)
        timeoutTimer = null
    }
    if (heartbeat) {
        clearInterval(heartbeat)
        heartbeat = null
    }
}

const handleCreateGame = () => {
    errorMsg.value = ''
    clearMyTimers()
    store.resetGame()
    store.createGame()

    // 轮询检查 peerId
    checkTimer = setInterval(() => {
        if (store.peerId) {
            clearMyTimers()
            roomStorage.addRoom(store.peerId, store.username)
            heartbeat = setInterval(() => {
                roomStorage.addRoom(store.peerId, store.username)
            }, 10000)
            router.push('/waiting')
        }
        if (store.status === 4) {
            clearMyTimers()
            errorMsg.value = '创建失败，请重试'
            store.disconnect()
        }
    }, 200)

    // 🔑 30秒超时（延长到30秒）
    timeoutTimer = setTimeout(() => {
        if (!store.peerId) {
            clearMyTimers()
            errorMsg.value = '创建超时（30秒），请检查网络'
            store.disconnect()
        }
    }, 30000)
}

const handleJoinById = (id) => {
    errorMsg.value = ''
    clearMyTimers()
    store.resetGame()
    store.joinGame(id)

    checkTimer = setInterval(() => {
        if (store.status === 6) {
            clearMyTimers()
            store.sendData({ type: 'intro', name: store.username })
            router.push('/waiting')
        }
        if (store.status === 4 || store.status === 7) {
            clearMyTimers()
            errorMsg.value = '连接失败，请检查房间ID'
            store.disconnect()
        }
    }, 200)

    // 🔑 30秒超时
    timeoutTimer = setTimeout(() => {
        if (store.status !== 6) {
            clearMyTimers()
            errorMsg.value = '连接超时（30秒），请检查房间ID'
            store.disconnect()
        }
    }, 30000)
}

const handleJoinRoom = (room) => {
    handleJoinById(room.peerId)
}

onMounted(() => {
    if (!store.username) {
        router.push('/login')
        return
    }
    refreshRooms()
    refreshTimer = setInterval(refreshRooms, 3000)
    window.addEventListener('storage', refreshRooms)
})

onUnmounted(() => {
    // 🔑 组件卸载时只清理界面定时器，不调用 disconnect
    clearInterval(refreshTimer)
    clearMyTimers()
    window.removeEventListener('storage', refreshRooms)
    console.log('👋 大厅页面卸载，定时器已清理（不调用 disconnect）')
})
</script>

<style scoped>
.error-msg {
    color: var(--danger);
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.85rem;
}
</style>