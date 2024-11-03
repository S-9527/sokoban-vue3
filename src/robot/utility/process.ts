import { MapTile, Point, Puzzle } from "@/robot/robot.ts";

let [current, next] = [0, 0];

export function setup(location: number[]) {
    [current, next] = location;
}

export function processMap(puzzle: Puzzle) {
    const map = [...puzzle.map];

    map[current] = MapTile.FLOOR;
    map[next] = MapTile.BOX;

    return map;
}

export function processTarget(puzzle: Puzzle) {
    const targets = { ...puzzle.targets };

    if (puzzle.targets[current]) {
        targets[current] = false;
    }

    if (next.toString() in puzzle.targets) {
        targets[next] = true
    }

    return targets;
}

export function calculatePlayerLocation(puzzle: Puzzle): Point {
    const x = current % puzzle.width;
    const y = Math.floor(current / puzzle.width);
    return [x, y];
}

export function generatePuzzle(puzzle: Puzzle) {
    return new Puzzle(
        processMap(puzzle),
        puzzle.width,
        processTarget(puzzle),
        calculatePlayerLocation(puzzle)
    );
}

export function generateAction(puzzle: Puzzle) {
    return puzzle.calculator.calculateAction(puzzle.action);
}

export const unableToMove = (map: MapTile[]) => {
    return !(map[current] === MapTile.BOX && (map[next] === MapTile.FLOOR || map[next] === MapTile.VISITED));
}