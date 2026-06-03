import { Peer } from 'peerjs'

class PeerService {
    constructor() {
        this.peer = null
        this.conn = null
        this.lastPeerId = null
        this.hostId = null
        this.isHost = false
        this.isDisconnecting = false

        this.onStatusChange = null
        this.onDataReceived = null
        this.onPeerOpen = null
    }

    create() {
        this.isHost = true
        this.initPeer()
    }

    connect(hostId) {
        this.isHost = false
        this.hostId = hostId
        this.initPeer()
    }

    initPeer() {
        this.cleanup()
        this.isDisconnecting = false

        this.peer = new Peer(null, {
            pingInterval: 50000,
            debug: 2,
        })

        this.peer.on('open', (id) => this.handleOpen(id))
        this.peer.on('connection', (conn) => this.handleConnection(conn))
        this.peer.on('disconnected', () => this.handleDisconnected())
        this.peer.on('error', (err) => this.handleError(err))
        this.peer.on('close', () => this.handleClose())
    }

    cleanup() {
        if (this.peer) {
            try { this.peer.destroy() } catch (e) { }
            this.peer = null
        }
        if (this.conn) {
            try { this.conn.close() } catch (e) { }
            this.conn = null
        }
    }

    handleOpen(id) {
        if (this.isDisconnecting) return

        if (this.peer.id === null) {
            this.peer.id = this.lastPeerId
        } else {
            this.lastPeerId = this.peer.id
        }

        if (this.onPeerOpen) this.onPeerOpen(id)

        if (!this.isHost) {
            if (this.conn) this.conn.close()
            this.conn = this.peer.connect(this.hostId, { reliable: true })
            this.setupConnection()
        } else {
            this.copyToClipboard(id)
        }
    }

    handleConnection(incomingConn) {
        if (this.isDisconnecting) {
            incomingConn.close()
            return
        }
        this.conn = incomingConn
        if (this.onStatusChange) this.onStatusChange(2)
        this.setupConnection()
    }

    setupConnection() {
        this.conn.on('open', () => {
            if (!this.isDisconnecting && this.onStatusChange) {
                this.onStatusChange(6)
            }
        })

        this.conn.on('data', (data) => {
            if (!this.isDisconnecting && this.onDataReceived) {
                this.onDataReceived(data)
            }
        })

        this.conn.on('close', () => {
            if (!this.isDisconnecting) {
                if (this.onStatusChange) this.onStatusChange(9)
            }
        })
    }

    handleDisconnected() {
        if (!this.isDisconnecting && this.onStatusChange) {
            this.onStatusChange(3)
        }
        if (this.peer) {
            this.peer._lastServerId = this.lastPeerId
            this.peer.reconnect()
        }
    }

    handleError(err) {
        if (!this.isDisconnecting && this.onStatusChange) {
            this.onStatusChange(4)
        }
    }

    handleClose() {
        if (!this.isDisconnecting && this.onStatusChange) {
            this.onStatusChange(5)
        }
    }

    send(data) {
        if (!this.isDisconnecting && this.conn && this.conn.open) {
            this.conn.send(data)
        }
    }

    disconnect() {
        this.isDisconnecting = true
        this.onStatusChange = null
        this.onDataReceived = null
        this.onPeerOpen = null

        if (this.conn) {
            try { this.conn.close() } catch (e) { }
            this.conn = null
        }
        if (this.peer) {
            try { this.peer.destroy() } catch (e) { }
            this.peer = null
        }
    }

    copyToClipboard(text) {
        navigator.clipboard?.writeText(text).catch(() => {
            const el = document.createElement('textarea')
            el.value = text
            el.style.cssText = 'position:fixed;opacity:0'
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
        })
    }
}

export const peerService = new PeerService()