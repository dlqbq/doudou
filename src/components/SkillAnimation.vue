<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    debug: false,
    role: {
        type: String,
        require: true
    },
    skill: {
        type: Number,
        required: true
    }
})

const play = ref(false)
const baseUrl = `${import.meta.env.BASE_URL}${import.meta.env.VITE_ASSETS_PATH}`
const roleBg = computed(() => ({
    backgroundImage: `url(${baseUrl}assets/images/${props.role}_stand.gif)`
}))
const skillBg = computed(() => ({
    backgroundImage: `url(${baseUrl}assets/images/bullets.gif)`
}))
const test = 'display:none'

const playAnim = () => {
    play.value = true
    setTimeout(() => play.value = false, 1000)
}
</script>

<template>
    <div class="skill-anim">
        <div class="role" :style="roleBg"></div>
        <div class="skill" :class="play ? 'skill-active' : ''" :style="skillBg">
        </div>
        <button v-if="props.debug" @click="playAnim">Play</button>
    </div>
</template>

<style scoped>
.skill-anim {
    width: 100%;
    height: 100%;
    position: relative;
}

.role {
    position: relative;
    width: 100%;
    height: 100%;
    background-position: left;
    background-repeat: no-repeat;
}

.skill {
    position: absolute;
    top: 50%;
    width: 200px;
    height: 33px;
    display: none;
    background-position: center;
    background-repeat: no-repeat;
    background-position: -100px -100px;
}

.skill.skill-active {
    display: block;
    animation-duration: 1s;
    animation-name: skill;
    animation-delay: 0s;
    animation-fill-mode: forwards;
}

@keyframes skill {
    0% {
        right: 80%;
        filter: opacity(1);
    }

    50% {
        right: 10%;
        filter: opacity(1);
    }

    100% {
        right: 10%;
        filter: opacity(0);
    }
}
</style>
