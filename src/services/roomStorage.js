const STORAGE_KEY = 'p2p-game-rooms'
const EXPIRY = 15000 // 15秒过期

export const roomStorage = {
    getRooms() {
        try {
            const data = localStorage.getItem(STORAGE_KEY)
            const all = data ? JSON.parse(data) : []
            const now = Date.now()
            return all.filter(r => now - r.t < EXPIRY)
        } catch {
            return []
        }
    },

    addRoom(peerId, creatorName) {
        const data = localStorage.getItem(STORAGE_KEY)
        const all = data ? JSON.parse(data) : []
        const filtered = all.filter(r => r.peerId !== peerId)
        filtered.push({ peerId, creatorName, t: Date.now() })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    },

    removeRoom(peerId) {
        const data = localStorage.getItem(STORAGE_KEY)
        const all = data ? JSON.parse(data) : []
        const filtered = all.filter(r => r.peerId !== peerId)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    },

    updateHeartbeat(peerId) {
        const data = localStorage.getItem(STORAGE_KEY)
        const all = data ? JSON.parse(data) : []
        const idx = all.findIndex(r => r.peerId === peerId)
        if (idx >= 0) {
            all[idx].t = Date.now()
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
        }
    }
}