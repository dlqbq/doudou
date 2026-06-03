<template>
    <div class="card game-layout">
        <StatusBar :energy="store.currentEnergy" :timeout-count="store.timeoutCount" :locked="store.locked"
            :game-over="store.gameOver" :status-text="statusText" @timeout="handleTimeout" />

        <BattleStage :self-name="store.username" :self-skill="store.currentSkill" :self-locked="store.locked"
            :self-skill-id="store.currentSkillId" :rival-name="store.rivalName" :rival-skill="store.rivalSkill"
            :rival-locked="store.locked" :rival-skill-id="store.rivalSkillId"
            :rival-timeout-count="store.rivalTimeoutCount" :game-result="store.gameResult"
            :game-over="store.gameOver" />

        <GameLog :entries="store.battleLog" />

        <RematchRequest v-if="store.gameOver && store.rivalWantsRematch && !store.iWantRematch"
            :rival-name="store.rivalName" @accept="store.acceptRematch()" @decline="store.declineRematch()" />

        <GameResult v-if="store.gameOver" :result="store.gameResult" :rival-name="store.rivalName"
            :self-skill="store.currentSkill" :rival-skill="store.rivalSkill"
            :rematch-status-text="store.rematchStatusText" :rematch-requested="store.iWantRematch"
            @rematch="store.requestRematch()" @back="handleBackToLobby" />

        <SkillPool v-if="!store.gameOver" :skills="store.skills" :current-skill-id="store.currentSkillId"
            :current-skill-name="store.currentSkill?.name" :locked="store.locked" :energy="store.currentEnergy"
            :flower-used="store.flowerUsed" :timeout-count="store.timeoutCount" :rival-skill-id="store.rivalSkillId"
            @select="store.selectSkill($event.id)" @lock="store.lockSkill()" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import StatusBar from '../components/game/StatusBar.vue'
import BattleStage from '../components/game/BattleStage.vue'
import SkillPool from '../components/game/SkillPool.vue'
import GameLog from '../components/game/GameLog.vue'
import RematchRequest from '../components/game/RematchRequest.vue'
import GameResult from '../components/game/GameResult.vue'

const router = useRouter()
const store = useGameStore()
const battleStageRef = ref(null)

const handleTimeout = () => {
    store.autoSelectTimeout()
}

const handleBackToLobby = () => {
    store.backToLobby()
    router.push('/lobby')
}

const statusText = computed(() => {
    if (store.gameOver) {
        if (store.gameResult === 'opponent-left') return '对手已离开'
        if (store.gameResult === 'timeout-both-lose') return '双方超时'
        return store.gameResult === 'win' ? '胜利！' : '失败...'
    }
    if (store.locked && store.rivalSkillId > 0) return '判定中...'
    if (store.locked) return '已锁定，等待对手'
    if (store.currentSkill) return '已选择，点击锁定'
    return '请选择技能卡牌'
})
</script>

<style scoped>
.game-layout {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
</style>