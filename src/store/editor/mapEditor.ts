import { defineStore } from "pinia";
import { reactive } from "vue";
import { type Map } from "@/store/map";

export const useMapEditorStore = defineStore('mapEditor', () => {
    const map = reactive<Map>([
        [2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2]
    ]);

    return { map }
})