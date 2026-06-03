<template>
    <div class="status-bar">
        <div class="energy-display">能量: <span class="energy-value">{{ energy }}</span></div>
        <div class="timeout-info">
            <span class="timeout-label">超时:</span>
            <span class="timeout-count" :class="{ 'warning': timeoutCount >= 2 }">{{ timeoutCount }}/3</span>
        </div>
        <div class="status-info">{{ statusText }}</div>
        <div class="turn-timer" v-if="showTimer" :class="{ 'warning': turnTimer <= 5 }">⏱️ {{ timerDisplay }}</div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    energy: { type: Number, default: 0 },
    timeoutCount: { type: Number, default: 0 },
    locked: { type: Boolean, default: false },
    gameOver: { type: Boolean, default: false },
    statusText: { type: String, default: '' }
})

const emit = defineEmits(['timeout'])

const TURN_TIME = 30
const turnTimer = ref(TURN_TIME)
const showTimer = ref(false)
let timerInterval = null

const timerDisplay = computed(() => {
    const mins = Math.floor(turnTimer.value / 60)
    const secs = turnTimer.value % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
})

function startTurnTimer() {
    stopTurnTimer()
    if (props.gameOver || props.locked) return
    turnTimer.value = TURN_TIME
    showTimer.value = true
    timerInterval = setInterval(() => {
        turnTimer.value--
        if (turnTimer.value <= 0) {
            stopTurnTimer()
            emit('timeout')
        }
    }, 1000)
}

function stopTurnTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
    showTimer.value = false
}

watch(() => props.locked, (val) => {
    if (val) stopTurnTimer()
    else if (!val && !props.gameOver) setTimeout(startTurnTimer, 200)
})

watch(() => props.gameOver, (val) => {
    if (val) stopTurnTimer()
    else if (!val && !props.locked) setTimeout(startTurnTimer, 200)
})

onMounted(() => { if (!props.locked && !props.gameOver) startTurnTimer() })
onUnmounted(() => stopTurnTimer())
</script>

<style scoped>
.status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--surface-light);
    border-radius: var(--radius);
    flex-wrap: wrap;
    gap: 0.5rem;
}

.energy-display {
    font-size: 1.1rem;
    font-weight: 700;
}

.energy-value {
    color: var(--gold);
    font-size: 1.3rem;
}

.status-info {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.turn-timer {
    font-size: 1rem;
    font-weight: 700;
    background: var(--surface);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-family: monospace;
}

.turn-timer.warning {
    color: var(--danger);
    animation: pulse 0.5s infinite;
}

.timeout-info {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.timeout-label {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.timeout-count {
    font-size: 0.9rem;
    font-weight: 700;
    background: var(--surface);
    padding: 0.15rem 0.5rem;
    border-radius: 0.75rem;
}

.timeout-count.warning {
    color: var(--danger);
    animation: pulse 0.5s infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>