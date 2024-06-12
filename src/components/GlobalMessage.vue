<template>
    <div class="global-message" v-if="doudouStore.showMessage">
        <div class="bg-cover"></div>
        <div class="message-box">
            <div class="title"></div>
            <div class="message">{{ doudouStore.message }}</div>
            <div class="actions" v-if="doudouStore.showActions">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useDoudouStore } from '@/stores/DoudouStore'
const doudouStore = useDoudouStore()

</script>

<style scoped>
.global-message {
    position: absolute;
    z-index: 9997;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.bg-cover {
    position: absolute;
    z-index: 9998;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.message-box {
    z-index: 9999;
    text-align: center;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(0, 0, 0, .5);
    font-size: 2em;
    padding: 1em;
    border-radius: 1em;
    color: white;
}
</style>