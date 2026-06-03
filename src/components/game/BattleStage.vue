<template>
    <div class="battle-stage">
        <!-- 自己面板 -->
        <FighterPanel :name="selfName" :skill="selfSkill" :skill-id="selfSkillId" :anim-playing="selfAnimPlaying"
            :is-self="true" :my-locked="selfLocked" :opponent-locked="rivalLocked" />
        <!-- 对手面板 -->
        <FighterPanel :name="rivalName" :skill="rivalSkill" :skill-id="rivalSkillId" :anim-playing="rivalAnimPlaying"
            :timeout-count="rivalTimeoutCount" :is-self="false" :reverse="true" :my-locked="selfLocked"
            :opponent-locked="rivalLocked" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FighterPanel from './FighterPanel.vue'

const props = defineProps({
    selfName: String,
    selfSkill: Object,
    selfLocked: Boolean,
    selfSkillId: Number,
    rivalName: String,
    rivalSkill: Object,
    rivalLocked: Boolean,
    rivalSkillId: Number,
    rivalTimeoutCount: { type: Number, default: 0 },
    gameResult: { type: String, default: '' },
    gameOver: { type: Boolean, default: false }
})

const selfAnimPlaying = ref(false)
const rivalAnimPlaying = ref(false)

// 选中技能就开始播放
watch(() => props.selfSkillId, (val) => { if (val > 0) selfAnimPlaying.value = true })
watch(() => props.rivalSkillId, (val) => { if (val > 0) rivalAnimPlaying.value = true })

// 游戏重新开始或解锁时停止动画
watch(() => props.gameOver, (val) => { if (!val) stopAllAnim() })
watch(() => props.selfLocked, (val) => { if (!val) stopAllAnim() })

function stopAllAnim() {
    selfAnimPlaying.value = false
    rivalAnimPlaying.value = false
}
</script>

<style scoped>
.battle-stage {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 180px;
    padding: 0.5rem 0;
}

@media (max-width: 380px) {
    .battle-stage {
        min-height: 150px;
    }
}
</style>