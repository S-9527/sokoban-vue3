import { describe, it, expect } from 'vitest';
import { Puzzle } from '../robot';
import { PuzzleSolver } from '../puzzleSolver';
import { MapTile } from '@/types/game';

describe('Puzzle', () => {
    // 创建一个简单的测试地图
    const createTestMap = () => {
        const map = [
            [MapTile.WALL, MapTile.WALL,  MapTile.WALL,  MapTile.WALL],
            [MapTile.WALL, MapTile.FLOOR, MapTile.FLOOR, MapTile.WALL],
            [MapTile.WALL, MapTile.FLOOR, MapTile.FLOOR, MapTile.WALL],
            [MapTile.WALL, MapTile.WALL,  MapTile.WALL,  MapTile.WALL],
        ];
        const boxes = [[1, 1]];
        const targets = [[2, 2]];
        const player = [2, 1];
        return new Puzzle(map, boxes, targets, player);
    };

    it('should correctly check if puzzle is completed', () => {
        const puzzle = createTestMap();
        expect(puzzle.isCompleted()).toBe(false);

        const completedPuzzle = new Puzzle(
            puzzle.map,
            [[2, 2]], // box on target
            [[2, 2]],
            [2, 1]
        );
        expect(completedPuzzle.isCompleted()).toBe(true);
    });

    it('should correctly detect box positions', () => {
        const puzzle = createTestMap();
        expect(puzzle.hasBox([1, 1])).toBe(true);
        expect(puzzle.hasBox([2, 2])).toBe(false);
    });

    it('should validate move positions', () => {
        const puzzle = createTestMap();
        expect(puzzle.canMove([1, 1])).toBe(true);
        expect(puzzle.canMove([0, 0])).toBe(false); // wall
        expect(puzzle.canMove([4, 4])).toBe(false); // out of bounds
    });

    it('should detect deadlock positions', () => {
        const puzzle = createTestMap();
        expect(puzzle.isDeadlock([1, 1])).toBe(true); // corner
        expect(puzzle.isDeadlock([2, 2])).toBe(false); // target position
    });

    it('should generate correct state key', () => {
        const puzzle = createTestMap();
        const stateKey = puzzle.getStateKey();
        expect(stateKey).toBe('2,1|1,1');
    });
});

describe('PuzzleSolver', () => {
    it('should solve a simple puzzle', () => {
        const map = [
            [MapTile.WALL,  MapTile.WALL,  MapTile.WALL,  MapTile.WALL],
            [MapTile.WALL,  MapTile.FLOOR, MapTile.FLOOR, MapTile.WALL],
            [MapTile.WALL,  MapTile.FLOOR, MapTile.FLOOR, MapTile.WALL],
            [MapTile.WALL,  MapTile.WALL,  MapTile.WALL,  MapTile.WALL],
        ];
        const puzzle = new Puzzle(
            map,
            [[1, 1]], // box
            [[2, 2]], // target
            [2, 1]    // player
        );

        const solution = PuzzleSolver.solve(puzzle);
        expect(solution).toBeTruthy();
        expect(solution.length).toBeGreaterThan(0);
    });

    it('should throw error for unsolvable puzzle', () => {
        const map = [
            [MapTile.WALL,  MapTile.WALL,  MapTile.WALL],
            [MapTile.WALL,  MapTile.FLOOR, MapTile.WALL],
            [MapTile.WALL,  MapTile.WALL,  MapTile.WALL],
        ];
        const puzzle = new Puzzle(
            map,
            [[1, 1]], // box
            [[2, 1]], // unreachable target
            [1, 1]    // player
        );

        expect(() => PuzzleSolver.solve(puzzle)).toThrow('No solution error');
    });
});