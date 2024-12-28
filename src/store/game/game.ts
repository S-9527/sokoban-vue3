import { defineStore } from "pinia";
import { reactive } from "vue";
import { useCargoStore } from "./cargo.ts";
import { usePlayerStore } from "./player.ts";
import { useMapStore } from "./map.ts";
import { useTargetStore } from "./target.ts";
import { GameData } from "@/data";
import JSConfetti from "js-confetti";
interface Game {
    isGameCompleted: boolean,
    level: number
}

export const useGameStore = defineStore("game",() => {
    const game = reactive<Game>({
        isGameCompleted: false,
        level: 1
    });

    let _gameData: GameData;

    function detectionGameCompleted() {
        const { cargos } = useCargoStore();
        game.isGameCompleted = cargos.every((cargo) => cargo.onTarget);
        if (game.isGameCompleted && globalThis.constructor.name === 'Window') {
            const confetti = new JSConfetti()
            confetti.addConfetti()
        }
    }

    function setupGame(gameData: GameData) {
        _gameData = gameData;
        setupLevel();
    }

    function toNextLevel() {
        game.level += 1;
        game.isGameCompleted = false;
        setupLevel();
    }

    function setupLevel() {
        const levelGameData = _gameData[game.level - 1];

        const { player } = usePlayerStore();
        const { setupMap } = useMapStore();
        const { addCargo, createCargo, modifyCargo, cleanAllCargos } = useCargoStore();
        const { addTarget,createTarget,cleanAllTargets } = useTargetStore();

        player.x = levelGameData.player.x;
        player.y = levelGameData.player.y;

        setupMap(levelGameData.map);

        cleanAllCargos();
        levelGameData.cargos.forEach((cargo) => {
            addCargo(createCargo(cargo));
        })

        levelGameData.cargos.forEach(cargo => {
            levelGameData.targets.forEach((target) => {
                if (cargo.x === target.x && cargo.y === target.y) {
                   modifyCargo(cargo);
                }
            })
        })

        cleanAllTargets();
        levelGameData.targets.forEach((target) => {
            addTarget(createTarget(target));
        })

     }

    return {
        game,
        toNextLevel,
        setupGame,
        detectionGameCompleted
    }
})