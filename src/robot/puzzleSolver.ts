import { Puzzle } from "@/robot/robot.ts";
import { Point } from "@/types/game.ts";

interface SearchState {
    boxes: Point[];
    player: Point;
    path: Point[];
}

interface Reachability {
    cells: Set<string>;
    prev: Map<string, string>;
}

export class PuzzleSolver {
    private static readonly DIRECTIONS: Point[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 按"推动"为粒度搜索：状态 = 箱子布局 + 玩家可达区域（规范化），
    // 玩家在同一区域内的具体位置不影响后续局面，因此合并为一个状态。
    // 返回值是玩家每一步所在的格子，可直接逐步驱动玩家移动。
    static solve(puzzle: Puzzle): Point[] {
        if (puzzle.isCompleted()) return [];

        const start: SearchState = {
            boxes: puzzle.boxes.map(box => [...box] as Point),
            player: [...puzzle.player] as Point,
            path: []
        };

        const visited = new Set<string>();
        const queue: SearchState[] = [start];

        while (queue.length > 0) {
            const current = queue.shift()!;

            const reach = this.reachable(puzzle, current.boxes, current.player);
            const stateKey = this.stateKey(current.boxes, reach);
            if (visited.has(stateKey)) continue;
            visited.add(stateKey);

            for (const box of current.boxes) {
                for (const [dx, dy] of this.DIRECTIONS) {
                    const from: Point = [box[0] - dx, box[1] - dy];
                    const to: Point = [box[0] + dx, box[1] + dy];

                    // 玩家必须能走到箱子的后方才能推
                    if (!reach.cells.has(this.cellKey(from))) continue;
                    if (!puzzle.canMove(to) || this.hasBox(current.boxes, to)) continue;

                    // 推进死角的状态直接剪枝
                    if (puzzle.isDeadlock(to)) continue;

                    const newBoxes = current.boxes.map(b =>
                        b[0] === box[0] && b[1] === box[1] ? to : b
                    );
                    const newPlayer: Point = [box[0], box[1]];
                    const newPath: Point[] = [
                        ...current.path,
                        ...this.walkPath(reach, from),
                        newPlayer
                    ];

                    if (this.isCompleted(puzzle, newBoxes)) {
                        return newPath;
                    }

                    queue.push({ boxes: newBoxes, player: newPlayer, path: newPath });
                }
            }
        }

        throw new Error("No solution error");
    }

    // 计算玩家在给定箱子布局下的可达区域，prev 用于回溯行走路径
    private static reachable(puzzle: Puzzle, boxes: Point[], player: Point): Reachability {
        const cells = new Set<string>([this.cellKey(player)]);
        const prev = new Map<string, string>();
        const queue: Point[] = [[...player] as Point];

        while (queue.length > 0) {
            const [x, y] = queue.shift()!;
            for (const [dx, dy] of this.DIRECTIONS) {
                const next: Point = [x + dx, y + dy];
                const nextKey = this.cellKey(next);
                if (cells.has(nextKey)) continue;
                if (!puzzle.canMove(next) || this.hasBox(boxes, next)) continue;

                cells.add(nextKey);
                prev.set(nextKey, this.cellKey([x, y]));
                queue.push(next);
            }
        }

        return { cells, prev };
    }

    // 状态的唯一标识：箱子布局 + 玩家可达区域的最小格子（规范化玩家位置）
    private static stateKey(boxes: Point[], reach: Reachability): string {
        let min: string | null = null;
        for (const key of reach.cells) {
            if (min === null || key < min) min = key;
        }
        const boxKey = boxes.map(b => `${b[0]},${b[1]}`).sort().join('|');
        return `${min}|${boxKey}`;
    }

    // 回溯从玩家起点到 target 的行走路径（不含起点，含终点）
    private static walkPath(reach: Reachability, target: Point): Point[] {
        const path: Point[] = [];
        let key = this.cellKey(target);
        while (reach.prev.has(key)) {
            const [x, y] = key.split(',').map(Number);
            path.push([x, y]);
            key = reach.prev.get(key)!;
        }
        return path.reverse();
    }

    private static hasBox(boxes: Point[], pos: Point): boolean {
        return boxes.some(box => box[0] === pos[0] && box[1] === pos[1]);
    }

    private static isCompleted(puzzle: Puzzle, boxes: Point[]): boolean {
        return puzzle.targets.every(target =>
            boxes.some(box => box[0] === target[0] && box[1] === target[1])
        );
    }

    private static cellKey(pos: Point): string {
        return `${pos[0]},${pos[1]}`;
    }
}
