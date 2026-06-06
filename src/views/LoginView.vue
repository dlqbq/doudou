<template>
    <div class="card">
        <div class="card-header">
            <h1>⚔️ 豆豆斗斗</h1>
            <p class="subtitle">P2P实时联机 · 支持手机&电脑</p>
        </div>
        <div class="form-group">
            <label>👤 你的昵称</label>
            <input class="input-field" v-model="nameInput" placeholder="输入昵称..." maxlength="12" @keyup.enter="login" />
        </div>
        <button class="btn btn-primary btn-block" @click="login" :disabled="!nameInput.trim()">
            🚀 进入大厅
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { audioService } from '../services/audioService'

const router = useRouter()
const store = useGameStore()
const nameInput = ref('')

const login = () => {
    audioService.playBgm();
    const name = nameInput.value.trim()
    if (!name) return
    store.username = name
    router.push('/lobby')
}

onMounted(() => {
    if (store.username) {
        router.push('/lobby')
    }
})
</script>