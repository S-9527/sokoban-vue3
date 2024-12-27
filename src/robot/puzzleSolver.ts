import { Puzzle } from "@/robot/robot.ts";
import { Point, GameState } from "@/types/game.ts";

export class PuzzleSolver {
    private static readonly DIRECTIONS: Point[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    static solve(puzzle: Puzzle): Point[] {
        const visited = new Set<string>();
        const queue: GameState[] = [{
            puzzle,
            path: [],
            cost: this.estimateCost(puzzle)
        }];

        while (queue.length > 0) {
            const current = queue.shift()!;

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

                if (current.puzzle.hasBox(newPlayerPos)) {
                    const newBoxPos: Point = [
                        newPlayerPos[0] + dx,
                        newPlayerPos[1] + dy
                    ];

                    if (!current.puzzle.canMove(newBoxPos) ||
                        current.puzzle.hasBox(newBoxPos)) continue;

                    // 检查是否会造成死角
                    if (current.puzzle.isDeadlock(newBoxPos)) continue;

                    const newBoxes = current.puzzle.boxes.map((box: [number, number]) =>
                        box[0] === newPlayerPos[0] && box[1] === newPlayerPos[1]
                            ? newBoxPos
                            : box
                    );

                    const newPuzzle = current.puzzle.createNewState(newPlayerPos, newBoxes);
                    const newState: GameState = {
                        puzzle: newPuzzle,
                        path: [...current.path, newPlayerPos],
                        cost: current.path.length + this.estimateCost(newPuzzle)
                    };
                    queue.push(newState);
                } else {
                    const newPuzzle = current.puzzle.createNewState(
                        newPlayerPos,
                        current.puzzle.boxes
                    );
                    const newState: GameState = {
                        puzzle: newPuzzle,
                        path: [...current.path, newPlayerPos],
                        cost: current.path.length + this.estimateCost(newPuzzle)
                    };
                    queue.push(newState);
                }
            }

            // 按照估计成本排序
            queue.sort((a, b) => a.cost - b.cost);
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

