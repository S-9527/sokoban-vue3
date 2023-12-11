import {createRouter, createWebHistory} from "vue-router";
import Game from "@/view/Game.vue";
import Editor from "@/view/Editor.vue";
import GameAuto from "@/view/GameAuto.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:'/',
            redirect: 'Game'
        },
        {
            path: '/game',
            name: 'Game',
            component: Game
        },
        {
            path: '/game-auto',
            name:　'GameAuto',
            component: GameAuto
        },
        {
            path:'/editor',
            name:'Editor',
            component: Editor
        }
    ]
})