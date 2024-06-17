export enum MapBlock {
    WALL = 1,
    FLOOR = 2,
    BOX = 3,
    VISITED = 4,
}

type Map = Array<MapBlock>;

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
    map: Map
    width: number
    player: Position
    targets: Targets
    unsolved: number
    instance: Puzzle | null;

    constructor(map: Map, width: number, targets: Targets, player: Position, instance?: Puzzle) {
        this.map = map;
        this.targets = targets;
        this.width = width;
        this.player = player;
        this.unsolved = Object.values(targets).filter(value => !value).length;
        this.instance = instance || null;
    }

    findNextSteps(command: Command | null = null) {
        const result: Action[] = [];

        const map: Map = [...this.map];

        const collection: Set<Command> = new Set([createCommand(this.player, command!)]);

        for (const command of collection) {
            const [x,y] = command.from;
            const position = y * this.width + x;

            if (map[position] === MapBlock.FLOOR) {
                map[position] = MapBlock.VISITED;

                const check = (dx: number, dy: number) => {
                    const boxPos = (y + dy) * this.width + x + dx;
                    const newBoxPos = (y + dy * 2) * this.width + x + dx * 2;
                    if (canRemovable(map, boxPos, newBoxPos)) {
                        const newMap = [...this.map];
                        newMap[position] = MapBlock.FLOOR;
                        newMap[boxPos] = MapBlock.FLOOR;
                        newMap[newBoxPos] = MapBlock.BOX;

                        const newTargets = {...this.targets};

                        if (this.targets[boxPos])
                            newTargets[boxPos] = false;

                        if (newBoxPos.toString() in this.targets)
                            newTargets[newBoxPos] = true;

                        const newX = boxPos % this.width;
                        const newY = (boxPos - newX) / this.width;

                        result.push({
                            command: { from: [x + dx, y + dy], next: command },
                            instance: new Puzzle(newMap, this.width, newTargets, [newX, newY], this)
                        });
                    }
                }

                for (const [dx,dy] of Object.values(directions)){
                    check(dx,dy);
                    collection.add({from: [x + dx, y + dy], next: command});
                }
            }
        }

        return result;
    }


    solve(command: Command | null = null) {
        const actions = createActions(this, command);
        const visited: Set<string> = new Set();

        while (actions.length) {
            const { instance, command} = actions.shift()!;
            const next: Action[] = instance.findNextSteps(command);

            if (instance.unsolved === 0) {
                return { instance, command };
            }

            for (const command of next) {
                const hashCode = command.instance.toString()
                if (!visited.has(hashCode)) {
                    visited.add(hashCode);
                    actions.push(command);
                }
            }
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
    return map[boxPos] === MapBlock.BOX && (map[newBoxPos] === MapBlock.FLOOR || map[newBoxPos] === MapBlock.VISITED);
}

function createActions(instance: Puzzle, command: Command | null): Action[] {
    const collection: Action[] = [];
    const action: Action = { instance, command }
    collection.push(action);

    return collection;
}

function createCommand(from: Position, next: Command) {
    return { from, next };
}