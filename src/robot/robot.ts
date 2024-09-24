import { useMapStore } from "@/store/game/map.ts";

export enum MapTile {
    WALL = 1,
    FLOOR = 2,
    BOX = 3,
    VISITED = 4,
}

type Map = Array<MapTile>;

export type Point = [number, number];

type Targets = {
    [key: string]: boolean
}

export interface Action {
    from: Point,
    next: Action | null
}

export interface GameState {
    puzzle: Puzzle
    action: Action;
}

const directions: Record<string, Point> = {
    Left: [-1, 0],
    Right: [1, 0],
    Up: [0, -1],
    Down: [0, 1]
};

export class Puzzle {
    private readonly map: Map
    private readonly width: number
    private readonly player: Point
    private readonly targets: Targets
    private unsolved: number

    private constructor(map: Map, width: number, targets: Targets, player: Point) {
        this.map = map;
        this.targets = targets;
        this.width = width;
        this.player = player;
        this.unsolved = Object.values(targets).filter(value => !value).length;
    }

    static of(map: Map, targets: Targets, player: Point) {
        const mapStore = useMapStore();
        const width = mapStore.map[0].length;
        return new Puzzle(map, width, targets, player);
    }

    generateNextActions(action: Action) {
        const result: GameState[] = [];
        const map: Map = [...this.map];
        const collection: Set<Action> = new Set([createAction(this.player, action)]);

        for (const action of collection) {
            const [x,y] = action.from;
            const position = y * this.width + x;

            if (map[position] !== MapTile.FLOOR) continue;
            map[position] = MapTile.VISITED;

            for (const [dx, dy] of Object.values(directions)){
                this.prune(map, [dx, dy], action, result);
                collection.add(createAction([x + dx, y + dy], action));
            }
        }

        return result;
    }


    solve() {
        const actions = initializeGameState(this, {
            from: this.player,
            next: null
        });
        const visited: Set<string> = new Set();

        while (actions.length) {
            const { puzzle, action} = actions.shift()!;
            const next: GameState[] = puzzle.generateNextActions(action);

            if (puzzle.unsolved === 0) {
                return { puzzle, action };
            }

            for (const action of next) {
                const hashCode = action.puzzle.toString()
                if (!visited.has(hashCode)) {
                    visited.add(hashCode);
                    actions.push(action);
                }
            }
        }
    }

    private prune(map: Map, directions: Point, action: Action, result: GameState[]) {
        const [x,y] = action.from;
        const [dx,dy] = directions;
        const boxPos = (y + dy) * this.width + x + dx;
        const newBoxPos = boxPos + dy * this.width + dx;

        if (canRemovable(map, boxPos, newBoxPos)) {
            map = [...this.map];
            map[boxPos] = MapTile.FLOOR;
            map[newBoxPos] = MapTile.BOX;

            const copyTargets = { ...this.targets };

            if (this.targets[boxPos])
                copyTargets[boxPos] = false;

            if (newBoxPos.toString() in this.targets)
                copyTargets[newBoxPos] = true;

            result.push({
                action: createAction([x + dx, y + dy], action),
                puzzle: Puzzle.of(map, copyTargets, createPlayer(boxPos, this.width))
            });
        }
    }

    toString() {
        let string = this.map.reduce((acc, cell, index) => {
            acc += cell;
            if (index % this.width === this.width - 1) { acc += "\n"; }
            return acc;
        }, "");

        string += `player: ${this.player}\n`;
        return string;
    }
}

const canRemovable = (map: Map, boxPos: number, newBoxPos: number) => {
    return map[boxPos] === MapTile.BOX && (map[newBoxPos] === MapTile.FLOOR || map[newBoxPos] === MapTile.VISITED);
}

function initializeGameState(puzzle: Puzzle, action: Action): GameState[] {
    return [{ puzzle, action }];
}

function createAction(from: Point, next: Action) {
    return { from, next };
}

function createPlayer(boxPos: number, width: number): Point {
    const x = boxPos % width;
    const y = (boxPos - x) / width;
    return [x, y];
}