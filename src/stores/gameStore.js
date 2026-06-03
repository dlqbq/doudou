import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { peerService } from '../services/PeerService'

const SKILL_DATA = [
    { id: 1, type: 'doudou', name: '豆豆', energy: 1, beat: [], prevent: [1, 4, 5, 9, 12, 15], limit: -1 },
    { id: 2, type: 'feibiao', name: '飞镖', energy: -1, beat: [1, 5], prevent: [1, 2, 4, 5, 12, 15], limit: -1 },
    { id: 3, type: 'shuangfei', name: '双飞', energy: -2, beat: [1, 2, 5], prevent: [1, 2, 3, 4, 5, 12, 15], limit: -1 },
    { id: 4, type: 'wufang', name: '物理防御', energy: 0, beat: [], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15], limit: 3 },
    { id: 5, type: 'mofang', name: '魔法防御', energy: 0, beat: [], prevent: [1, 4, 5, 9, 10, 12, 13, 15], limit: 3 },
    { id: 6, type: 'yueye', name: '越野', energy: -2, beat: [1, 2, 5], prevent: [1, 2, 3, 4, 5, 6, 7, 12, 15], limit: -1 },
    { id: 7, type: 'danqiang', name: '单枪', energy: -2, beat: [1, 2, 5], prevent: [1, 2, 3, 4, 5, 6, 7, 12, 15], limit: -1 },
    { id: 8, type: 'shuangqiang', name: '双枪', energy: -4, beat: [1, 2, 3, 5, 6, 7, 11], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15], limit: -1 },
    { id: 9, type: 'chuansong', name: '传送', energy: 0, beat: [2, 6, 7, 10, 13, 14], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15], limit: 3 },
    { id: 10, type: 'bingshan', name: '冰山', energy: -4, beat: [1, 2, 3, 4, 6, 7, 11], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 15], limit: -1 },
    { id: 11, type: 'sanzhua', name: '三爪', energy: -3, beat: [1, 2, 3, 5, 6, 7, 9], prevent: [1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 15], limit: -1 },
    { id: 12, type: 'meiyou', name: '没有', energy: 1, beat: [], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], limit: 3 },
    { id: 13, type: 'shijiemori', name: '世界末日', energy: -8, beat: [1, 2, 3, 4, 6, 7, 8, 10, 11], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15], limit: -1 },
    { id: 14, type: 'yuzhoumori', name: '宇宙末日', energy: -16, beat: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15], limit: -1 },
    { id: 15, type: 'xianhua', name: '鲜花', energy: 0, beat: [], prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], limit: 1 }
]

