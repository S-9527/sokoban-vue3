import { usePlayerStore } from "@/store/game/player.ts";
import { defineStore } from "pinia";
import { Action, Command, MapTile, Puzzle } from "@/robot/robot.ts";
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

    function commandToActions(command: Command | null){
        const result: Function[] = [];
        const traverse = (from: Command | null, next: Command | null): void => {
            if (!from) return;

            const [nextX, nextY] = next?.from || [0, 0];
            const [fromX, fromY] = from.from;
            const coordinate = `${nextX - fromX},${nextY - fromY}`;

            if (coordinate in direction) {
                result.push(direction[coordinate]);
            }

            return traverse(from.next, from);
        }

        traverse(command,null)

        return result.reverse();
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

    const solve = async () => {
        const { cargos} = useCargoStore();
        const { targets} = useTargetStore();
        const { map} = useMapStore();
        const { player} = usePlayerStore();

        const { mapper, isActive} = transform(map, cargos, targets);

        const puzzle: Puzzle = Puzzle.of(mapper, isActive, [player.x, player.y]);

        console.time("solve");

        const result: Action | undefined = puzzle.solve();

        console.timeEnd("solve");

        if (!result) return;

        for(const action of commandToActions(result.command)) {
            action();
            await sleep(500);
        }
    }

    return { solve }
})