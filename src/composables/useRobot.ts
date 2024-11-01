import { usePlayerStore } from "@/store/game/player.ts";
import { defineStore } from "pinia";
import { Action, GameState } from "@/robot/robot.ts";
import { PuzzleSolver } from "@/robot/puzzleSolver.ts";

enum Direction {
    Left = "-1,0",
    Right = "1,0",
    Up = "0,-1",
    Down = "0,1"
}

export const useRobot = defineStore('Robot',()=>{
    const { movePlayerToLeft, movePlayerToRight, movePlayerToUp, movePlayerToDown }  = usePlayerStore();

    const direction: Record<string, () => void> = {
        [Direction.Left]: movePlayerToLeft,
        [Direction.Right]: movePlayerToRight,
        [Direction.Up]: movePlayerToUp,
        [Direction.Down]: movePlayerToDown
    };

    function parseAction(action: Action){
        const solution: Function[] = [];
        const traverse = (action: Action, next: Action | []): void => {
            if (!action.next) return;
            const coordinate = generateCoordinate(action, next);

            if (coordinate in direction) {
                solution.push(direction[coordinate]);
            }

            return traverse(<Action>action.next, action);
        }

        traverse(action, []);
        return solution.reverse();
    }

    function generateCoordinate(action: Action, next: Action | []) {
        if (Array.isArray(action) || Array.isArray(next)) return "";
        const [nextX, nextY] = next.from || [0, 0];
        const [fromX, fromY] = action.from;
        return `${nextX - fromX},${nextY - fromY}`;
    }

    async function execute(action: Action) {
        for (const move of parseAction(action)) {
            move();
            await sleep(500);
        }
    }

    function sleep(time: number){
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function solveWithTime() {
        console.time("solve");
        const result: GameState = PuzzleSolver.execute();
        console.timeEnd("solve");
        return result;
    }

    const solve = async () => {
        const result = solveWithTime();
        await execute(result.action);
    }

    return { solve }
})