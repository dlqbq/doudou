<template>
    <div class="fighter" :class="{ 'active': showActive }">
        <div class="fighter-name">
            <span v-if="isSelf" class="tag tag-you">你</span>
            {{ name }}
            <span v-if="!isSelf && timeoutCount > 0" class="timeout-badge">超时{{ timeoutCount }}/3</span>
        </div>
        <div class="fighter-anim">
            <SkillAnimation :role="'wukong'" :skill-type="displaySkillType" :play="showGif" :reverse="reverse" />
        </div>
        <div class="fighter-info">
            <!-- 显示技能名 -->
            <div class="skill-badge selected" v-if="showSkillName">
                {{ displaySkillName }}
            </div>
            <!-- 对方锁定，显示"已锁定" -->
            <div class="skill-badge locked" v-else-if="showLocked">
                已锁定
            </div>
            <!-- 等待中 -->
            <div class="skill-badge waiting" v-else-if="showWaiting">
                等待中...
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import SkillAnimation from './SkillAnimation.vue'

const props = defineProps({
    name: { type: String, required: true },
    skill: { type: Object, default: null },
    skillId: { type: Number, default: 0 },
    animPlaying: { type: Boolean, default: false },
    timeoutCount: { type: Number, default: 0 },
    isSelf: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false },
    // 本方的锁定状态
    myLocked: { type: Boolean, default: false },
    // 对方的锁定状态
    opponentLocked: { type: Boolean, default: false }
})

// 🔑 显示技能名：本方的技能总是显示，对方的技能只有双方都锁定才显示
const showSkillName = computed(() => {
    if (!props.skill) return false
    if (props.isSelf) return true
    return props.myLocked && props.opponentLocked
})

// 🔑 显示"已锁定"：对方锁定了，但自己还没锁定（看不到对方技能）
const showLocked = computed(() => {
    if (props.isSelf) return false
    return props.opponentLocked && !props.myLocked
})

// 🔑 显示"等待中"：自己锁定了，对方还没选
const showWaiting = computed(() => {
    if (props.isSelf) return false
    return props.myLocked && props.skillId === 0
})

// 🔑 显示的技能名称
const displaySkillName = computed(() => {
    if (!props.skill) return ''
    return props.skill.name
})

// 🔑 显示的技能类型（GIF）
const displaySkillType = computed(() => {
    if (!props.skill) return 'stand'
    return props.skill.type
})

// 🔑 是否播放 GIF：本方的技能总是播放，对方的技能只有双方都锁定才播放
const showGif = computed(() => {
    if (!props.animPlaying) return false
    if (props.isSelf) return true
    return props.myLocked && props.opponentLocked
})

// 🔑 高亮条件
const showActive = computed(() => {
    if (props.isSelf) return props.skillId > 0 || props.animPlaying
    return props.opponentLocked || props.animPlaying
})
</script>

<style scoped>
.fighter {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.fighter.active .fighter-anim {
    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
}

.fighter-name {
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
}

.fighter-anim {
    width: 100%;
    height: 120px;
    flex-shrink: 0;
}

.fighter-info {
    min-height: 24px;
}

.skill-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-weight: 700;
    font-size: 0.7rem;
    white-space: nowrap;
}

.skill-badge.selected {
    background: var(--primary);
    color: #fff;
}

.skill-badge.locked {
    background: var(--primary);
    color: #fff;
}

.skill-badge.waiting {
    background: var(--surface);
    color: var(--text-muted);
    border: 1px dashed var(--border);
}

.timeout-badge {
    font-size: 0.6rem;
    color: var(--warning);
    background: rgba(245, 158, 11, 0.2);
    padding: 0.1rem 0.4rem;
    border-radius: 0.5rem;
}

.tag {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    border-radius: 0.75rem;
    font-size: 0.6rem;
    font-weight: 700;
}

.tag-you {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
}

@media (max-width: 380px) {
    .fighter-anim {
        height: 90px;
    }
}
</style>