export const useGameStore = defineStore('game', () => {
    const username = ref('')
    const peerId = ref('')
    const status = ref(0)
    const rivalStatus = ref(0)
    const isHost = ref(false)
    const rivalName = ref('')
    const rivalReady = ref(false)
    const isReady = ref(false)
    const gameStarted = ref(false)
    const battleLog = reactive([])

    const currentSkillId = ref(0)
    const currentEnergy = ref(0)
    const locked = ref(false)
    const flowerUsed = ref(false)
    const wufangCounts = ref(0)
    const mofangCounts = ref(0)
    const chuansongCounts = ref(0)
    const meiyouCounts = ref(0)
    const rivalSkillId = ref(0)
    const rivalFlowerUsed = ref(false)

    const gameOver = ref(false)
    const gameResult = ref('')

    const isGameActive = ref(false)
    const isDisconnecting = ref(false)
    const isProcessingGameOver = ref(false)

    const iWantRematch = ref(false)
    const rivalWantsRematch = ref(false)

    // 超时计数
    const timeoutCount = ref(0)
    const rivalTimeoutCount = ref(0)

    const timers = new Set()

    function addTimer(fn, delay, type = 'timeout') {
        let id
        if (type === 'interval') {
            id = setInterval(fn, delay)
        } else {
            id = setTimeout(fn, delay)
        }
        timers.add(id)
        return id
    }

    function clearTimer(id) {
        clearTimeout(id)
        clearInterval(id)
        timers.delete(id)
    }

    function clearAllTimers() {
        console.log(`🧹 清理 ${timers.size} 个定时器`)
        timers.forEach(id => {
            clearTimeout(id)
            clearInterval(id)
        })
        timers.clear()
    }

    const skills = computed(() => SKILL_DATA)
    const currentSkill = computed(() => SKILL_DATA.find(s => s.id === currentSkillId.value))
    const rivalSkill = computed(() => SKILL_DATA.find(s => s.id === rivalSkillId.value))

    const rematchStatusText = computed(() => {
        if (iWantRematch.value && rivalWantsRematch.value) return '双方都同意，即将开始...'
        if (iWantRematch.value && !rivalWantsRematch.value) return '已请求再来一局，等待对手同意...'
        if (!iWantRematch.value && rivalWantsRematch.value) return '对手请求再来一局！'
        return ''
    })

    function initPeerCallbacks() {
        console.log('🔧 初始化 Peer 回调')
        peerService.onStatusChange = (newStatus) => {
            if (isGameActive.value || isDisconnecting.value) return
            status.value = newStatus
        }
        peerService.onDataReceived = (data) => {
            handleData(data)
        }
        peerService.onPeerOpen = (id) => {
            peerId.value = id
            status.value = isHost.value ? 1 : 2
        }
    }

    function handleData(data) {
        if (isDisconnecting.value) return

        console.log('🔍 处理数据:', JSON.stringify(data))

        // 游戏结束后
        if (gameOver.value) {
            if (data.type === 'request-rematch') {
                console.log('🔄 收到对手再来一局请求')
                rivalWantsRematch.value = true
                battleLog.push({ text: `🔄 ${rivalName.value || '对手'} 请求再来一局！`, cls: 'system' })
                if (iWantRematch.value) startRematch()
                return
            }
            if (data.type === 'accept-rematch') {
                console.log('✅ 对手同意再来一局')
                startRematch()
                return
            }
            if (data.type === 'decline-rematch') {
                console.log('❌ 对手拒绝再来一局')
                rivalWantsRematch.value = false
                iWantRematch.value = false
                battleLog.push({ text: `❌ ${rivalName.value || '对手'} 拒绝了再来一局`, cls: 'system' })
                return
            }
            if (data.type === 'back-lobby') {
                console.log('👋 对手返回大厅（游戏已结束）')
                handleOpponentLeft()
                return
            }
            console.log('🎮 游戏已结束，忽略其他数据')
            return
        }

        // 游戏中收到 back-lobby
        if (data.type === 'back-lobby') {
            console.log('👋 对手断开连接')
            handleOpponentLeft()
            return
        }
        if (data.type === 'game-start') { startGame(data); return }
        if (data.type === 'intro') { rivalName.value = data.name; return }
        if (data.type === 'ready') { rivalReady.value = true; checkBothReady(); return }
        if (data.type === 'cancel-ready') { rivalReady.value = false; return }

        // 处理双方超时失败
        if (data.bothLose) {
            console.log('💀 对手超时3次，双方失败')
            handleBothLose()
            return
        }

        // 处理技能数据
        if (data.skillId !== undefined || data.status !== undefined) {
            if (isProcessingGameOver.value) {
                console.log('🔄 正在处理游戏结束，忽略重复数据')
                return
            }

            if (data.skillId !== undefined && data.skillId >= 0) {
                rivalSkillId.value = data.skillId
                console.log('👊 对手技能ID:', data.skillId)
            }

            // 同步对手超时计数
            if (data.timeoutCount !== undefined) {
                rivalTimeoutCount.value = data.timeoutCount
            }

            if (data.status !== undefined && data.status >= 0) {
                rivalStatus.value = data.status
                console.log('📊 对手状态:', data.status)

                if (!gameOver.value) {
                    if (data.status === 13) {
                        console.log('🏆 对手失败，我赢了！')
                        handleWinWithoutSending()
                        return
                    }
                    if (data.status === 12 && locked.value) {
                        console.log('💀 对手胜利，我输了...')
                        handleLoseWithoutSending()
                        return
                    }
                }
            }

            if (locked.value && !gameOver.value && rivalSkillId.value > 0 && currentSkillId.value > 0) {
                console.log('⚔️ 双方都已选择，进行判定')
                finalJudge()
            }
        }
    }

    function handleOpponentLeft() {
        console.log('🔌 对手离开处理')
        clearAllTimers()
        isGameActive.value = false
        isDisconnecting.value = true
        gameStarted.value = false
        gameOver.value = true
        gameResult.value = 'opponent-left'
        locked.value = false
        currentSkillId.value = 0
        rivalSkillId.value = 0
        isProcessingGameOver.value = false
        iWantRematch.value = false
        rivalWantsRematch.value = false
        battleLog.push({ text: `👋 ${rivalName.value || '对手'} 已断开连接`, cls: 'system' })
        peerService.onStatusChange = null
        peerService.onDataReceived = null
        peerService.disconnect()
        peerId.value = ''
        status.value = 0
        rivalStatus.value = 0
        setTimeout(() => { isDisconnecting.value = false }, 500)
    }

    // 双方超时失败
    function handleBothLose() {
        if (gameOver.value) return
        console.log('💀 双方超时失败')
        isProcessingGameOver.value = true
        clearAllTimers()
        status.value = 13
        rivalStatus.value = 13
        gameOver.value = true
        gameResult.value = 'timeout-both-lose'
        locked.value = false
        currentSkillId.value = 0
        rivalSkillId.value = 0
        battleLog.push({ text: '⏰ 对方超时3次，双方失败！', cls: 'system' })
    }

    function safeDisconnect() {
        if (isDisconnecting.value) return
        console.log('🔌 安全断开连接')
        isDisconnecting.value = true
        isGameActive.value = false
        clearAllTimers()
        peerService.onStatusChange = null
        peerService.onDataReceived = null
        peerService.disconnect()
        peerId.value = ''
        status.value = 0
        rivalStatus.value = 0
        iWantRematch.value = false
        rivalWantsRematch.value = false
        setTimeout(() => { isDisconnecting.value = false }, 500)
    }

    function disconnect() {
        safeDisconnect()
    }

    function createGame() {
        console.log('🎮 创建游戏')
        resetAll()
        isHost.value = true
        status.value = 0
        initPeerCallbacks()
        peerService.create()
    }

    function joinGame(hostId) {
        console.log('🔗 加入游戏:', hostId)
        resetAll()
        isHost.value = false
        status.value = 0
        initPeerCallbacks()
        peerService.connect(hostId)
    }

    function sendData(data) {
        if (isDisconnecting.value) {
            console.log('🔌 正在断开，不发送数据')
            return
        }
        // 自动附加超时计数
        if (data.skillId !== undefined && !data.bothLose) {
            data.timeoutCount = timeoutCount.value
        }
        console.log('📤 发送数据:', JSON.stringify(data))
        peerService.send(data)
    }

    function checkBothReady() {
        if (isReady.value && rivalReady.value && isHost.value) {
            console.log('🎯 双方已准备，Host发起游戏')
            const gameData = { type: 'game-start', firstTurn: 'host', maxHP: 100 }
            sendData(gameData)
            startGame(gameData)
        }
    }

    function startGame(data) {
        console.log('🎮 开始游戏')
        isGameActive.value = true
        isDisconnecting.value = false
        isProcessingGameOver.value = false
        clearAllTimers()
        gameStarted.value = true
        gameOver.value = false
        gameResult.value = ''
        isReady.value = false
        rivalReady.value = false
        status.value = 10
        rivalStatus.value = 10
        iWantRematch.value = false
        rivalWantsRematch.value = false
        initBattle()
        battleLog.length = 0
        battleLog.push({ text: '⚡ 游戏开始！选择你的技能卡牌', cls: 'system' })
    }

    function initBattle() {
        currentSkillId.value = 0
        currentEnergy.value = 0
        locked.value = false
        flowerUsed.value = false
        wufangCounts.value = 0
        mofangCounts.value = 0
        chuansongCounts.value = 0
        meiyouCounts.value = 0
        rivalSkillId.value = 0
        rivalFlowerUsed.value = false
        timeoutCount.value = 0
        rivalTimeoutCount.value = 0
    }

    // 超时自动选择
    function autoSelectTimeout() {
        if (locked.value || gameOver.value) return

        timeoutCount.value++
        console.log('⏰ 超时！当前超时次数:', timeoutCount.value)
        battleLog.push({ text: `⏰ 超时！(${timeoutCount.value}/3)`, cls: 'system' })

        if (timeoutCount.value >= 3) {
            console.log('💀 超时3次，双方失败')
            isProcessingGameOver.value = true
            status.value = 13
            rivalStatus.value = 13
            gameOver.value = true
            gameResult.value = 'timeout-both-lose'
            sendData({ skillId: 0, status: 13, timeoutCount: timeoutCount.value, bothLose: true })
            battleLog.push({ text: '💀 超时3次，双方失败！', cls: 'system' })
        } else {
            // 自动选择豆豆
            const doudouSkill = SKILL_DATA.find(s => s.id === 1)
            if (doudouSkill) {
                currentSkillId.value = doudouSkill.id
                locked.value = true
                battleLog.push({ text: `🔒 自动选择: ${doudouSkill.name}`, cls: 'system' })
                preJudge()
            }
        }
    }

    function resetBattle() {
        console.log('🔄 重置战斗 - 再来一局')
        isProcessingGameOver.value = false
        clearAllTimers()
        initBattle()
        gameOver.value = false
        gameResult.value = ''
        status.value = 10
        rivalStatus.value = 10
        battleLog.length = 0
        battleLog.push({ text: '🔄 再来一局！选择你的技能卡牌', cls: 'system' })
    }

    function selectSkill(skillId) {
        if (locked.value || gameOver.value) return
        currentSkillId.value = skillId
    }

    function lockSkill() {
        if (!currentSkill.value || locked.value || gameOver.value) return
        locked.value = true
        preJudge()
    }

    function preJudge() {
        const skill = currentSkill.value
        let shouldFail = false
        let failReason = ''

        if (currentEnergy.value + skill.energy < 0) {
            shouldFail = true
            failReason = '能量不足'
        }

        if (flowerUsed.value && skill.id === 15) {
            shouldFail = true
            failReason = '鲜花已使用过'
        }

        // 重置计数
        wufangCounts.value = 0
        mofangCounts.value = 0
        chuansongCounts.value = 0
        meiyouCounts.value = 0

        if (skill.id === 4) wufangCounts.value++
        if (skill.id === 5) mofangCounts.value++
        if (skill.id === 9) chuansongCounts.value++
        if (skill.id === 12) meiyouCounts.value++

        if (wufangCounts.value > 3 || mofangCounts.value > 3 ||
            chuansongCounts.value > 3 || meiyouCounts.value > 3) {
            shouldFail = true
            failReason = '技能使用次数超限'
        }

        if (shouldFail) {
            console.log('❌ 预判断失败:', failReason)
            isProcessingGameOver.value = true
            status.value = 13
            rivalStatus.value = 12
            gameOver.value = true
            gameResult.value = 'lose'
            sendData({ skillId: currentSkillId.value, status: 13, timeoutCount: timeoutCount.value })
            battleLog.push({ text: `💀 ${failReason}，你输了！`, cls: 'system' })
        } else {
            console.log('✅ 预判断通过，发送技能')
            sendData({ skillId: currentSkillId.value, status: 10, timeoutCount: timeoutCount.value })
            battleLog.push({ text: `🔒 已锁定: ${skill.name}`, cls: 'system' })

            if (rivalSkillId.value > 0) {
                console.log('👊 对手已选择，立即判定')
                finalJudge()
            }
        }
    }

    function finalJudge() {
        if (gameOver.value || isProcessingGameOver.value) return

        const mySkill = currentSkill.value
        const rivalSkillData = rivalSkill.value

        if (!mySkill || !rivalSkillData) {
            console.log('⚠️ 技能数据不完整，无法判定')
            return
        }

        isProcessingGameOver.value = true
        console.log(`⚔️ 判定: ${mySkill.name}(${mySkill.id}) VS ${rivalSkillData.name}(${rivalSkillData.id})`)

        battleLog.push({ text: `⚔️ ${mySkill.name} VS ${rivalSkillData.name}`, cls: 'system' })

        let energy = mySkill.energy

        if (mySkill.id === 15) {
            flowerUsed.value = true
            console.log('🌸 使用了鲜花')
        }
        if (rivalSkillData.id === 15) {
            rivalFlowerUsed.value = true
            console.log('🌸 对手使用了鲜花')
        }

        if (mySkill.id === 15 || rivalSkillData.id === 15) {
            if (!(mySkill.id === 15 && rivalSkillData.id === 15)) {
                currentEnergy.value = 0
                energy = 0
                console.log('🔄 鲜花效果：能量归零')
            }
        }

        if (mySkill.beat.includes(rivalSkillData.id)) {
            console.log('🏆 我的技能克制对手')
            handleWin()
        } else if (rivalSkillData.beat.includes(mySkill.id)) {
            console.log('💀 对手的技能克制我')
            handleLose()
        } else {
            console.log('🤝 平局')
            isProcessingGameOver.value = false
            currentEnergy.value += energy
            battleLog.push({ text: `🤝 平局！当前能量: ${currentEnergy.value}`, cls: 'system' })

            addTimer(() => {
                if (!gameOver.value) {
                    console.log('🔄 重置选择，准备下一轮')
                    currentSkillId.value = 0
                    rivalSkillId.value = 0
                    locked.value = false
                }
            }, 1000)
        }
    }

    function handleWin() {
        console.log('🏆 胜利处理')
        status.value = 12
        rivalStatus.value = 13
        gameOver.value = true
        gameResult.value = 'win'
        sendData({ skillId: currentSkillId.value, status: 12, timeoutCount: timeoutCount.value })
        battleLog.push({ text: '🏆 你赢了！', cls: 'system' })
    }

    function handleLose() {
        console.log('💀 失败处理')
        status.value = 13
        rivalStatus.value = 12
        gameOver.value = true
        gameResult.value = 'lose'
        sendData({ skillId: currentSkillId.value, status: 13, timeoutCount: timeoutCount.value })
        battleLog.push({ text: '💀 你输了...', cls: 'system' })
    }

    function handleWinWithoutSending() {
        if (gameOver.value) return
        console.log('🏆 胜利处理（不发送）')
        isProcessingGameOver.value = true
        status.value = 12
        gameOver.value = true
        gameResult.value = 'win'
        battleLog.push({ text: '🏆 你赢了！', cls: 'system' })
    }

    function handleLoseWithoutSending() {
        if (gameOver.value) return
        console.log('💀 失败处理（不发送）')
        isProcessingGameOver.value = true
        status.value = 13
        gameOver.value = true
        gameResult.value = 'lose'
        battleLog.push({ text: '💀 你输了...', cls: 'system' })
    }

    // 再来一局相关
    function requestRematch() {
        console.log('🔄 请求再来一局')
        iWantRematch.value = true
        sendData({ type: 'request-rematch' })
        battleLog.push({ text: '🔄 你请求再来一局，等待对手回应...', cls: 'system' })
        if (rivalWantsRematch.value) startRematch()
    }

    function acceptRematch() {
        console.log('✅ 同意再来一局')
        sendData({ type: 'accept-rematch' })
        startRematch()
    }

    function declineRematch() {
        console.log('❌ 拒绝再来一局')
        iWantRematch.value = false
        rivalWantsRematch.value = false
        sendData({ type: 'decline-rematch' })
        battleLog.push({ text: '❌ 你拒绝了再来一局', cls: 'system' })
    }

    function startRematch() {
        console.log('🎮 双方同意，开始再来一局')
        iWantRematch.value = false
        rivalWantsRematch.value = false
        isProcessingGameOver.value = false
        clearAllTimers()
        initBattle()
        gameOver.value = false
        gameResult.value = ''
        status.value = 10
        rivalStatus.value = 10
        battleLog.length = 0
        battleLog.push({ text: '🔄 再来一局！选择你的技能卡牌', cls: 'system' })
    }

    function backToLobby() {
        console.log('👋 返回大厅')
        sendData({ type: 'back-lobby' })
        isGameActive.value = false
        gameStarted.value = false
        gameOver.value = false
        safeDisconnect()
    }

    function resetAll() {
        isGameActive.value = false
        isDisconnecting.value = false
        isProcessingGameOver.value = false
        gameStarted.value = false
        gameOver.value = false
        iWantRematch.value = false
        rivalWantsRematch.value = false
        clearAllTimers()
        initBattle()
        battleLog.length = 0
    }

    function resetGame() {
        resetAll()
    }

    return {
        username, peerId, status, rivalStatus, isHost,
        rivalName, rivalReady, isReady,
        gameStarted, battleLog, gameOver, gameResult,
        currentSkillId, currentEnergy, locked,
        flowerUsed, wufangCounts, mofangCounts, chuansongCounts, meiyouCounts,
        rivalSkillId, rivalFlowerUsed,
        skills, currentSkill, rivalSkill,
        timeoutCount, rivalTimeoutCount,
        iWantRematch, rivalWantsRematch, rematchStatusText,
        createGame, joinGame, sendData, disconnect,
        checkBothReady, selectSkill, lockSkill, finalJudge,
        autoSelectTimeout,
        requestRematch, acceptRematch, declineRematch,
        backToLobby, initBattle, resetGame,
        isGameActive, addTimer, clearTimer, clearAllTimers
    }
})