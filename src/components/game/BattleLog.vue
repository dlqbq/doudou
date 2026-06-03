<!-- src/components/game/BattleLog.vue -->
<template>
    <div class="battle-log" ref="logContainer">
        <div v-for="(entry, i) in entries" :key="i" class="log-entry" :class="entry.cls">
            {{ entry.text }}
        </div>
        <div v-if="entries.length === 0" class="empty-log">
            等待战斗开始...
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
    entries: { type: Array, required: true }
})

const logContainer = ref(null)

const scrollToBottom = () => {
    nextTick(() => {
        if (logContainer.value) {
            logContainer.value.scrollTop = logContainer.value.scrollHeight
        }
    })
}

watch(() => props.entries?.length, scrollToBottom, { immediate: true })
</script>