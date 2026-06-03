<template>
    <div class="action-row">
        <button class="btn btn-primary" @click="$emit('action', 'attack')">
            ⚔️ 攻击<small>15-25</small>
        </button>
        <button class="btn btn-secondary" @click="$emit('action', 'heavy')">
            💢 重击<small>25-40</small>
        </button>
        <button class="btn btn-success" @click="$emit('action', 'heal')">
            💚 治疗<small>10-20</small>
        </button>
    </div>
</template>

<script setup>
defineEmits(['action'])
</script>