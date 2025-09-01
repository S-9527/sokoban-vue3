import { MapTile } from "@/store/game/map";
import { Position } from "./types";
import { ImageProcessorConfig } from "./config";

/**
 * 验证游戏数据是否有效
 */
export function isGameDataValid(map: MapTile[][]): boolean {
  return !(!map || map.length === 0 || !map[0] || map[0].length === 0);
}

/**
 * 计算地图尺寸
 */
export function calculateMapDimensions(img: HTMLImageElement): { mapWidth: number, mapHeight: number } {
  const mapWidth = Math.floor(img.width / ImageProcessorConfig.CELL_SIZE);
  const mapHeight = Math.floor(img.height / ImageProcessorConfig.CELL_SIZE);
  return { mapWidth, mapHeight };
}

/**
 * 初始化游戏数据结构
 */
export function initializeGameData(): { map: MapTile[][], player: Position, cargos: Position[], targets: Position[] } {
  const map: MapTile[][] = [];
  const player: Position = { x: -1, y: -1 };
  const cargos: Position[] = [];
  const targets: Position[] = [];
  return { map, player, cargos, targets };
}

/**
 * 查找默认的玩家位置
 * @param map 地图数据
 * @param player 玩家位置对象（会被修改）
 */
export function findDefaultPlayerPosition(map: MapTile[][], player: Position): void {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === MapTile.FLOOR) {
        player.x = x;
        player.y = y;
        return;
      }
    }
  }
}