import { PuzzleSolver } from "@/robot/puzzleSolver.ts";
import { processPuzzle, processAction, unableToMove, setup } from "@/robot/utility/process.ts";
import { Calculator, createCollection } from "@/robot/utility/calculator.ts";

export enum MapTile {
    WALL = 1,
    FLOOR = 2,
    BOX = 3,
    VISITED = 4,
}

export type Map = Array<MapTile>;

export type Point = [number, number];

export type Targets = {
    [key: string]: boolean
}

export interface Action {
    from: Point,
    next: Action | [],
    dir?: [number, number]
}

export interface GameState {
    puzzle: Puzzle
    action: Action;
}

export class Puzzle {
    private readonly _map: Map
    private readonly _width: number
    private readonly _targets: Targets
    private readonly player: Point
    private unsolved: number
    private _action: Action = { from: [0, 0], next: [], dir: [1, 0] };

    constructor(map: Map, width: number, targets: Targets, player: Point) {
        this._map = map;
        this._targets = targets;
        this._width = width;
        this.player = player;
        this.unsolved = Object.values(targets).filter(value => !value).length;
    }

    get width(): number {
        return this._width;
    }

    get map(): Map {
        return this._map;
    }

    get targets(): Targets {
        return this._targets;
    }

    get dir(): Point {
        return this.action.dir || [1, 0];
    }

    get action(): Action {
        return this._action;
    }

    get calculator() {
        return new Calculator(this.width, this.dir);
    }

    generateNextActions(action?: Action) {
        const result: GameState[] = [];
        const map: Map = [...this._map];
        const collection: Set<Action> = createCollection(this.player, action!);

        const directions: Record<string, Point> = {
            Left: [-1, 0],
            Right: [1, 0],
            Up: [0, -1],
            Down: [0, 1]
        };

        for (const action of collection) {
            const position = this.calculatePlayerLocation(action)

            if (map[position] !== MapTile.FLOOR) continue;
            map[position] = MapTile.VISITED;

            Object.values(directions).forEach(item => {
                this.calculateBoxPosition(item);
                this.recordGameState(map, result);
                collection.add(processAction(this));
            })
        }

        return result;
    }

    solve() {
        const actions = PuzzleSolver.setup(this);
        const visited: Set<string> = new Set();

        while (actions.length) {
            const { puzzle, action} = actions.shift()!;

            if (puzzle.unsolved === 0) {
                return { puzzle, action };
            }

            puzzle.generateNextActions(action).forEach(action => {
                const hashCode = action.puzzle.toString()
                if (!visited.has(hashCode)) {
                    visited.add(hashCode);
                    actions.push(action);
                }
            });
        }

        throw new Error("No solution");
    }

    private calculateBoxPosition(dir: Point) {
        this._action.dir = dir;
        const calculator = this.calculator;
        setup(calculator.calculateBoxPosition(this.action.from));
    }

    private calculatePlayerLocation(action: Action) {
        this._action = action;
        const [x,y] = this.action.from;
        return y * this._width + x;
    }

    private recordGameState(map: Map, result: GameState[]) {
        if (unableToMove(map)) return;

        result.push({
            action: processAction(this),
            puzzle: processPuzzle(this)
        });
    }

    toString() {
        let string = this._map.reduce((acc, cell, index) => {
            acc += cell;
            if (index % this._width === this._width - 1) { acc += "\n"; }
            return acc;
        }, "");

        string += `player: ${this.player}\n`;
        return string;
    }
}