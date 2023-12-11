import { usePlayerStore } from "@/store/game/player.ts";
import { defineStore } from "pinia";
import { Puzzle, Step } from "@/robot/robot.ts";
import { Map, MapTile, useMapStore } from "@/store/game/map.ts";
import { Cargo, useCargoStore } from "@/store/game/cargo.ts";
import { Target, useTargetStore } from "@/store/game/target.ts";

enum Direction {
    Left = "-1,0",
    Right = "1,0",
    Up = "0,-1",
    Down = "0,1"
}

const CARGO: number = 3;

export const useRobot = defineStore('Robot',()=>{
    const { movePlayerToLeft, movePlayerToRight, movePlayerToUp, movePlayerToDown }  = usePlayerStore();

    const direction: Record<string, () => void> = {
        [Direction.Left]: movePlayerToLeft,
        [Direction.Right]: movePlayerToRight,
        [Direction.Up]: movePlayerToUp,
        [Direction.Down]: movePlayerToDown
    };

    function extractDirectionsFromSteps(step: Step | null){

        const result: Function[] = [];

        const getDirections = (currentStep: Step | null, lastStep: Step | null) => {
            if (!currentStep) return;

            const [lastX, lastY] = lastStep?.current || [0, 0];
            const [currentX, currentY] = currentStep.current;
            const computed = `${lastX - currentX},${lastY - currentY}`;

            if (computed in direction) {
                result.push(direction[computed]);
            }

            getDirections(currentStep.last, currentStep);
        }

        getDirections(step,null)
        return result.reverse();
    }

    function conversion(map: Map, cargos: Cargo[], targets:Target[]) {
        const width = map.length;
        const space = [];
        const occupied: Record<number, boolean> = {};

        for (let row of map) {
            for (let tile of row) {
                space.push(tile === MapTile.WALL ? MapTile.WALL : MapTile.FLOOR);
            }
        }

        for (let cargo of cargos) {
            space[cargo.x + cargo.y * width] = CARGO;
        }

        for (let target of targets) {
            const index = target.x + target.y * width;
            occupied[index] = space[index] === CARGO;
        }

        return { space, occupied };
    }

    function sleep(time: number){
        return new Promise(resolve => setTimeout(resolve, time));
    }


    const solve = async () => {
        const { cargos } = useCargoStore();
        const { targets } = useTargetStore();
        const { map } = useMapStore();
        const { player } = usePlayerStore();

        const { space, occupied} = conversion(map, cargos, targets);

        const puzzle = new Puzzle(space, map.length, occupied, [player.x, player.y]);

        const result = puzzle.solve();

        if (!result) return;

        for(const operation of extractDirectionsFromSteps(result.steps)) {
            operation();
            await sleep(500);
        }
    }

    return { direction, solve }
})