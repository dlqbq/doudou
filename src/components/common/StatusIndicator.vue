<template>
    <div class="status-indicator">
        <span class="status-dot" :class="statusClass"></span>
        <span class="status-text">{{ statusText }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: { type: Number, required: true }
})

const statusClass = computed(() => {
    if ([6, 8].includes(props.status)) return 'online'
    if ([1, 2, 3].includes(props.status)) return 'connecting'
    return 'offline'
})

const statusText = computed(() => {
    const map = {
        0: '初始化中...',
        1: '等待对手连接...',
        2: '正在连接...',
        3: '重连中...',
        4: '错误',
        5: '已关闭',
        6: '已连接',
        7: '连接错误',
        8: '游戏中...',
        9: '连接断开',
    }
    return map[props.status] || '未知状态'
})
</script>

<style scoped>
.status-text {
    font-size: 0.85rem;
}
</style>