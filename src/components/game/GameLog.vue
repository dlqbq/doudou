<template>
    <div class="battle-log-section">
        <div class="battle-log" ref="logEl">
            <div v-for="(entry, i) in entries" :key="i" class="log-entry" :class="entry.cls">{{ entry.text }}</div>
            <div v-if="entries.length === 0" class="log-empty">等待战斗开始...</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({ entries: { type: Array, required: true } })
const logEl = ref(null)

function scrollLog() {
    nextTick(() => { if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight })
}

watch(() => props.entries.length, scrollLog)
</script>

<style scoped>
.battle-log-section {
    background: var(--surface-light);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
}

.battle-log {
    padding: 0.5rem;
    max-height: 80px;
    overflow-y: auto;
    font-size: 0.7rem;
    line-height: 1.5;
}

.battle-log::-webkit-scrollbar {
    width: 3px;
}

.battle-log::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.25);
    border-radius: 2px;
}

.log-entry {
    padding: 0.1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    animation: logIn 0.3s ease;
}

.log-empty {
    color: var(--text-muted);
    text-align: center;
    padding: 0.5rem;
}

@keyframes logIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.log-entry.damage {
    color: #f87171;
}

.log-entry.heal {
    color: #34d399;
}

.log-entry.miss {
    color: #fbbf24;
}

.log-entry.system {
    color: #94a3b8;
    font-style: italic;
}
</style>