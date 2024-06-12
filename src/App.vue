<template>
    <div class="app-layout">
        <GlobalMessage>
            <button @click="backToLobby">返回大厅</button>
        </GlobalMessage>
        <RouterView></RouterView>
    </div>
</template>

<script setup>
import { watch, getCurrentInstance, onMounted } from 'vue';
import { useDoudouStore } from '@/stores/DoudouStore'
import { useRouter } from 'vue-router'
import GlobalMessage from '@/components/GlobalMessage.vue';
const app = getCurrentInstance()
const { disconnect, send } = app.proxy.$peer
const router = useRouter()
const doudouStore = useDoudouStore()

const backToLobby = () => {
    doudouStore.status = 0
}

watch(
    () => doudouStore.status,
    (newStatus) => {
        switch (newStatus) {
            case 0:
                // case 5:
                // case 9:
                send({ status: 0 })
                disconnect()
                router.replace('/')
                break;
            case 6:
                router.replace('/prepare')
                doudouStore.showMessage = false
                break;
            case 10:
                if (doudouStore.rivalStatus === 10) {
                    router.replace('/battle')
                }
                break;
            case 12:
            case 13:
                router.replace('/result')
                break;
            default:
                break;
        }
    },
    {
        immediate: true
    }
)
watch(
    () => doudouStore.rivalStatus,
    (newRivalStatus) => {
        switch (newRivalStatus) {
            case 10:
                if (doudouStore.status === 10) {
                    router.replace('/battle')
                }
                break;
            case 12:
                doudouStore.status = 13
                break
            case 13:
                doudouStore.status = 12
                break
            default:
                break;
        }
    },
    {
        immediate: true
    }
)
onMounted(() => doudouStore.showMessage = false)
</script>

<style scoped>
.app-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-position: center;
    background-clip: padding-box;
    background-size: cover;
    background-image: url('./assets/images/bgm00001.png');
}
</style>
