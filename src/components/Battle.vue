<script setup>
import { ref, getCurrentInstance, watch } from 'vue'
import { useDoudouStore } from "@/stores/DoudouStore";

const app = getCurrentInstance()
const doudouStore = useDoudouStore()
const { send } = app.proxy.$peer

const onCardClick = skill => doudouStore.currentSkillId = skill.id

const lockSkill = () => {
    doudouStore.locked = true
    preJudge()
}
const preJudge = () => {
    switch (doudouStore.currentSkill.id) {
        case 4:
            doudouStore.increaseWufangCount()
            doudouStore.resetMofangCount()
            doudouStore.resetChuansongCount()
            doudouStore.resetMeiyouCount()
            break;
        case 5:
            doudouStore.resetWufangCount()
            doudouStore.increaseMofangCount()
            doudouStore.resetChuansongCount()
            doudouStore.resetMeiyouCount()
            break;
        case 9:
            doudouStore.resetWufangCount()
            doudouStore.resetMofangCount()
            doudouStore.increaseChuansongCount()
            doudouStore.resetMeiyouCount()
            break;
        case 12:
            doudouStore.resetWufangCount()
            doudouStore.resetMofangCount()
            doudouStore.resetChuansongCount()
            doudouStore.increaseMeiyouCount()
            break;
        default:
            doudouStore.resetWufangCount()
            doudouStore.resetMofangCount()
            doudouStore.resetChuansongCount()
            doudouStore.resetMeiyouCount()
            break;
    }

    if (
        doudouStore.currentEnergy + doudouStore.currentSkill.energy < 0 ||
        (doudouStore.flowerUsed && doudouStore.currentSkill.id === 15) ||
        doudouStore.wufangCounts > 3 ||
        doudouStore.mofangCounts > 3 ||
        doudouStore.chuansongCounts > 3 ||
        doudouStore.meiyouCounts > 3
    ) {
        // state = 13是直接失败
        send({ status: 13 })
        doudouStore.status = 13
        doudouStore.rivalStatus = 12
        doudouStore.locked = true
    } else {
        // doudouStore.setCurrentSkillId(doudouStore.currentSkill.id)
        send({ skillId: doudouStore.currentSkillId })
    }
}


const finalJudge = () => {
    let energy = doudouStore.currentSkill.energy
    if (doudouStore.currentSkill.id === 15) {
        doudouStore.setFlowerUsed(true)
    }
    if (doudouStore.rivalSkill.id === 15) {
        doudouStore.setRivalFlowerUsed(true)
    }

    // 只有不同时使用flower，才重新开始游戏
    if (
        doudouStore.currentSkill.id === 15 ||
        doudouStore.rivalSkill.id === 15 &&
        !(doudouStore.currentSkill.id === 15 && doudouStore.rivalSkill.id === 15)
    ) {
        doudouStore.currentEnergy = 0
        energy = 0
    }

    if (doudouStore.currentSkill.beat.indexOf(doudouStore.rivalSkill.id) > -1) {
        doudouStore.status = 12
        doudouStore.rivalStatus = 13
    } else if (doudouStore.rivalSkill.beat.indexOf(doudouStore.currentSkill.id) > -1) {
        doudouStore.status = 13
        doudouStore.rivalStatus = 12
    } else {
        setTimeout(() => {
            doudouStore.currentSkillId = 0
            doudouStore.rivalSkillId = 0
            doudouStore.locked = false
        }, 1000)

        // 平局，计算能量
        doudouStore.currentEnergy = doudouStore.currentEnergy + energy
    }
}

const unwatchRivalSkillId = watch(
    () => doudouStore.rivalSkillId,
    newValue => {
        if (
            doudouStore.locked &&
            newValue > 0
        ) {
            finalJudge()
        }
    }, {
    immediate: true
}
)


const unwatchLocked = watch(
    () => doudouStore.locked,
    newValue => {
        if (newValue) {
            if (
                doudouStore.rivalSkillId > 0
            ) {
                finalJudge()
            }
        }
    }, {
    immediate: true
}
)
</script>

