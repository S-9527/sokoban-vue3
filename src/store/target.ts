import { defineStore } from "pinia";
import { reactive } from "vue";
import {Position} from "../composables/usePosition.ts";

interface Target {
    x: number;
    y: number;
}

export const useTargetStore = defineStore("target", () => {
    const targets = reactive<Target[]>([
        { x: 4, y: 3 },
        { x: 5, y: 3 }
    ]);

    function addTarget(target: Target) {
        targets.push(target);
    }

    function createTarget({x, y}: {x: number, y: number}): Target {
        return { x, y }
    }

    function findTarget(position: Position): Target | undefined {
        return targets.find(target => target.x === position.x && target.y === position.y)
    }

    return {
        addTarget,
        createTarget,
        findTarget,
        targets
    }
});