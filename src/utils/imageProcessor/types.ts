import { MapTile } from "@/store/game/map";

// 类型定义
export type Position = { x: number; y: number };

// 依赖接口定义
export interface CanvasCreator {
  createCanvas(width: number, height: number): HTMLCanvasElement;
}

export interface ImageLoader {
  loadImage(src: string): Promise<HTMLImageElement | null>;
}

// 游戏元素类型枚举
export enum GameElementType {
  WALL = 'wall',
  FLOOR = 'floor',
  EMPTY = 'empty',
  KEEPER = 'keeper',
  CARGO = 'cargo',
  TARGET = 'target',
  CARGO_ON_TARGET = 'cargoOnTarget'
}

// 图像参考数据类型
export interface ReferenceImageData {
  type: GameElementType;
  data: Uint8ClampedArray;
}

// 图像元素类型
export interface ImageElement {
  type: GameElementType;
  element: HTMLImageElement | null;
}

// 相似度匹配结果类型
export interface SimilarityMatch {
  type: GameElementType;
  similarity: number;
}

// 解析结果类型
export interface ParseResult {
  map: MapTile[][];
  player: Position;
  cargos: Position[];
  targets: Position[];
}

// 导出图像元素数组类型
export type ImageElementArray = [
  HTMLImageElement | null, // wallElement
  HTMLImageElement | null, // floorElement
  HTMLImageElement | null, // emptyElement
  HTMLImageElement | null, // keeperElement
  HTMLImageElement | null, // cargoElement
  HTMLImageElement | null, // targetElement
  HTMLImageElement | null  // cargoOnTargetElement
];

// 导出参考图像数据数组类型
export type ReferenceImageDataArray = ReferenceImageData[];