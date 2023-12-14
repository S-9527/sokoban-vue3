import { usePlayerStore } from "@/store/game/player.ts";
import { defineStore } from "pinia";
import { MapBlock, Puzzle, SokobanStep, Step } from "@/robot/robot.ts";
import { Map, MapTile, useMapStore } from "@/store/game/map.ts";
import { Cargo, useCargoStore } from "@/store/game/cargo.ts";
import { Target, useTargetStore } from "@/store/game/target.ts";

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

    function DirectionChain(step: Step | null){
        const result: Function[] = [];
        const getDirections = (current: Step | null, last: Step | null): void => {
            if (!current) return;

            const [lastX, lastY] = last?.current || [0, 0];
            const [currentX, currentY] = current.current;
            const coordinate = `${lastX - currentX},${lastY - currentY}`;

            if (coordinate in direction) {
                result.push(direction[coordinate]);
            }

            return getDirections(current.last, current);
        }

        getDirections(step,null)

        return result.reverse();
    }

    function conversion(map: Map, cargos: Cargo[], targets:Target[]) {
        const width: number = map[0].length;
        const mapper: (number | MapTile)[] = [];
        const isActive: Record<number, boolean> = {};

        for (const row of map) {
            for (const tile of row) {
                mapper.push(tile === MapTile.WALL ? MapTile.WALL : MapTile.FLOOR);
            }
        }

        for (const cargo of cargos) {
            mapper[cargo.x + cargo.y * width] = MapBlock.BOX
        }

        for (const target of targets) {
            const index = target.x + target.y * width;
            isActive[index] = mapper[index] === MapBlock.BOX;
        }

        return { mapper, isActive };
    }

    function sleep(time: number){
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const solve = async () => {
        const { cargos} = useCargoStore();
        const { targets} = useTargetStore();
        const { map} = useMapStore();
        const { player} = usePlayerStore();

        const { mapper, isActive} = conversion(map, cargos, targets);

        const puzzle: Puzzle = new Puzzle(mapper, map[0].length, isActive, [player.x, player.y]);

        console.time("solve");

        const result: SokobanStep | undefined = puzzle.solve();

        console.timeEnd("solve");

        if (!result) return;

        for(const operation of DirectionChain(result.steps)) {
            operation();
            await sleep(500);
        }
    }

    return { solve }
})