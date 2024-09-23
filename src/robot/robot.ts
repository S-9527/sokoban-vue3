import { useMapStore } from "@/store/game/map.ts";

export enum MapTile {
    WALL = 1,
    FLOOR = 2,
    BOX = 3,
    VISITED = 4,
}

type Map = Array<MapTile>;

type Position = [number, number];

type Targets = {
    [key: string]: boolean
}

export interface Command {
    from: Position,
    next: Command | null
}

export interface Action {
    instance: Puzzle
    command: Command | null;
}

const directions: Record<string, Position> = {
    Left: [-1, 0],
    Right: [1, 0],
    Up: [0, -1],
    Down: [0, 1]
};

export class Puzzle {
    private readonly map: Map
    private readonly width: number
    private readonly player: Position
    private readonly targets: Targets
    private unsolved: number

    private constructor(map: Map, width: number, targets: Targets, player: Position) {
        this.map = map;
        this.targets = targets;
        this.width = width;
        this.player = player;
        this.unsolved = Object.values(targets).filter(value => !value).length;
    }

    static of(map: Map, targets: Targets, player: Position) {
        const mapStore = useMapStore();
        const width = mapStore.map[0].length;
        return new Puzzle(map, width, targets, player);
    }

    generateNextActions(command: Command) {
        const result: Action[] = [];
        const map: Map = [...this.map];
        const collection: Set<Command> = new Set([createCommand(this.player, command)]);

        for (const command of collection) {
            const [x,y] = command.from;
            const position = y * this.width + x;

            if (map[position] !== MapTile.FLOOR) continue;
            map[position] = MapTile.VISITED;

            for (const [dx, dy] of Object.values(directions)){
                this.prune(map, [dx, dy], command, result);
                collection.add(createCommand([x + dx, y + dy], command));
            }
        }

        return result;
    }


    solve() {
        const actions = createActions(this, null);
        const visited: Set<string> = new Set();

        while (actions.length) {
            const { instance, command} = actions.shift()!;
            const next: Action[] = instance.generateNextActions(command!);

            if (instance.unsolved === 0) {
                return { instance, command };
            }

            for (const action of next) {
                const hashCode = action.instance.toString()
                if (!visited.has(hashCode)) {
                    visited.add(hashCode);
                    actions.push(action);
                }
            }
        }
    }

    private prune(map: Map, directions: Position, command: Command, result: Action[]) {
        const [x,y] = command.from;
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
                command: createCommand([x + dx, y + dy], command),
                instance: Puzzle.of(map, copyTargets, createPlayer(boxPos, this.width))
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

function createActions(instance: Puzzle, command: Command | null): Action[] {
    return [{ instance, command }];
}

function createCommand(from: Position, next: Command) {
    return { from, next };
}

function createPlayer(boxPos: number, width: number): Position {
    const x = boxPos % width;
    const y = (boxPos - x) / width;
    return [x, y];
}