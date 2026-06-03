<template>
    <div class="card-pool">
        <div v-if="timeoutCount >= 2" class="timeout-warning">⚠️ 已超时 {{ timeoutCount }} 次，再超时 {{ 3 - timeoutCount }}
            次将判定双方失败！</div>
        <div class="cards-container">
            <div v-for="skill in skills" :key="skill.id" class="skill-card-item"
                :class="{ 'selected': currentSkillId === skill.id, 'disabled': isDisabled(skill) }"
                @click="handleSelect(skill)">
                <div class="skill-name">{{ skill.name }}</div>
                <div class="skill-energy" :class="{ 'negative': skill.energy < 0 }">{{ skill.energy >= 0 ? '+' : '' }}{{
                    skill.energy }}</div>
                <div class="skill-id">#{{ skill.id }}</div>
            </div>
        </div>
        <div class="lock-area">
            <button class="btn btn-primary btn-block" :disabled="!currentSkillId || locked" @click="handleLock">
                {{ locked ? '🔒 已锁定' : currentSkillName ? `🔒 锁定技能: ${currentSkillName}` : '请先选择技能' }}
            </button>
        </div>
        <div class="waiting-area" v-if="locked">
            <p class="waiting-text">{{ rivalSkillId > 0 ? '⚔️ 双方已选择，判定中...' : '⏳ 等待对手选择技能...' }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    skills: { type: Array, required: true },
    currentSkillId: { type: Number, default: 0 },
    currentSkillName: { type: String, default: '' },
    locked: { type: Boolean, default: false },
    energy: { type: Number, default: 0 },
    flowerUsed: { type: Boolean, default: false },
    timeoutCount: { type: Number, default: 0 },
    rivalSkillId: { type: Number, default: 0 }
})

const emit = defineEmits(['select', 'lock'])

const isDisabled = (skill) => {
    if (props.locked) return true
    if (props.energy + skill.energy < 0) return true
    if (props.flowerUsed && skill.id === 15) return true
    return false
}

const handleSelect = (skill) => {
    if (!isDisabled(skill)) emit('select', skill)
}

const handleLock = () => {
    if (props.currentSkillId && !props.locked) emit('lock')
}
</script>

<style scoped>
.card-pool {
    background: var(--surface-light);
    border-radius: var(--radius);
    padding: 0.75rem;
}

.cards-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.4rem;
}

.skill-card-item {
    padding: 0.5rem 0.35rem;
    border-radius: 0.5rem;
    background: var(--surface);
    border: 2px solid var(--border);
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: center;
}

.skill-card-item:hover:not(.disabled) {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
}

.skill-card-item:active:not(.disabled) {
    transform: scale(0.95);
}

.skill-card-item.selected {
    border-color: var(--primary);
    background: rgba(249, 115, 22, 0.15);
    box-shadow: 0 0 10px rgba(249, 115, 22, 0.25);
}

.skill-card-item.disabled {
    opacity: 0.35;
    cursor: not-allowed;
    filter: grayscale(30%);
}

.skill-name {
    font-size: 0.7rem;
    font-weight: 700;
    margin-bottom: 0.15rem;
}

.skill-energy {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--success);
}

.skill-energy.negative {
    color: var(--danger);
}

.skill-id {
    font-size: 0.55rem;
    color: var(--text-muted);
    margin-top: 0.1rem;
}

.lock-area {
    margin-top: 0.75rem;
}

.waiting-area {
    margin-top: 0.5rem;
    text-align: center;
}

.waiting-text {
    color: var(--text-muted);
    font-size: 0.85rem;
}

.timeout-warning {
    text-align: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid var(--warning);
    border-radius: 0.5rem;
    color: var(--warning);
    font-size: 0.8rem;
    font-weight: 600;
    animation: pulse 1s infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

@media (max-width: 380px) {
    .cards-container {
        gap: 0.3rem;
    }

    .skill-card-item {
        padding: 0.4rem 0.2rem;
    }

    .skill-name {
        font-size: 0.6rem;
    }

    .skill-energy {
        font-size: 0.55rem;
    }

    .skill-id {
        font-size: 0.5rem;
    }
}
</style>