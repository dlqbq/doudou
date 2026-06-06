<template>
    <div class="audio-controls">
        <button class="audio-btn" @click="toggleBgm" :title="isBgmMuted ? '开启背景音乐' : '关闭背景音乐'">
            {{ isBgmMuted ? '🔇' : '🎵' }}
        </button>
        <button class="audio-btn" @click="toggleSfx" :title="isSfxMuted ? '开启音效' : '关闭音效'">
            {{ isSfxMuted ? '🔇' : '🔊' }}
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { audioService } from '../../services/audioService'

const isBgmMuted = ref(false)
const isSfxMuted = ref(false)

onMounted(() => {
    // 初始化时默认不静音
    audioService.init()
    audioService.isBgmMuted = false
    audioService.isSfxMuted = false
    isBgmMuted.value = false
    isSfxMuted.value = false
})

function toggleBgm() {
    isBgmMuted.value = audioService.toggleBgm()
}

function toggleSfx() {
    isSfxMuted.value = audioService.toggleSfx()
}
</script>

<style scoped>
.audio-controls {
    position: fixed;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 0.5rem;
    z-index: 1000;
}

.audio-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.audio-btn:hover {
    border-color: var(--primary);
    background: rgba(0, 0, 0, 0.7);
}

.audio-btn:active {
    transform: scale(0.9);
}

@media (max-width: 380px) {
    .audio-btn {
        width: 32px;
        height: 32px;
        font-size: 0.85rem;
    }
}
</style>