import { createRouter, createWebHashHistory } from "vue-router";

import Lobby from "@/components/Lobby.vue";
import Battle from "@/components/Battle.vue";
import Prepare from "@/components/Prepare.vue";
import Result from "@/components/Result.vue";

const routes = [
    { path: '/', component: Battle },
    { path: '/prepare', component: Prepare },
    { path: '/battle', component: Battle },
    { path: '/result', component: Result },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})