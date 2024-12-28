import { describe, it, expect } from 'vitest';
import { Puzzle } from '../robot';
import { PuzzleSolver } from '../puzzleSolver';
import { MapTile, Point } from '@/types/game';

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

    it('should generate correct state key', () => {
        const puzzle = createTestPuzzle();
        expect(puzzle.getStateKey()).toBe('1,1|1,1');
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