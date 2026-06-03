import { onUnmounted } from 'vue'

export function useTimer() {
    const timers = []

    function setTimeout(fn, delay) {
        const id = window.setTimeout(fn, delay)
        timers.push(id)
        return id
    }

    function setInterval(fn, delay) {
        const id = window.setInterval(fn, delay)
        timers.push(id)
        return id
    }

    function clearTimer(id) {
        window.clearTimeout(id)
        window.clearInterval(id)
        const idx = timers.indexOf(id)
        if (idx >= 0) timers.splice(idx, 1)
    }

    function clearAllTimers() {
        timers.forEach(id => {
            window.clearTimeout(id)
            window.clearInterval(id)
        })
        timers.length = 0
    }

    onUnmounted(() => {
        clearAllTimers()
    })

    return {
        setTimeout,
        setInterval,
        clearTimer,
        clearAllTimers
    }
}