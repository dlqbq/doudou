<template>
    <div class="preload-container">
        <div class="preload-card">
            <h1 class="title">⚔️ 豆豆斗斗</h1>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <p class="progress-text">{{ progress }}%</p>
            <p class="loading-text">{{ loadingText }}</p>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const resourceBaseUrl = inject('resourceBaseUrl', '/assets/')
const router = useRouter()
const progress = ref(0)
const loadingText = ref('正在准备资源...')

// 所有技能类型（从 SKILL_DATA 提取）
const skillTypes = [
    'stand',
    'doudou', 'feibiao', 'shuangfei',
    'wufang', 'mofang', 'yueye',
    'danqiang', 'shuangqiang', 'chuansong',
    'bingshan', 'sanzhua', 'meiyou',
    'shijiemori', 'yuzhoumori', 'xianhua'
]


// 需要预加载的资源列表
const imageUrls = [
    `${resourceBaseUrl}images/wukong_stand.gif`,
    ...skillTypes.map(type => `${resourceBaseUrl}images/wukong_${type}.gif`)
]

const audioUrls = [
    `${resourceBaseUrl}assets/audios/bgm.mp3`,
    `${resourceBaseUrl}assets/audios/magic.mp3`
]

const totalFiles = imageUrls.length + audioUrls.length
let loadedCount = 0

function updateProgress() {
    loadedCount++
    progress.value = Math.floor((loadedCount / totalFiles) * 100)
    if (progress.value >= 100) {
        loadingText.value = '加载完成，即将进入游戏...'
        setTimeout(() => {
            router.replace('/login')
        }, 500)
    }
}

function preloadImage(url) {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => { updateProgress(); resolve() }
        img.onerror = () => { updateProgress(); resolve() } // 错误也继续
        img.src = url
    })
}

function preloadAudio(url) {
    return new Promise((resolve) => {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.oncanplaythrough = () => { updateProgress(); resolve() }
        audio.onerror = () => { updateProgress(); resolve() }
        audio.src = url
        // 部分浏览器可能不会触发 oncanplaythrough，加一个超时
        setTimeout(() => {
            if (!audio.readyState) {
                updateProgress()
                resolve()
            }
        }, 3000)
    })
}

onMounted(async () => {
    const promises = [
        ...imageUrls.map(url => preloadImage(url)),
        ...audioUrls.map(url => preloadAudio(url))
    ]
    await Promise.all(promises)
})
</script>

<style scoped>
.preload-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
}

.preload-card {
    text-align: center;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
}

.title {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #f97316, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--surface-light);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: var(--primary);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
}

.loading-text {
    font-size: 0.8rem;
    color: var(--text-muted);
}
</style>