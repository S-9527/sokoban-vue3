import { Puzzle } from "@/robot/robot.ts";
import { Point, GameState } from "@/types/game.ts";

/**
 * 最小二叉堆，用于替代 Array.prototype.sort 实现优先队列。
 *
 * 原来每个循环都用 queue.sort() 对整个队列排序，队列峰值可达 2.7 万，
 * 单关排序耗时占求解总耗时的 96%（第 11 关 8415ms / 8764ms）。
 * 换成二叉堆后，入队和出队都是 O(log n)。
 */
class MinHeap {
    private items: GameState[] = [];

    get size() {
        return this.items.length;
    }

    push(value: GameState) {
        const items = this.items;
        items.push(value);
        let i = items.length - 1;
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (items[i].cost >= items[parent].cost) break;
            const tmp = items[i];
            items[i] = items[parent];
            items[parent] = tmp;
            i = parent;
        }
    }

    pop(): GameState | undefined {
        const items = this.items;
        if (items.length === 0) return undefined;

        const top = items[0];
        const last = items.pop()!;
        if (items.length === 0) return top;

        items[0] = last;
        let i = 0;
        for (;;) {
            const left = 2 * i + 1;
            const right = left + 1;
            let smallest = i;

            if (left < items.length && items[left].cost < items[smallest].cost) smallest = left;
            if (right < items.length && items[right].cost < items[smallest].cost) smallest = right;
            if (smallest === i) break;

            const tmp = items[i];
            items[i] = items[smallest];
            items[smallest] = tmp;
            i = smallest;
        }

        return top;
    }
}

export class PuzzleSolver {
    private static readonly DIRECTIONS: Point[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    static solve(puzzle: Puzzle): Point[] {
        const visited = new Set<string>();
        const queue = new MinHeap();
        queue.push({
            puzzle,
            path: [],
            cost: this.estimateCost(puzzle)
        });

        while (queue.size > 0) {
            const current = queue.pop()!;

            if (current.puzzle.isCompleted()) {
                return current.path;
            }

            const stateKey = current.puzzle.getStateKey();
            if (visited.has(stateKey)) continue;
            visited.add(stateKey);

            // 生成所有可能的移动
            for (const [dx, dy] of this.DIRECTIONS) {
                const newPlayerPos: Point = [
                    current.puzzle.player[0] + dx,
                    current.puzzle.player[1] + dy
                ];

                if (!current.puzzle.canMove(newPlayerPos)) continue;

                let newBoxes: Point[];
                if (current.puzzle.hasBox(newPlayerPos)) {
                    const newBoxPos: Point = [
                        newPlayerPos[0] + dx,
                        newPlayerPos[1] + dy
                    ];

                    if (!current.puzzle.canMove(newBoxPos) ||
                        current.puzzle.hasBox(newBoxPos)) continue;

                    // 检查是否会造成死角
                    if (current.puzzle.isDeadlock(newBoxPos)) continue;

                    newBoxes = current.puzzle.boxes.map((box: Point) =>
                        box[0] === newPlayerPos[0] && box[1] === newPlayerPos[1]
                            ? newBoxPos
                            : box
                    );
                } else {
                    newBoxes = current.puzzle.boxes;
                }

                const newPuzzle = current.puzzle.createNewState(newPlayerPos, newBoxes);
                const newPath = current.path.concat([newPlayerPos]);
                queue.push({
                    puzzle: newPuzzle,
                    path: newPath,
                    cost: newPath.length + this.estimateCost(newPuzzle)
                });
            }
        }

        throw new Error("No solution error`");
    }

    private static estimateCost(puzzle: Puzzle): number {
        let totalCost = 0;
        for (const box of puzzle.boxes) {
            let minDistance = Infinity;
            for (const target of puzzle.targets) {
                const distance = Math.abs(target[0] - box[0]) +
                               Math.abs(target[1] - box[1]);
                minDistance = Math.min(minDistance, distance);
            }
            totalCost += minDistance;
        }

        // 增加玩家到最近箱子的距离作为成本
        const playerToBoxDistance = Math.min(...puzzle.boxes.map(box =>
            Math.abs(box[0] - puzzle.player[0]) +
            Math.abs(box[1] - puzzle.player[1])
        ));

        return totalCost + playerToBoxDistance;
    }
}
