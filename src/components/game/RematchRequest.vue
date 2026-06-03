<template>
    <div class="rematch-request">
        <p class="rematch-text">🔄 {{ rivalName }} 请求再来一局！</p>
        <div class="rematch-actions">
            <button class="btn btn-primary" @click="$emit('accept')">✅ 同意</button>
            <button class="btn btn-danger" @click="$emit('decline')">❌ 拒绝</button>
        </div>
    </div>
</template>

<script setup>
defineProps({ rivalName: { type: String, required: true } })
defineEmits(['accept', 'decline'])
</script>

<style scoped>
.rematch-request {
    text-align: center;
    padding: 1rem;
    background: rgba(251, 191, 36, 0.1);
    border-radius: var(--radius);
    border: 2px solid var(--gold);
}

.rematch-text {
    font-size: 1rem;
    font-weight: 700;
    color: var(--gold);
    margin-bottom: 0.75rem;
}

.rematch-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
}

.rematch-actions .btn {
    min-width: 100px;
}

.btn-danger {
    background: var(--danger);
    color: #fff;
}
</style>