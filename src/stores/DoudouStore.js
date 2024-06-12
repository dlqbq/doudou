import { defineStore } from "pinia";
const DEFAULT_SKILL_TYPE = 'stand'
const DEFAULT_ROLE_NAME = 'wukong'
const SKILL_DATA = [{
    id: 1,
    type: 'doudou',
    name: '豆豆',
    energy: 1,
    beat: [],
    prevent: [1, 4, 5, 9, 12, 15],
    limit: -1
},
{
    id: 2,
    type: 'feibiao',
    name: '飞镖',
    energy: -1,
    beat: [1, 5],
    prevent: [1, 2, 4, 5, 12, 15],
    limit: -1
},
{
    id: 3,
    type: 'shuangfei',
    name: '双飞',
    energy: -2,
    beat: [1, 2, 5],
    prevent: [1, 2, 3, 4, 5, 12, 15],
    limit: -1
},
{
    id: 4,
    type: 'wufang',
    name: '物理防御',
    energy: 0,
    beat: [],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15],
    limit: 3
},
{
    id: 5,
    type: 'mofang',
    name: '魔法防御',
    energy: 0,
    beat: [],
    prevent: [1, 4, 5, 9, 10, 12, 13, 15],
    limit: 3
},
{
    id: 6,
    type: 'yueye',
    name: '越野',
    energy: -2,
    beat: [1, 2, 5],
    prevent: [1, 2, 3, 4, 5, 6, 7, 12, 15],
    limit: -1
},
{
    id: 7,
    type: 'danqiang',
    name: '单枪',
    energy: -2,
    beat: [1, 2, 5],
    prevent: [1, 2, 3, 4, 5, 6, 7, 12, 15],
    limit: -1
},
{
    id: 8,
    type: 'shuangqiang',
    name: '双枪',
    energy: -4,
    beat: [1, 2, 3, 5, 6, 7, 11],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15],
    limit: -1
},
{
    id: 9,
    type: 'chuansong',
    name: '传送',
    energy: 0,
    beat: [2, 6, 7, 10, 13, 14],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15],
    limit: 3
},
{
    id: 10,
    type: 'bingshan',
    name: '冰山',
    energy: -4,
    beat: [1, 2, 3, 4, 6, 7, 11],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 15],
    limit: -1
},
{
    id: 11,
    type: 'sanzhua',
    name: '三爪',
    energy: -3,
    beat: [1, 2, 3, 5, 6, 7, 9],
    prevent: [1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 15],
    limit: -1
},
{
    id: 12,
    type: 'meiyou',
    name: '没有',
    energy: 1,
    beat: [],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    limit: 3
},
{
    id: 13,
    type: 'shijiemori',
    name: '世界末日',
    energy: -8,
    beat: [1, 2, 3, 4, 6, 7, 8, 10, 11],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15],
    limit: -1
},
{
    id: 14,
    type: 'yuzhoumori',
    name: '宇宙末日',
    energy: -16,
    beat: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
    limit: -1
},
{
    id: 15,
    type: 'xianhua',
    name: '鲜花',
    energy: 0,
    beat: [],
    prevent: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    limit: 1
}
]
const STATUS_MAP = {
    0: 'Waiting',
    1: 'Peer - open',
    2: 'Peer - connection',
    3: 'Peer - disconnected',
    4: 'Peer - error',
    5: 'Peer - close',
    6: 'Connection - open',
    7: 'Connection - error',
    8: 'Connection - data',
    9: 'Connection - close',
    10: 'Ready',
    11: 'Battle',
    12: 'Win',
    13: 'Lose'
}

// 定义仓库
export const useDoudouStore = defineStore('doudou', {
    // 定义状态
    state: () => {
        return {
            peerId: '',
            isHost: false,
            count: 0,
            status: 0,
            rivalStatus: 0,

            // start for player
            name: `豆豆${(Math.random() * 1000000).toFixed(0)}`,
            role: DEFAULT_ROLE_NAME,
            playerState: DEFAULT_SKILL_TYPE,
            // end for player

            showMessage: true,
            // message: 'Loading...',
            showActions: false,
            autoDismissSeconds: -1,

            currentSkillId: 0,
            currentEnergy: 0,
            locked: false,
            flowerUsed: false,
            wufangCounts: 0,
            mofangCounts: 0,
            chuansongCounts: 0,
            meiyouCounts: 0,

            rivalRole: DEFAULT_ROLE_NAME,
            rivalSkillId: 0,
            rivalFlowerUsed: false,

            isBgmMuted: false,
            isSoundMuted: false,


        }
    },
    // 计算数据
    getters: {
        statusName: state => state.STATUS_MAP[state.status],
        rivalStatusName: state => state.STATUS_MAP[state.rivalStatus],
        currentSkill: (state) => SKILL_DATA.filter(skill => skill.id === state.currentSkillId)[0],
        rivalSkill: (state) => SKILL_DATA.filter(skill => skill.id === state.rivalSkillId)[0],
        message: state => {
            let message = ''
            switch (state.status) {
                case 0:
                    message = state.isHost ? '创建中, 请稍候...' : '加入中，请稍候...'
                    break;
                case 1:
                    message = state.isHost ? `已复制[${state.peerId}]，直接去邀请好友对战吧` : `已加入，准备战斗！`
                    break;
                case 2:
                    message = `对战开启，等待连接!`
                    break;
                case 3:
                case 9:
                    message = `连接已断开，请重新开始！`
                    break;
                case 4:
                case 7:
                    message = `连接出错，请重新开始 :(`
                    break;
                case 5:
                    message = `连接已关闭，请重新开始！`
                    break;
                case 6:
                    message = `已连接，准备战斗！`
                    break;
                case 8:
                    message = `对方已出手，请你出招！`
                    break;
                default:
                    break;
            }
            return message
        },


        skills: () => SKILL_DATA,
        STATUS_MAP: () => STATUS_MAP,
    },
    // 动作支持异步
    actions: {
        increment() {
            this.count++
        },
        initBattle() {
            this.currentSkillId = 0
            this.currentEnergy = 0
            this.locked = false
            this.flowerUsed = false
            this.wufangCounts = 0
            this.mofangCounts = 0
            this.chuansongCounts = 0
            this.meiyouCounts = 0

            this.rivalSkillId = 0
            this.rivalFlowerUsed = false
        },
        increaseWufangCount() {
            this.wufangCounts += 1
        },
        resetWufangCount() {
            this.wufangCounts = 0
        },
        increaseMofangCount() {
            this.mofangCounts += 1
        },
        resetMofangCount() {
            this.mofangCounts = 0
        },
        increaseChuansongCount() {
            this.chuansongCounts += 1
        },
        resetChuansongCount() {
            this.chuansongCounts = 0
        },
        increaseMeiyouCount() {
            this.meiyouCounts += 1
        },
        resetMeiyouCount() {
            this.meiyouCounts = 0
        },
        setFlowerUsed(used) {
            this.flowerUsed = used
        },
        setRivalFlowerUsed(used) {
            this.rivalFlowerUsed = used
        },
    },
    // 开启数据持久化
    persist: {
        enabled: true,
    },

});