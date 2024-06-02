const SKILL_DATA = [
    {
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

const DEFAULT_SKILL_TYPE = 'stand'
const MESSAGE_LOADING = '少侠稍候，加载中。。。'
const MESSAGE_BATTLE_RESULT_LOSE = '胜败乃兵家常事，少侠请从头来过！'
const MESSAGE_BATTLE_RESULT_WIN = '恭喜少侠获胜，请再接再厉！'

const VIEW_NAME_LOADING = 'loading'
const VIEW_NAME_LOBBY = 'lobby'
const VIEW_NAME_BATTLE = 'battle'
const VIEW_NAME_RESULT = 'result'

const BATTLE_STATE_WAIT = 'wait'
const BATTLE_STATE_FIGHTING = 'fighting'
const BATTLE_STATE_WIN = 'win'
const BATTLE_STATE_LOSE = 'lose'

const appRoot = document.querySelector('#app')
const globalLoading = document.querySelector('.global-loading-view')

const app = Vue.createApp({
    data() {
        return {
            isHost: false,
            peer: null,
            lastPeerId: '',
            conn: null,
            hostId: null,

            currentView: VIEW_NAME_LOADING,
            message: MESSAGE_LOADING,
            isShowMessage: false,

            battleState: BATTLE_STATE_WAIT,

            skills: SKILL_DATA,

            currentSkill: null,
            currentSkillId: 0,
            currentSkillType: DEFAULT_SKILL_TYPE,
            currentEnergy: 0,
            locked: false,
            flowerUsed: false,
            rivalFlowerUsed: false,
            wufangCounts: 0,
            mofangCounts: 0,
            chuansongCounts: 0,
            meiyouCounts: 0,

            rivalSkill: null,
            rivalSkillName: '',
            rivalSkillType: DEFAULT_SKILL_TYPE,

            isBgmMuted: false,
            isSoundMuted: false,
        }
    },
    mounted: function () {
        this.isShowMessage = true
        this.currentView = VIEW_NAME_LOBBY
        setTimeout(() => this.isShowMessage = false, 1000)
    },
    methods: {
        showGlobalLoading: function () {
            this.showMessage(MESSAGE_LOADING, -1)
        },
        hideGlobalLoading: function () {
            this.isShowMessage = false
        },
        showMessage: function (message, timeout) {
            this.isShowMessage = true
            this.message = message
            if (timeout !== -1) {
                timeout = timeout ? timeout : 3000
                setTimeout(() => this.isShowMessage = false, timeout)
            }
        },
        isViewShow: function (viewName) {
            return viewName === this.currentView
            // return true
        },
        onCardClick: function (skill) {
            this.currentSkill = skill
        },
        copyToClipboard: function (text) {
            const that = this
            navigator.clipboard.writeText(text)
                .then(function () {
                    that.showMessage(`主机ID(${text})已复制到剪切板，去邀请好友吧！`, -1)
                })
                .catch(function (err) {
                    console.error(err)
                    that.showMessage(`无法复制(${text})到剪切板，${JSON.stringify(err)}, 请手动复制`, -1)
                });
        },
        startBattle: function () {
            this.currentView = VIEW_NAME_BATTLE

            this.battleState = BATTLE_STATE_FIGHTING
            this.currentSkill = null
            this.currentSkillId = 0
            this.currentSkillType = DEFAULT_SKILL_TYPE
            this.currentEnergy = 0
            this.locked = false
            this.flowerUsed = false
            this.rivalFlowerUsed = false
            this.wufangCounts = 0
            this.mofangCounts = 0
            this.chuansongCounts = 0
            this.meiyouCounts = 0

            this.rivalSkill = null
            this.rivalSkillName = ''
            this.rivalSkillType = DEFAULT_SKILL_TYPE

            this.hideGlobalLoading()
        },
        createBattle: function () {
            this.isHost = true
            this.showGlobalLoading()
            this.initializeHost()
        },

        joinBattle: function () {
            this.isHost = false
            this.showGlobalLoading()
            this.initializeClient(this.hostId)
        },

        onConnectData: function (data) {
            console.log(`Data recieved: ${JSON.stringify(data)}`);
            if (data.action === 1) {
                this.startBattle()
            } else if (data.action === 2) {
                const judgeInt = setInterval(() => {
                    if (this.battleState === BATTLE_STATE_FIGHTING && this.currentSkill && this.locked) {
                        clearInterval(judgeInt)
                        this.finalJudge(data.skillId)
                    }
                }, 300)
            } else if (data.action == 3) {
                this.showWinResult()
            } else {
                console.error('unkonw action')
            }
        },

        onConnectClose: function () {
            this.message = "Connection reset<br>Awaiting connection...";
            this.conn = null;
        },

        onHostPeerOpen: function (id) {
            // Workaround for peer.reconnect deleting previous id
            if (id === null) {
                console.log('Received null id from peer open');
                this.peer.id = this.lastPeerId;
            } else {
                this.lastPeerId = id;
            }

            this.copyToClipboard(id)
            this.viewName = VIEW_NAME_BATTLE
        },

        onPeerConnection: function (c) {
            // Allow only a single connection
            if (this.conn && this.conn.open) {
                c.on('open', function () {
                    c.send("Already connected to another client");
                    setTimeout(function () { c.close(); }, 500);
                });
                return;
            }

            this.conn = c;
            this.message = `已连接: ${this.conn.peer}`;

            this.conn.on('data', this.onConnectData);
            this.conn.on('close', this.onConnectClose);
            this.startBattle()
        },
        onPeerDisconnection: function () {
            this.message = "Connection lost. Please reconnect";

            // Workaround for peer.reconnect deleting previous id
            this.peer.id = this.lastPeerId;
            this.peer._lastServerId = this.lastPeerId;
            this.peer.reconnect();
        },
        onPeerClose: function () {
            this.conn = null;
            this.message = "Connection destroyed. Please refresh";
            console.log('Connection destroyed');
        },

        onPeerError: function (err) {
            console.log(err);
            alert('' + err);
        },

        initializeHost: function () {
            this.message = '开始创建主机...'
            this.peer = new Peer(null, {
                debug: 3
            })

            this.peer.on('open', this.onHostPeerOpen);
            this.peer.on('connection', this.onPeerConnection);
            this.peer.on('disconnected', this.onPeerDisconnection);
            this.peer.on('close', this.onPeerClose);
            this.peer.on('error', this.onPeerError);
        },

        onClientConnectOpen: function () {
            this.message = `已连接主机: ${this.conn.peer}`;
            this.conn.send({ action: 1, skillId: 0 });
            this.startBattle()
        },

        joinPeerHost: function (hostId) {
            // Close old connection
            if (this.conn) {
                this.conn.close();
            }

            // Create connection to destination peer specified in the input field
            this.conn = this.peer.connect(hostId, {
                reliable: true
            });

            // TODO not work
            this.conn.on('open', this.onClientConnectOpen);
            // Handle incoming data (messages only since this is the signal sender)
            this.conn.on('data', this.onConnectData);
        },

        onClientPeerOpen: function (id) {
            // Workaround for peer.reconnect deleting previous id
            if (id === null) {
                console.log('Received null id from peer open');
                this.peer.id = this.lastPeerId;
            } else {
                this.lastPeerId = id;
            }

            this.viewName = VIEW_NAME_BATTLE

            this.message = `客户ID: ${this.peer.id}成功`;

            this.joinPeerHost(this.hostId)
        },

        initializeClient: function (hostId) {
            this.peer = new Peer(null, {
                debug: 3
            })
            this.message = `开始连接主机: ${hostId}`;

            this.peer.on('open', this.onClientPeerOpen);
            this.peer.on('connection', this.onPeerConnection);
            this.peer.on('disconnected', this.onPeerDisconnection);
            this.peer.on('close', this.onPeerClose);
            this.peer.on('error', this.onPeerError);
        },

        showWinResult: function () {
            this.battleState = BATTLE_STATE_WIN
            setTimeout(() => {
                this.currentSkillType = BATTLE_STATE_WIN
                this.rivalSkillType = BATTLE_STATE_LOSE
                this.currentView = VIEW_NAME_RESULT
            }, 1000)
            this.showMessage(MESSAGE_BATTLE_RESULT_WIN)
        },

        showLoseResult: function () {
            this.battleState = BATTLE_STATE_LOSE
            setTimeout(() => {
                this.currentSkillType = BATTLE_STATE_LOSE
                this.rivalSkillType = BATTLE_STATE_WIN
                this.currentView = VIEW_NAME_RESULT
            }, 1000)
            this.showMessage(MESSAGE_BATTLE_RESULT_LOSE)
        },

        lockSkill: function () {
            this.locked = true;

            switch (this.currentSkill.id) {
                case 4:
                    ++this.wufangCounts;
                    this.mofangCounts = 0;
                    this.chuansongCounts = 0;
                    this.meiyouCounts = 0;
                    break;
                case 5:
                    ++this.mofangCounts;
                    this.wufangCounts = 0;
                    this.chuansongCounts = 0;
                    this.meiyouCounts = 0;
                    break;
                case 9:
                    ++this.chuansongCounts;
                    this.wufangCounts = 0;
                    this.mofangCounts = 0;
                    this.meiyouCounts = 0;
                    break;
                case 12:
                    ++this.meiyouCounts;
                    this.wufangCounts = 0;
                    this.mofangCounts = 0;
                    this.chuansongCounts = 0;
                    break;
                default:
                    this.wufangCounts = 0;
                    this.mofangCounts = 0;
                    this.chuansongCounts = 0;
                    this.meiyouCounts = 0;
                    break;
            }

            if (
                this.currentEnergy + this.currentSkill.energy < 0
                || (this.flowerUsed && this.currentSkill.id === 15)
                || this.wufangCounts > 3
                || this.mofangCounts > 3
                || this.chuansongCounts > 3
                || this.meiyouCounts > 3
            ) {
                this.showLoseResult();
                // action = 3是直接失败
                this.conn.send({ action: 3, skillId: 0 });
            } else {
                this.conn.send({ action: 2, skillId: this.currentSkill.id });
            }
        },

        finalJudge: function (rivalSkillId) {
            this.flowerUsed = this.currentSkill.id === 15;
            this.rivalFlowerUsed = rivalSkillId === 15
            if (this.flowerUsed || this.rivalFlowerUsed) {
                this.startBattle();
                return;
            }

            this.rivalSkill = this.skills.filter(skill => skill.id === rivalSkillId)[0]
            this.currentSkillType = this.currentSkill.type
            this.rivalSkillType = this.rivalSkill.type

            if (this.currentSkill.beat.indexOf(rivalSkillId) > -1) {
                this.showWinResult();
            } else if (this.rivalSkill.beat.indexOf(this.currentSkill.id) > -1) {
                this.showLoseResult();
            } else {
                setTimeout(() => {
                    this.currentSkillType = DEFAULT_SKILL_TYPE;
                    this.rivalSkillType = DEFAULT_SKILL_TYPE;
                    this.rivalSkill = null
                    this.currentSkill = null;
                    this.locked = false;
                }, 1000)

                // 平局，计算能量
                this.currentEnergy = this.currentEnergy + this.currentSkill.energy;
            }
        }
    }
}).mount('#app');

