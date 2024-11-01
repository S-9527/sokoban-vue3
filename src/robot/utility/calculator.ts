import { Action, Point } from "@/robot/robot.ts";

export class Calculator {
    private readonly width: number;
    private readonly dir: Point;

    constructor(width: number, dir: Point) {
        this.width = width;
        this.dir = dir;
    }

    get dx() {
        return this.dir[0];
    }

    get dy() {
        return this.dir[1];
    }

    calculateBoxPosition(playerLocation: Point) {
        const [x,y] = playerLocation;
        const start = (y + this.dy) * this.width + x + this.dx;
        const end = start + this.dy * this.width + this.dx;
        return [start, end];
    }

    calculateAction(action: Action) {
        const [x,y] = action.from;
        return createAction([x + this.dx, y + this.dy], action);
    }
}

export function createAction(from: Point, next: Action, dir?: Point) {
    return { dir, from, next: next || [] };
}

export function createCollection(player: Point, action: Action) {
    return new Set([createAction(player, action, [1,0])]);
}