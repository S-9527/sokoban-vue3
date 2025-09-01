import { MapTile } from "@/store/game/map";
import { Position } from "./types";
import { ImageProcessorConfig } from "./config";
import { isPositionInArray } from "./imageUtils";

// 定义绘制参数接口
export interface DrawBackgroundParams {
  ctx: CanvasRenderingContext2D;
  map: MapTile[][];
  wallElement: HTMLImageElement | null;
  floorElement: HTMLImageElement | null;
  emptyElement: HTMLImageElement | null;
}

export interface DrawGameElementsParams {
  ctx: CanvasRenderingContext2D;
  player: Position;
  cargos: Position[];
  targets: Position[];
  keeperElement: HTMLImageElement | null;
  cargoElement: HTMLImageElement | null;
  targetElement: HTMLImageElement | null;
  cargoOnTargetElement: HTMLImageElement | null;
}

export interface DrawTargetsParams {
  ctx: CanvasRenderingContext2D;
  targets: Position[];
  cargos: Position[];
  targetElement: HTMLImageElement | null;
}

export interface DrawCargosParams {
  ctx: CanvasRenderingContext2D;
  cargos: Position[];
  targets: Position[];
  cargoElement: HTMLImageElement | null;
  cargoOnTargetElement: HTMLImageElement | null;
}

export interface DrawPlayerParams {
  ctx: CanvasRenderingContext2D;
  player: Position;
  targets: Position[];
  keeperElement: HTMLImageElement | null;
}

/**
 * 绘制地图背景
 */
export function drawMapBackground(params: DrawBackgroundParams): void {
  const { ctx, map, wallElement, floorElement, emptyElement } = params;
  
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];
      const posX = x * ImageProcessorConfig.CELL_SIZE;
      const posY = y * ImageProcessorConfig.CELL_SIZE;

      switch (tile) {
        case MapTile.WALL:
          wallElement && ctx.drawImage(wallElement, posX, posY, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
          break;
        case MapTile.FLOOR:
          floorElement && ctx.drawImage(floorElement, posX, posY, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
          break;
        case MapTile.EMPTY:
          emptyElement && ctx.drawImage(emptyElement, posX, posY, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
          break;
        default:
          ctx.fillStyle = 'red';
          ctx.fillRect(posX, posY, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
      }
    }
  }
}

/**
 * 绘制游戏元素（目标点、箱子、玩家）
 */
export function drawGameElements(params: DrawGameElementsParams): void {
  const { ctx, player, cargos, targets, keeperElement, cargoElement, targetElement, cargoOnTargetElement } = params;
  
  // 绘制目标点
  drawTargets({ ctx, targets, cargos, targetElement });

  // 绘制箱子
  drawCargos({ ctx, cargos, targets, cargoElement, cargoOnTargetElement });

  // 绘制玩家
  drawPlayer({ ctx, player, targets, keeperElement });
}

/**
 * 绘制目标点
 */
export function drawTargets(params: DrawTargetsParams): void {
  const { ctx, targets, cargos, targetElement } = params;
  
  for (const target of targets) {
    const hasCargoOnTarget = isPositionInArray(target.x, target.y, cargos);
    if (!hasCargoOnTarget) {
      targetElement && ctx.drawImage(targetElement, target.x * ImageProcessorConfig.CELL_SIZE, target.y * ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
    }
  }
}

/**
 * 绘制箱子
 */
export function drawCargos(params: DrawCargosParams): void {
  const { ctx, cargos, targets, cargoElement, cargoOnTargetElement } = params;
  
  for (const cargo of cargos) {
    const isOnTarget = isPositionInArray(cargo.x, cargo.y, targets);
    const cargoImage = isOnTarget ? cargoOnTargetElement : cargoElement;
    cargoImage && ctx.drawImage(
      cargoImage,
      cargo.x * ImageProcessorConfig.CELL_SIZE, cargo.y * ImageProcessorConfig.CELL_SIZE,
      ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE
    );
  }
}

/**
 * 绘制玩家
 */
export function drawPlayer(params: DrawPlayerParams): void {
  const { ctx, player, targets, keeperElement } = params;
  
  if (player && player.x >= 0 && player.y >= 0) {
    keeperElement && ctx.drawImage(keeperElement, player.x * ImageProcessorConfig.CELL_SIZE, player.y * ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);

    // 如果玩家站在目标点上，添加绿色边框
    const isPlayerOnTarget = isPositionInArray(player.x, player.y, targets);

    if (isPlayerOnTarget) {
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = ImageProcessorConfig.BORDER_WIDTH;
      ctx.strokeRect(
        player.x * ImageProcessorConfig.CELL_SIZE + ImageProcessorConfig.BORDER_OFFSET,
        player.y * ImageProcessorConfig.CELL_SIZE + ImageProcessorConfig.BORDER_OFFSET,
        ImageProcessorConfig.CELL_SIZE - ImageProcessorConfig.BORDER_WIDTH,
        ImageProcessorConfig.CELL_SIZE - ImageProcessorConfig.BORDER_WIDTH
      );
    }
  }
}