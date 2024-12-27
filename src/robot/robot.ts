import { Point, MapTile } from "@/types/game.ts";

export class Puzzle {
    private readonly _map: MapTile[][];
    private readonly _boxes: Point[];
    private readonly _targets: Point[];
    private readonly _player: Point;

    constructor(map: MapTile[][], boxes: Point[], targets: Point[], player: Point) {
        this._map = map;
        this._boxes = boxes;
        this._targets = targets;
        this._player = player;
    }

    get map() { return this._map; }
    get boxes() { return this._boxes; }
    get targets() { return this._targets; }
    get player() { return this._player; }

    isCompleted(): boolean {
        return this._targets.every(target =>
            this._boxes.some(box => box[0] === target[0] && box[1] === target[1])
        );
    }

    // 检查某个位置是否有箱子
    hasBox(pos: Point): boolean {
        return this._boxes.some(box => box[0] === pos[0] && box[1] === pos[1]);
    }

    // 检查某个位置是否可以移动
    canMove(to: Point): boolean {
        const [x, y] = to;
        // 检查边界
        if (y < 0 || y >= this._map.length || x < 0 || x >= this._map[0].length) {
            return false;
        }
        // 检查是否是墙
        return this._map[y][x] !== MapTile.WALL;
    }

    // 检查是否是死角
    isDeadlock(boxPos: Point): boolean {
        const [x, y] = boxPos;

        // 如果箱子已经在目标点上，不算死角
        if (this._targets.some(t => t[0] === x && t[1] === y)) {
            return false;
        }

        // 检查是否被墙卡住
        const leftWall = this._map[y][x-1] === MapTile.WALL;
        const rightWall = this._map[y][x+1] === MapTile.WALL;
        const topWall = this._map[y-1][x] === MapTile.WALL;
        const bottomWall = this._map[y+1][x] === MapTile.WALL;

        // 如果箱子被墙角卡住，且不在目标点上，则是死角
        return (leftWall && topWall) || (leftWall && bottomWall) ||
            (rightWall && topWall) || (rightWall && bottomWall);
    }

    // 创建新的谜题状态
    createNewState(newPlayer: Point, newBoxes: Point[]): Puzzle {
        return new Puzzle(this._map, newBoxes, this._targets, newPlayer);
    }

    // 获取状态的唯一标识
    getStateKey(): string {
        const boxKey = this._boxes
            .map(b => `${b[0]},${b[1]}`)
            .sort()
            .join('|');
        return `${this._player[0]},${this._player[1]}|${boxKey}`;
    }
}