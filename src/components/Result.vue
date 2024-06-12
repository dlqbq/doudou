<script setup>
import { ref, getCurrentInstance, computed } from 'vue'
import { useDoudouStore } from "@/stores/DoudouStore";

const app = getCurrentInstance()
const doudouStore = useDoudouStore()
const { send } = app.proxy.$peer

const resultMessage = computed(() => doudouStore.status === 12 ? 'win' : 'lose')

const tryAgain = () => {
    send({ status: 6 })
    doudouStore.status = 6
    doudouStore.initBattle()
}
const backLobby = () => {
    doudouStore.status = 0
}
</script>

<template>
    <h1 v-if="doudouStore.currentSkill && doudouStore.rivalSkill">
        {{ doudouStore.currentSkill.name }} VS {{ doudouStore.rivalSkill.name }}</h1>
    <p>{{ resultMessage }}</p>
    <button @click="tryAgain" v-if="doudouStore.status !== 9">再来一局</button>
    <button @click="backLobby">返回大厅</button>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