<template>
    <div class="battle-layout">
        <div class="status-bar">
            <div class="energy">能量: <span class="current-energy">{{ doudouStore.currentEnergy }}</span></div>
        </div>
        <div class="battle-field">
            <div class="player-container">
                <div class="player-img player1"
                    :style="{ 'background-image': 'url(./assets/images/' + doudouStore.role + '_' + (doudouStore.currentSkill ? doudouStore.currentSkill.type : 'stand') + '.gif)' }">
                    <div class="actions" v-if="doudouStore.currentSkill || doudouStore.locked">
                        <div class="lock-skill" v-if="!doudouStore.locked">
                            <button class="btn lock-skill-button" @click="lockSkill">锁定</button>
                        </div>
                    </div>
                    <div class="card skill-card" v-if="doudouStore.currentSkill">{{ doudouStore.currentSkill.name }}
                    </div>
                </div>
            </div>
            <div class="player-container">
                <div class="player-img player2"
                    :style="{ 'background-image': 'url(./assets/images/wukong_' + ((doudouStore.locked && doudouStore.rivalSkill) ? doudouStore.rivalSkill.type : 'stand') + '.gif)' }">
                    <div class="card skill-card" v-if="doudouStore.rivalSkill">
                        {{ doudouStore.locked ? doudouStore.rivalSkill.name : '已锁定' }}
                    </div>
                </div>
            </div>
        </div>
        <div class="card-pool">
            <div class="card" v-if="!doudouStore.locked" v-for="skill in doudouStore.skills" @click="onCardClick(skill)"
                :data-skill-id="skill.id">
                {{ skill.name }}
            </div>
            <!-- <div class="card card-doudou" data-skill="doudou" data-skill-name="豆豆">豆豆</div>
                <div class="card card-feibiao" data-skill="feibiao" data-skill-name="飞镖">飞镖</div>
                <div class="card card-shuangfei" data-skill="shuangfei" data-skill-name="双飞">双飞</div>
                <div class="card card-pufang" data-skill="pufang" data-skill-name="普通防御">普通防御</div>
                <div class="card card-yueye" data-skill="yueye" data-skill-name="越野">越野</div> -->
        </div>
    </div>

</template>

<style scoped>
.battle-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* start card */
.card {
    width: 2em;
    height: 4em;
    line-height: 2em;
    padding: 0.5em;
    margin: 0.5em;
    font-size: 1em;
    border: tomato 2px solid;
    border-radius: 1em;
    background-color: lightcoral;
    color: white;
    font-weight: 600;
    text-align: center;
    writing-mode: vertical-lr;
    cursor: pointer;
}

.card:hover {
    background-color: coral;
}

.card:active {
    background-color: saddlebrown;
}

/* end card */

.status-bar {
    height: 20%;
    min-height: 2em;
    width: 100%;
    vertical-align: middle;
    background-color: skyblue;
    text-align: center;
}

.status-bar .energy {
    font-size: 2em;
    height: 100%;
    min-height: 2em;
    vertical-align: middle;
    line-height: 2em;
}

.battle-field {
    height: 40%;
    min-height: 6em;
    width: 100%;
    background-color: beige;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.player-container {
    width: 50%;
}


.player-container .player-img {
    width: 100%;
    height: 100%;
    /* background-image: url('./assets/images/wukong_stand.gif'); */
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: space-between;
}

.player-container .player-img .skill-card {
    cursor: default;
}

.player-container .player-img .skill-card:hover {
    background-color: lightcoral;
}

.player-container .player-img .skill-card:active {
    background-color: lightcoral;
}

.player-container .player-img .lock-skill-button {
    /* display: none; */
}

.player-container .player-img.player2 {
    flex-direction: column;
    transform: rotateY(180deg);
}

.player-container .player-img.player2 .skill-card {
    transform: rotateY(180deg);
}

.card-pool {
    height: 40%;
    min-height: 12em;
    width: 100%;
    background-color: chartreuse;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: start;
}
</style>
