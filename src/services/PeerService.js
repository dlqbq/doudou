import { Peer } from "peerjs";
import copy from 'copy-to-clipboard'
import { useDoudouStore } from "@/stores/DoudouStore";

const createPeer = () => {

    let doudouStore = useDoudouStore()

    let peer = null
    let conn = null
    let isHost = true
    let hostId = null

    const conOpen = () => {
        doudouStore.status = 6
        doudouStore.rivalStatus = 6
    }
    const conError = err => {
        console.log(err)
        doudouStore.status = 7
    }
    const conData = data => {
        console.log(data)
        // doudouStore.rivalStatus = 8
        // doudouStore.status = 8
        if (data.skillId >= 0) {
            doudouStore.rivalSkillId = data.skillId
        }
        if (data.status >= 0) {
            doudouStore.rivalStatus = data.status
            if (data.status === 0) {
                doudouStore.status = 0
            }
        }
    }
    const conClose = () => doudouStore.status = 9

    const peerOpen = id => {
        doudouStore.peerId = id
        doudouStore.status = 1

        if (!isHost) {
            // Close old connection
            if (conn) {
                conn.close();
            }
            conn = peer.connect(hostId, { reliable: false })
            conn.on('open', conOpen)
            conn.on('error', conError)
            conn.on('data', conData)
            conn.on('close', conClose)
        } else {
            copy(id)
        }
    }
    const peerConnection = con => {
        conn = con
        doudouStore.status = 2

        conn.on('open', conOpen)
        conn.on('error', conError)
        conn.on('data', conData)
        conn.on('close', conClose)
    }
    const peerDisconnected = currentId => {
        doudouStore.status = 3
    }
    const peerError = err => {
        console.log(err)
        doudouStore.status = 4
    }
    const peerClose = () => doudouStore.status = 5

    const init = () => {
        doudouStore.isHost = isHost
        if (peer) {
            peer.disconnect()
        }
        peer = new Peer(null, { debug: 3 })

        peer.on('open', peerOpen)
        peer.on('connection', peerConnection)
        peer.on('disconnected', peerDisconnected)
        peer.on('error', peerError)
        peer.on('close', peerClose)
    }

    const create = () => {
        isHost = true
        init()
    }

    const connect = id => {
        isHost = false
        hostId = id
        init()
    }

    const send = data => conn && conn.send(data)

    const disconnect = () => {
        doudouStore.peerId = ''
        conn && conn.close()
        peer && peer.disconnect()
    }

    return {
        install: app => {
            app.config.globalProperties.$peer = { create, connect, send, disconnect };
        }

    }
}

export {
    createPeer,

}