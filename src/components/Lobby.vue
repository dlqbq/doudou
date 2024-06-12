<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useDoudouStore } from "@/stores/DoudouStore";

defineProps({
    msg: String,
})
const app = getCurrentInstance()
const hostId = ref('')
const skill = ref(0)
const isShowHostInput = ref(false)
const doudouStore = useDoudouStore()
const { create, connect } = app.proxy.$peer

const createBattle = () => {
    doudouStore.showMessage = true
    create()
}
const joinBattle = () => {
    doudouStore.showMessage = true
    connect(hostId.value)
}

const showHostInput = () => {
    hostId.value = ''
    isShowHostInput.value = true
}
const cancelJoin = () => {
    isShowHostInput.value = false
}
</script>

<template>
    <div class="lobby-layout">
        <div class="greeting-message">欢迎 {{ doudouStore.name }}</div>
        <div class="action-layout">
            <button class="btn create-battle-btn" @click="createBattle">创建对战</button>
            <div class="player-image"></div>
            <button class="btn show-input-btn" @click="showHostInput">加入对战</button>
        </div>
        <div class="input-host-id" v-if="isShowHostInput">
            <div class="input-host-id-box">
                <input name="hostId" v-model="hostId" class="host-id-input" placeholder="请输入主机ID" />
                <div class="action-layout">
                    <button class="btn join-battle-btn" @click="joinBattle">加入</button>
                    <button class="btn cancel-btn" @click="cancelJoin">取消</button>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.greeting-message {
    padding: 1em;
    font-size: 2em;
    font-weight: 800;
}

.lobby-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.action-layout {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-evenly;
    width: 100%;
    padding-bottom: 2em;
}

.player-image {
    height: 14em;
    width: 12em;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-image: url('../assets/images/wukong_stand.gif');
}

.input-host-id {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.input-host-id-box {
    margin: auto;
    background-color: #FFFFFF;
    padding: 1em;
    border-radius: 1em;
}

.host-id-input {
    margin: auto;
    border: 1px solid darksalmon;
    padding: 0.5em;
    margin-bottom: 0.5em;
    width: 16em;
}
</style>
