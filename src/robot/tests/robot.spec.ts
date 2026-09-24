import { describe, it, expect } from 'vitest';
import { Puzzle } from '../robot';
import { PuzzleSolver } from '../puzzleSolver';
import { Point } from '@/types/game';
import { MapTile } from '@/store/game/map';
import { gameData } from '@/data';

describe('Puzzle', () => {
    const createTestPuzzle = () => {
        const map = [
            [MapTile.WALL, MapTile.WALL, MapTile.WALL],
            [MapTile.WALL, MapTile.FLOOR, MapTile.WALL],
            [MapTile.WALL, MapTile.WALL, MapTile.WALL],
        ];
        const boxes: Point[] = [[1, 1]];     // 中心位置
        const targets: Point[] = [[1, 1]];   // 同一位置
        const player: Point = [1, 1];        // 同一位置
        return new Puzzle(map, boxes, targets, player);
    };

    it('should correctly check if puzzle is completed', () => {
        const puzzle = createTestPuzzle();
        expect(puzzle.isCompleted()).toBe(true);
    });

    it('should correctly detect box positions', () => {
        const puzzle = createTestPuzzle();
        expect(puzzle.hasBox([1, 1])).toBe(true);
        expect(puzzle.hasBox([0, 0])).toBe(false);
    });

    it('should validate move positions', () => {
        const puzzle = createTestPuzzle();
        expect(puzzle.canMove([1, 1])).toBe(true);
        expect(puzzle.canMove([0, 0])).toBe(false);
    });

    it('should not throw when checking deadlock on a map without border walls', () => {
        const map = [
            [MapTile.FLOOR, MapTile.FLOOR, MapTile.FLOOR],
            [MapTile.FLOOR, MapTile.WALL, MapTile.FLOOR],
            [MapTile.FLOOR, MapTile.FLOOR, MapTile.FLOOR],
        ];
        const puzzle = new Puzzle(map, [[1, 0]], [[2, 2]], [0, 0]);

        expect(() => puzzle.isDeadlock([1, 0])).not.toThrow();
        expect(puzzle.isDeadlock([1, 0])).toBe(false);
    });

    it('should treat out-of-bounds neighbors as walls when checking deadlock', () => {
        const map = [
            [MapTile.FLOOR, MapTile.FLOOR],
            [MapTile.FLOOR, MapTile.WALL],
        ];
        const puzzle = new Puzzle(map, [[0, 0]], [[1, 1]], [1, 0]);

        // 箱子在 [0,0]，外侧越界按墙处理，靠墙角落属于死角
        expect(puzzle.isDeadlock([0, 0])).toBe(true);
    });
});

describe('PuzzleSolver', () => {
    it('should solve a simple puzzle', () => {
        const map = [
            [1,1,1,1,1],
            [1,2,2,2,1],
            [1,2,2,2,1],
            [1,2,2,2,1],
            [1,1,1,1,1]
        ]

        const puzzle = new Puzzle(
            map,
            [[2, 2]],
            [[2,3]],
            [2,1]
        );

        const solution = PuzzleSolver.solve(puzzle);
        expect(solution).toBeTruthy();
        expect(solution.length).toBeGreaterThan(0);
    });

    it('should throw error for unsolvable puzzle', () => {
        const map = [
            [MapTile.WALL, MapTile.WALL, MapTile.WALL],
            [MapTile.WALL, MapTile.FLOOR, MapTile.WALL],
            [MapTile.WALL, MapTile.WALL, MapTile.WALL],
        ];
        const puzzle = new Puzzle(
            map,
            [[1, 1]],   // box in middle
            [[0, 1]],   // target in wall (unsolvable)
            [1, 1]      // player at same position as box
        );

        expect(() => PuzzleSolver.solve(puzzle)).toThrow('No solution error');
    });
});

describe('PuzzleSolver on built-in levels', () => {
    it('should produce a valid completing solution for every built-in level', () => {
        gameData.forEach((level, index) => {
            const map = level.map.map(row =>
                row.map(cell => cell === MapTile.FLOOR ? MapTile.FLOOR : MapTile.WALL)
            );
            const boxes = level.cargos.map(c => [c.x, c.y] as Point);
            const targets = level.targets.map(t => [t.x, t.y] as Point);
            const player: Point = [level.player.x, level.player.y];

            const solution = PuzzleSolver.solve(new Puzzle(map, boxes, targets, player));

            const valid = simulateSolution(map, boxes, targets, player, solution);
            expect(valid, `level ${index + 1} solution should complete the puzzle`).toBe(true);
        });
    });

    // 按游戏规则逐步回放解，验证每一步合法且最终覆盖所有目标点
    function simulateSolution(
        map: MapTile[][],
        boxes: Point[],
        targets: Point[],
        player: Point,
        path: Point[]
    ): boolean {
        const state = boxes.map(box => [...box] as Point);
        let cur: Point = [...player] as Point;

        const isWallAt = (x: number, y: number) =>
            y < 0 || y >= map.length || x < 0 || x >= map[0].length || map[y][x] === MapTile.WALL;
        const boxAt = (x: number, y: number) => state.find(box => box[0] === x && box[1] === y);

        for (const [nx, ny] of path) {
            const dx = nx - cur[0];
            const dy = ny - cur[1];
            if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
            if (isWallAt(nx, ny)) return false;

            const box = boxAt(nx, ny);
            if (box) {
                const bx = nx + dx;
                const by = ny + dy;
                if (isWallAt(bx, by) || boxAt(bx, by)) return false;
                box[0] = bx;
                box[1] = by;
            }
            cur = [nx, ny];
        }

        return targets.every(target =>
            state.some(box => box[0] === target[0] && box[1] === target[1])
        );
    }
});