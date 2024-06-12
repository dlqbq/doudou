<script setup>
import { ref, getCurrentInstance, computed } from 'vue'
import { useDoudouStore } from "@/stores/DoudouStore";

const app = getCurrentInstance()
const page = ref('prepare')
const doudouStore = useDoudouStore()
const { send } = app.proxy.$peer

const ready = () => {
    doudouStore.status = 10
    send({ status: 10 })
}

const quite = () => {
    doudouStore.status = 0
}

const isReady = computed(() => doudouStore.status === 10)
</script>

<template>
    <h1>{{ page }}</h1>
    <p>
        <button @click="ready" :disabled="isReady">准备</button>
    </p>
    <p>
        <button @click="quite">退出</button>
    </p>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
