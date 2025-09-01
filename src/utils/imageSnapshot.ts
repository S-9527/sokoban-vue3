import { LevelGameData } from "@/data";
import { ImageProcessor } from "./imageProcessor/ImageProcessor";

// 保持向后兼容的默认实例
const defaultImageProcessor = new ImageProcessor();

// 类型定义（保持向后兼容）
export type Position = { x: number; y: number };

// 依赖接口定义（保持向后兼容）
export interface CanvasCreator {
  createCanvas(width: number, height: number): HTMLCanvasElement;
}

export interface ImageLoader {
  loadImage(src: string): Promise<HTMLImageElement | null>;
}

/**
 * 将地图数据导出为图片快照
 * @param gameData 游戏地图数据
 * @param canvasCreator Canvas创建器（可选，用于测试）
 * @param imageLoader 图像加载器（可选，用于测试）
 * @returns 返回图片的 Data URL，失败时返回 null
 */
export async function exportMapToImage(
  gameData: LevelGameData,
  canvasCreator?: CanvasCreator,
  imageLoader?: ImageLoader
): Promise<string | null> {
  // 为了保持向后兼容性，如果提供了自定义的canvasCreator或imageLoader，则创建新的ImageProcessor实例
  if (canvasCreator || imageLoader) {
    const processor = new ImageProcessor(canvasCreator, imageLoader);
    return processor.exportMapToImage(gameData);
  }
  
  // 否则使用默认实例
  return defaultImageProcessor.exportMapToImage(gameData);
}

/**
 * 从图片快照加载地图数据
 * @param imageData 图片数据（Data URL 格式）
 * @param canvasCreator Canvas创建器（可选，用于测试）
 * @param imageLoader 图像加载器（可选，用于测试）
 * @returns 解析后的地图数据，解析失败时返回 null
 */
export async function loadMapFromImage(
  imageData: string,
  canvasCreator?: CanvasCreator,
  imageLoader?: ImageLoader
): Promise<LevelGameData | null> {
  // 为了保持向后兼容性，如果提供了自定义的canvasCreator或imageLoader，则创建新的ImageProcessor实例
  if (canvasCreator || imageLoader) {
    const processor = new ImageProcessor(canvasCreator, imageLoader);
    return processor.loadMapFromImage(imageData);
  }
  
  // 否则使用默认实例
  return defaultImageProcessor.loadMapFromImage(imageData);
}

// 导出类型定义供其他模块使用（保持向后兼容）
export type { 
  ReferenceImageData, 
  ImageElement, 
  SimilarityMatch, 
  ParseResult,
  ImageElementArray,
  ReferenceImageDataArray
} from "./imageProcessor/types";

// 导出绘制参数类型供其他模块使用（保持向后兼容）
export type { 
  DrawBackgroundParams,
  DrawGameElementsParams,
  DrawTargetsParams,
  DrawCargosParams,
  DrawPlayerParams
} from "./imageProcessor/drawUtils";