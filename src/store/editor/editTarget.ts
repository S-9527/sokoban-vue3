import { defineStore } from "pinia";
import { reactive } from "vue";
import { generateId } from "@/utils/id.ts";

export interface EditTarget {
    x: number;
    y: number;
    id: number;
    visible: boolean
}

export const useEditTargetStore = defineStore('edit-target', () => {
    const targets= reactive<EditTarget[]>([]);

    function createTarget({ x, y }: { x: number, y: number }): EditTarget {
        return { id: generateId(), x, y, visible: true }
    }

    function addTarget(target: EditTarget) {
        targets.push(target)
    }

    function removeTarget(target: EditTarget) {
        targets.splice(targets.indexOf(target), 1)
    }

    function disableTarget(x: number, y: number) {
        targets
            .filter(t => t.x === x && t.y === y)
            .forEach(target => target.visible = false);
    }

    function enableTarget(x: number, y: number) {
        targets
            .filter(t => t.x === x && t.y === y)
            .forEach(target => target.visible = true);
    }

    function enableAllTargets() {
        targets.forEach(target => {
            target.visible = true;
        });
    }

    return {
        targets,
        createTarget,
        addTarget,
        removeTarget,
        disableTarget,
        enableTarget,
        enableAllTargets
    }
})