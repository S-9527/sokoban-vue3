import { defineStore } from "pinia";
import { reactive } from "vue";
import { useCargoStore } from "./cargo.ts";
import { usePlayerStore } from "./player.ts";
import { useMapStore } from "./map.ts";
import { useTargetStore } from "./target.ts";
import { GameData } from "@/data";
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
        const { targets } = useTargetStore();
        game.isGameCompleted = cargos.length > 0 &&
            cargos.length === targets.length &&
            cargos.every((cargo) => cargo.onTarget);
    }

    function setupGame(gameData: GameData) {
        _gameData = gameData;
        game.level = 1;
        game.isGameCompleted = false;
        setupLevel();
    }

    function toNextLevel() {
        if (!_gameData || _gameData.length === 0) return;

        // 最后一关之后回到第 1 关，避免越界取关卡数据
        game.level = game.level >= _gameData.length ? 1 : game.level + 1;
        game.isGameCompleted = false;
        setupLevel();
    }

    function setupLevel() {
        if (!_gameData || _gameData.length === 0) return;

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

        // 关卡可能初始即完成；setup 后必须重新同步状态
        detectionGameCompleted();
     }

    return {
        game,
        toNextLevel,
        setupGame,
        detectionGameCompleted
    }
})