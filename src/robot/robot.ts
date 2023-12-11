enum Case {
    WALL = 1,
    FLOOR = 2,
    BOX = 3,
    VISITED = 4,
}

type Map = Array<Case>;

export type Position = [number, number];

type Targets = {
    [key: string]: boolean
}

type SokobanStep = {
    steps: Step | null;
    model: Puzzle
};

export type Step = {
    current: Position,
    last: Step | null
}

export class Puzzle {
    map: Map
    width: number
    player: Position
    targets: Targets
    unsolved: number
    lastStep: Puzzle | null;

    constructor(map: Map, width: number, targets: Targets, player: Position, lastStep?: Puzzle) {
        this.map = map;
        this.targets = targets;
        this.width = width;
        this.player = player;
        this.unsolved = Object.values(targets).filter(value => !value).length;
        this.lastStep = lastStep || null;
    }

    findNextSteps(lastSteps: Step | null = null) {
        const result: SokobanStep[] = [];

        const map: Map = [...this.map];

        const collection: Set<Step> = new Set([{ current: this.player, last: lastSteps }]);

        const isRemovable = (boxPos: number, newBoxPos: number) => {
            return map[boxPos] === Case.BOX && (map[newBoxPos] === Case.FLOOR || map[newBoxPos] === Case.VISITED);
        }

        for (const step of collection) {
            const {current} = step;
            const [x, y] = current;

            const position = y * this.width + x;

            if (map[position] === Case.FLOOR) {
                map[position] = Case.VISITED;

                const check = (dx: number, dy: number) => {
                    const boxPos = (y + dy) * this.width + x + dx;
                    const newBoxPos = (y + dy * 2) * this.width + x + dx * 2;
                    if (isRemovable(boxPos, newBoxPos)) {
                        const newMap = [...this.map];
                        newMap[position] = Case.FLOOR;
                        newMap[boxPos] = Case.FLOOR;
                        newMap[newBoxPos] = Case.BOX;

                        const newTargets = {...this.targets};

                        if (this.targets[boxPos])
                            newTargets[boxPos] = false;

                        if (newBoxPos.toString() in this.targets)
                            newTargets[newBoxPos] = true;

                        const newX = boxPos % this.width;
                        const newY = (boxPos - newX) / this.width;

                        result.push({
                            steps: { current: [x + dx, y + dy], last: step },
                            model: new Puzzle(newMap, this.width, newTargets, [newX, newY], this)
                        });
                    }
                }

                check(1, 0);
                check(-1, 0);
                check(0, 1);
                check(0, -1);

                collection.add({current: [x - 1, y], last: step});
                collection.add({current: [x + 1, y], last: step});
                collection.add({current: [x, y - 1], last: step});
                collection.add({current: [x, y + 1], last: step});
            }
        }

        return result;
    }

    solve(lastSteps: Step | null = null) {
        let collection: SokobanStep[] = [{ steps: lastSteps, model: this }];
        let visited: Set<string> = new Set();

        while (collection.length) {
            const { model, steps} = collection.shift()!;
            const nextSteps = model.findNextSteps(steps);

            if (model.unsolved === 0) {
                return { model, steps };
            }

            for (const step of nextSteps) {
                const hashCode = step.model.toString()
                if (!visited.has(hashCode)) {
                    visited.add(hashCode);
                    collection.push(step);
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