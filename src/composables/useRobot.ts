import { usePlayerStore } from "@/store/game/player.ts";
import { useCargoStore } from "@/store/game/cargo.ts";
import { useTargetStore } from "@/store/game/target.ts";
import { useMapStore } from "@/store/game/map.ts";
import { defineStore } from "pinia";
import { Puzzle } from "@/robot/robot.ts";
import { PuzzleSolver } from "@/robot/puzzleSolver.ts";
import { Point, MapTile } from "@/types/game.ts";
import { useGameStore } from "@/store/game/game.ts";

export const useRobot = defineStore('Robot', () => {
    const playerStore = usePlayerStore();
    const cargoStore = useCargoStore();
    const targetStore = useTargetStore();
    const mapStore = useMapStore();
    const gameStore = useGameStore();

    async function solve() {
        try {
            console.log(`开始求解第 ${gameStore.game.level} 关...`);
            const startTime = performance.now();

            // 转换游戏状态为 Puzzle
            const map = mapStore.map.map(row =>
                row.map(cell => cell === 1 ? MapTile.WALL : MapTile.FLOOR)
            );

            const puzzle = new Puzzle(
                map,
                cargoStore.cargos.map(cargo => [cargo.x, cargo.y] as Point),
                targetStore.targets.map(target => [target.x, target.y] as Point),
                [playerStore.player.x, playerStore.player.y] as Point
            );

            // 获取解决方案
            const solution = PuzzleSolver.solve(puzzle);

            const endTime = performance.now();
            const timeUsed = Math.round(endTime - startTime);
            console.log(`第 ${gameStore.game.level} 关解题完成，用时: ${timeUsed}ms`);

            // 执行移动
            for (const [x, y] of solution) {
                await movePlayer(x, y);
                await sleep(300);
            }
        } catch (error) {
            console.error('Failed to solve puzzle:', error);
        }
    }

    function movePlayer(x: number, y: number) {
        const dx = x - playerStore.player.x;
        const dy = y - playerStore.player.y;

        if (dx > 0) return playerStore.movePlayerToRight();
        if (dx < 0) return playerStore.movePlayerToLeft();
        if (dy > 0) return playerStore.movePlayerToDown();
        if (dy < 0) return playerStore.movePlayerToUp();
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return { solve };
});