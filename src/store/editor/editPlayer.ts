import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface EditPlayer {
    x: number;
    y: number;
}

export const useEditPlayerStore = defineStore('edit-player', () => {
    const player = reactive<EditPlayer>({
        x: 0,
        y: 0,
    })

    const visible = ref<boolean>(false);

    function display() {
        visible.value = true;
    }

    function hidden() {
        visible.value = false;
    }

    return { player, visible, display, hidden }
})