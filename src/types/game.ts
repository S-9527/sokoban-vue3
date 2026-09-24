export type Point = [number, number];

export interface GameState {
    puzzle: any;
    path: Point[];
    cost: number;
} 