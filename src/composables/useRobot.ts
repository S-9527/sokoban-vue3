import { usePlayerStore } from "@/store/game/player.ts";
import { defineStore } from "pinia";
import { Action, GameState, MapTile, Puzzle } from "@/robot/robot.ts";
import { Map, useMapStore } from "@/store/game/map.ts";
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

    function parseAction(action: Action){
        const result: Function[] = [];
        const traverse = (from: Action | null, next?: Action | null): void => {
            if (!from) return;
            const coordinate = generateCoordinate(from, next!);

            if (coordinate in direction) {
                result.push(direction[coordinate]);
            }

            return traverse(from.next, from);
        }

        traverse(action);
        return result.reverse();
    }

    function generateCoordinate(from: Action, next: Action | null) {
        const [nextX, nextY] = next?.from || [0, 0];
        const [fromX, fromY] = from.from;
        return `${nextX - fromX},${nextY - fromY}`;
    }

    function transform(map: Map, cargos: Cargo[], targets:Target[]) {
        const width: number = map[0].length;
        const mapper: (number | MapTile)[] = [];
        const isActive: Record<number, boolean> = {};

        for (const row of map) {
            for (const tile of row) {
                mapper.push(tile.valueOf() === MapTile.WALL ? MapTile.WALL : MapTile.FLOOR);
            }
        }

        for (const cargo of cargos) {
            mapper[cargo.x + cargo.y * width] = MapTile.BOX
        }

        for (const target of targets) {
            const index = target.x + target.y * width;
            isActive[index] = mapper[index] === MapTile.BOX;
        }

        return { mapper, isActive };
    }

    function sleep(time: number){
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function setupPuzzle() {
        const { player } = usePlayerStore();
        const { targets } = useTargetStore();
        const { map } = useMapStore();
        const { cargos } = useCargoStore();

        const { mapper, isActive} = transform(map, cargos, targets);
        return Puzzle.of(mapper, isActive, [player.x, player.y]);
    }

    const solve = async () => {
        const puzzle: Puzzle = setupPuzzle();

        console.time("solve");

        const result: GameState | undefined = puzzle.solve();

        console.timeEnd("solve");

        if (!result) return;

        for(const action of parseAction(result.action)) {
            action();
            await sleep(500);
        }
    }

    return { solve }
})