import { Map, useMapStore } from "@/store/game/map.ts";
import { Cargo, useCargoStore } from "@/store/game/cargo.ts";
import { Target, useTargetStore } from "@/store/game/target.ts";
import { GameState, MapTile, Puzzle } from "@/robot/robot.ts";
import { usePlayerStore } from "@/store/game/player.ts";

export class PuzzleSolver {
    static setup(puzzle: Puzzle): GameState[] {
        return [{ puzzle, action: puzzle.action }];
    }

    static execute() {
        const { player } = usePlayerStore();
        const { targets } = useTargetStore();
        const { map } = useMapStore();
        const { cargos } = useCargoStore();

        const { mapper, isOnTarget} = this.transform(map, cargos, targets);
        const puzzle = new Puzzle(mapper,map[0].length, isOnTarget, [player.x, player.y]);
        return puzzle.solve();
    }

    private static transform(map: Map, cargos: Cargo[], targets:Target[]) {
        const width: number = map[0].length;
        const mapper: MapTile[] = [];
        const isOnTarget: Record<number, boolean> = {};

        map.flatMap(row => row).forEach(tile => {
            mapper.push(tile.valueOf() === MapTile.WALL ? MapTile.WALL : MapTile.FLOOR);
        });

        cargos.forEach(cargo => {
            mapper[cargo.x + cargo.y * width] = MapTile.BOX
        });

        targets.forEach(target => {
            const index = target.x + target.y * width;
            isOnTarget[index] = mapper[index] === MapTile.BOX;
        });

        return { mapper, isOnTarget };
    }
}

