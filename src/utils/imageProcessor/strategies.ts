import { MapTile } from "@/store/game/map";
import { GameElementType } from "./types";
import { Position } from "./types";

// 策略参数接口
export interface ProcessParams {
  row: MapTile[];
  player: Position;
  cargos: Position[];
  targets: Position[];
  x: number;
  y: number;
  positionsToCheckForGreenBorder: Position[];
}

// 策略接口
export interface ProcessStrategy {
  process(params: ProcessParams): void;
}

// 墙壁策略
export class WallStrategy implements ProcessStrategy {
  process(params: ProcessParams): void {
    params.row.push(MapTile.WALL);
  }
}

// 地板策略
export class FloorStrategy implements ProcessStrategy {
  process(params: ProcessParams): void {
    params.row.push(MapTile.FLOOR);
  }
}

// 玩家策略
export class KeeperStrategy implements ProcessStrategy {
  process(params: ProcessParams): void {
    params.row.push(MapTile.FLOOR);
    params.player.x = params.x;
    params.player.y = params.y;
    // 记录玩家位置，稍后检查是否有绿色边框
    params.positionsToCheckForGreenBorder.push({ x: params.x, y: params.y });
  }
}

// 箱子策略
export class CargoStrategy implements ProcessStrategy {
  process(params: ProcessParams): void {
    params.row.push(MapTile.FLOOR);
    params.cargos.push({ x: params.x, y: params.y });
  }
}

// 目标点策略
export class TargetStrategy implements ProcessStrategy {
  process(params: ProcessParams): void {
    params.row.push(MapTile.FLOOR);
    params.targets.push({ x: params.x, y: params.y });
  }
}

// 箱子在目标点上策略
export class CargoOnTargetStrategy implements ProcessStrategy {
  process(params: ProcessParams): void {
    params.row.push(MapTile.FLOOR);
    // cargoOnTarget同时包含箱子和目标点
    params.cargos.push({ x: params.x, y: params.y });
    params.targets.push({ x: params.x, y: params.y });
  }
}

// 空白策略
export class EmptyStrategy implements ProcessStrategy {
  process(params: ProcessParams): void {
    params.row.push(MapTile.EMPTY);
  }
}

// 策略工厂
export class StrategyFactory {
  private static strategies: Map<GameElementType, ProcessStrategy> = new Map();

  static {
    this.strategies.set(GameElementType.WALL, new WallStrategy());
    this.strategies.set(GameElementType.FLOOR, new FloorStrategy());
    this.strategies.set(GameElementType.KEEPER, new KeeperStrategy());
    this.strategies.set(GameElementType.CARGO, new CargoStrategy());
    this.strategies.set(GameElementType.TARGET, new TargetStrategy());
    this.strategies.set(GameElementType.CARGO_ON_TARGET, new CargoOnTargetStrategy());
  }

  static getStrategy(type: GameElementType): ProcessStrategy | undefined {
    return this.strategies.get(type);
  }

  static getDefaultStrategy(): ProcessStrategy {
    return new EmptyStrategy();
  }
}