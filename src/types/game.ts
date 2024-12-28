export type Point = [number, number];

export enum MapTile {
    EMPTY = 0,
    WALL = 1,
    FLOOR = 2,
    BOX = 3,
    TARGET = 4
}

export interface GameState {
    puzzle: any;
    path: Point[];
    cost: number;
} 