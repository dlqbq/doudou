<template>
    <div class="game-over-panel">
        <template v-if="result === 'opponent-left'">
            <h2 class="text-disconnect">👋 对手已离开</h2>
            <p class="desc">{{ rivalName }} 已断开连接</p>
            <button class="btn btn-primary btn-block mt-3" @click="$emit('back')">↩️ 返回大厅</button>
        </template>
        <template v-else-if="result === 'timeout-both-lose'">
            <h2 class="text-timeout">⏰ 双方超时</h2>
            <p class="desc">双方各超时3次，判定平局</p>
            <div class="actions">
                <button class="btn btn-primary" :disabled="rematchRequested" @click="$emit('rematch')">{{
                    rematchRequested ? '⏳ 等待对手...' : '🔄 再来一局' }}</button>
                <button class="btn btn-outline" @click="$emit('back')">↩️ 返回大厅</button>
            </div>
            <p v-if="rematchStatusText" class="rematch-status">{{ rematchStatusText }}</p>
        </template>
        <template v-else>
            <h2 :class="result === 'win' ? 'text-win' : 'text-lose'">{{ result === 'win' ? '🏆 胜利！' : '💀 失败' }}</h2>
            <div class="result-skills" v-if="selfSkill && rivalSkill">
                <p>{{ selfSkill.name }} VS {{ rivalSkill.name }}</p>
            </div>
            <div class="actions">
                <button class="btn btn-primary" :disabled="rematchRequested" @click="$emit('rematch')">{{
                    rematchRequested ? '⏳ 等待对手...' : '🔄 再来一局' }}</button>
                <button class="btn btn-outline" @click="$emit('back')">↩️ 返回大厅</button>
            </div>
            <p v-if="rematchStatusText" class="rematch-status">{{ rematchStatusText }}</p>
        </template>
    </div>
</template>

<script setup>
defineProps({
    result: { type: String, required: true },
    rivalName: { type: String, default: '对手' },
    selfSkill: { type: Object, default: null },
    rivalSkill: { type: Object, default: null },
    rematchStatusText: { type: String, default: '' },
    rematchRequested: { type: Boolean, default: false }
})
defineEmits(['rematch', 'back'])
</script>

<style scoped>
.game-over-panel {
    text-align: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.6);
    border-radius: var(--radius);
    backdrop-filter: blur(4px);
}

.text-win {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--gold);
}

.text-lose {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--danger);
}

.text-disconnect {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-muted);
}

.text-timeout {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--warning);
}

.desc {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
}

.result-skills {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: var(--text);
}

.actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.actions .btn {
    flex: 1;
}

.rematch-status {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-muted);
}

.mt-3 {
    margin-top: 0.75rem;
}
</style>