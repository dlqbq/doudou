import { RESOURCE_BASE_URL } from '../config'

class AudioService {
    constructor() {
        this.bgm = null
        this.sfx = {}
        this.isBgmMuted = false      // 🔑 默认不静音
        this.isSfxMuted = false      // 🔑 默认不静音
        this.baseUrl = RESOURCE_BASE_URL
        this.initialized = false
    }

    init() {
        if (this.initialized) return

        this.bgm = new Audio(`${this.baseUrl}audios/bgm.wav`)
        this.bgm.loop = true
        this.bgm.volume = 0.3
        this.bgm.preload = 'auto'
        this.bgm.muted = false  // 🔑 默认不静音

        this.sfx = {
            magic: new Audio(`${this.baseUrl}audios/magic.mp3`),
            attack: new Audio(`${this.baseUrl}audios/magic.mp3`),
            win: new Audio(`${this.baseUrl}audios/magic.mp3`),
            lose: new Audio(`${this.baseUrl}audios/magic.mp3`),
            select: new Audio(`${this.baseUrl}audios/magic.mp3`),
            lock: new Audio(`${this.baseUrl}audios/magic.mp3`),
            timeout: new Audio(`${this.baseUrl}audios/magic.mp3`),
        }

        Object.values(this.sfx).forEach(audio => {
            audio.preload = 'auto'
            audio.volume = 0.5
            audio.muted = false  // 🔑 默认不静音
            audio.load()
        })

        this.initialized = true
    }

    playBgm() {
        if (!this.bgm) return
        this.bgm.currentTime = 0
        this.bgm.play().catch(() => { })
    }

    stopBgm() {
        if (!this.bgm) return
        this.bgm.pause()
        this.bgm.currentTime = 0
    }

    toggleBgm() {
        this.isBgmMuted = !this.isBgmMuted
        if (!this.bgm) return this.isBgmMuted

        this.bgm.muted = this.isBgmMuted
        if (!this.isBgmMuted) {
            this.bgm.play().catch(() => { })
        }
        return this.isBgmMuted
    }

    playSfx(name) {
        if (this.isSfxMuted) return
        const audio = this.sfx[name]
        if (audio) {
            audio.currentTime = 0
            audio.play().catch(() => { })
        }
    }

    toggleSfx() {
        this.isSfxMuted = !this.isSfxMuted
        Object.values(this.sfx).forEach(audio => {
            audio.muted = this.isSfxMuted
        })
        return this.isSfxMuted
    }

    setBgmVolume(volume) {
        if (this.bgm) this.bgm.volume = volume
    }

    setSfxVolume(volume) {
        Object.values(this.sfx).forEach(audio => {
            audio.volume = volume
        })
    }

    destroy() {
        this.stopBgm()
        this.bgm = null
        this.sfx = {}
        this.initialized = false
    }
}

export const audioService = new AudioService()