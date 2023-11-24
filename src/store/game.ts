import { defineStore } from "pinia";
import { reactive } from "vue";
import { useCargoStore } from "./cargo.ts";
import { usePlayerStore } from "./player.ts";
import { useMapStore } from "./map.ts";
import { useTargetStore } from "./target.ts";
import { LevelGameData } from "../data";
interface Game {
    isGameCompleted: boolean
}

export const useGameStore = defineStore("game",() => {
    const game = reactive<Game>({
        isGameCompleted: false
    });

    function detectionGameCompleted() {
        const { cargos } = useCargoStore();
        game.isGameCompleted = cargos.every((cargo) => cargo.onTarget);
    }

    function setupGame(levelGameData: LevelGameData) {
        const { player } = usePlayerStore();
        const { setupMap } = useMapStore();
        const { addCargo, createCargo } = useCargoStore();
        const { addTarget,createTarget } = useTargetStore();

        player.x = levelGameData.player.x;
        player.y = levelGameData.player.y;

        setupMap(levelGameData.map);

        levelGameData.cargos.forEach((cargo) => {
            addCargo(createCargo(cargo));
        })

        levelGameData.targets.forEach((target) => {
            addTarget(createTarget(target));
        })

     }

    return {
        game,
        setupGame,
        detectionGameCompleted
    }
})