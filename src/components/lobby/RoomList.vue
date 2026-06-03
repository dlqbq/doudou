<template>
    <div class="room-section">
        <label class="room-label">📋 本地房间列表</label>
        <div class="room-list">
            <div v-for="room in rooms" :key="room.peerId" class="room-item" @click="$emit('join-room', room)">
                <div class="room-info">
                    <div class="room-name">{{ room.creatorName }} 的房间</div>
                    <div class="room-id">{{ room.peerId }}</div>
                </div>
                <span class="join-badge">加入</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    rooms: { type: Array, required: true }
})
defineEmits(['join-room'])
</script>

<style scoped>
.room-label {
    font-size: 0.8rem;
    color: var(--text-muted);
}
</style>