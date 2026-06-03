<template>
    <div class="form-group">
        <label>🔗 输入房间ID</label>
        <div class="join-row">
            <input class="input-field" v-model="joinId" placeholder="粘贴Peer ID..." @keyup.enter="handleJoin" />
            <button class="btn btn-secondary" @click="handleJoin" :disabled="!joinId.trim()">
                加入
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['join'])
const joinId = ref('')

const handleJoin = () => {
    const id = joinId.value.trim()
    if (!id) return
    emit('join', id)
}
</script>

<style scoped>
.join-row {
    display: flex;
    gap: 0.5rem;
}

.join-row .input-field {
    flex: 1;
}
</style>