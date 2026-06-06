<script setup>
import { computed, ref, watch, inject } from 'vue'

const props = defineProps({
    skillType: { type: String, default: 'stand' },
    role: { type: String, default: 'wukong' },
    play: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false }
})
const baseUrl = inject('resourceBaseUrl', '/assets/')

// 🔑 角色站立图
const roleBg = computed(() => ({
    backgroundImage: `url(${baseUrl}images/${props.role}_stand.gif)`
}))

// 🔑 技能 GIF
const skillGifSrc = computed(() => `${baseUrl}images/${props.role}_${props.skillType}.gif`)

// 🔑 stand 类型不显示 GIF
const isStand = computed(() => props.skillType === 'stand')
</script>

<template>
    <div class="skill-anim" :class="{ 'reverse': reverse }">
        <!-- 站立图，播放技能时隐藏 -->
        <div v-show="!play || isStand" class="role" :style="roleBg"></div>
        <!-- 技能 GIF，播放时显示 -->
        <img v-show="play && !isStand" :src="skillGifSrc" class="skill-gif" :alt="skillType" />
    </div>
</template>

<style scoped>
.skill-anim {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.skill-anim.reverse {
    transform: scaleX(-1);
}

.role {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.skill-gif {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
</style>