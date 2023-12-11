import { defineStore } from "pinia";
import { reactive } from "vue";
import { Position } from "@/composables/usePosition.ts";

export interface Target {
    x: number;
    y: number;
}

export const useTargetStore = defineStore("target", () => {
    const targets = reactive<Target[]>([]);

    function addTarget(target: Target) {
        targets.push(target);
    }

    function createTarget({x, y}: {x: number, y: number}): Target {
        return { x, y }
    }

    function findTarget(position: Position): Target | undefined {
        return targets.find((target) => target.x === position.x && target.y === position.y)
    }

    function cleanAllTargets() {
        targets.splice(0, targets.length);
    }

    return {
        cleanAllTargets,
        addTarget,
        createTarget,
        findTarget,
        targets
    }
});