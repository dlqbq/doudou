<template>
    <div class="game-over-panel">
        <h2 v-if="result === 'win'" class="win-text">🏆 胜利！</h2>
        <h2 v-else class="lose-text">💀 失败</h2>
        <button class="btn btn-primary btn-block" @click="$emit('back')">
            ↩️ 返回大厅
        </button>
    </div>
</template>

<script setup>
defineProps({
    result: { type: String, required: true }
})
defineEmits(['back'])
</script>