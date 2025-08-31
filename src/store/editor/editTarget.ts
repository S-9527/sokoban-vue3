import { defineStore } from "pinia";
import {reactive, ref} from "vue";
import { generateId } from "@/utils/id.ts";

export interface EditTarget {
    x: number;
    y: number;
    id: number;
}

export const useEditTargetStore = defineStore('edit-target', () => {
    const targets= reactive<EditTarget[]>([]);
    const visible = ref<boolean>(true);

    function createTarget({ x, y }: { x: number, y: number }): EditTarget {
        return { id: generateId(), x, y }
    }

    function addTarget(target: EditTarget) {
        targets.push(target)
    }

    function removeTarget(target: EditTarget) {
        targets.splice(targets.indexOf(target), 1)
    }

    function disableTarget() {
        visible.value = false;
    }

    function enableTarget() {
        visible.value = true;
    }

    return {
        visible,
        targets,
        createTarget,
        addTarget,
        removeTarget,
        disableTarget,
        enableTarget
    }
})