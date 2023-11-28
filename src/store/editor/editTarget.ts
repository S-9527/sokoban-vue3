import { defineStore } from "pinia";
import { reactive } from "vue";
import { generateId } from "@/utils/id.ts";

export interface EditTarget {
    x: number;
    y: number;
    id: number;
}

export const useEditTargetStore = defineStore('edit-target', () => {
    const targets= reactive<EditTarget[]>([]);

    function createTarget({ x, y }: { x: number, y: number }): EditTarget {
        return { id: generateId(), x, y }
    }

    function addTarget(target: EditTarget) {
        targets.push(target)
    }

    function removeTarget(target: EditTarget) {
        targets.splice(targets.indexOf(target), 1)
    }

    return {
        targets,
        createTarget,
        addTarget,
        removeTarget
    }
})