import { ImageProcessorConfig } from "./config";
import { Position, ReferenceImageData, GameElementType, SimilarityMatch } from "./types";

/**
 * 计算两个图像数据的相似度
 * @param data1 图像数据1
 * @param data2 图像数据2
 * @returns 相似度（0-1之间）
 */
export function calculateImageSimilarity(data1: Uint8ClampedArray, data2: Uint8ClampedArray): number {
  // 初始化统计变量
  let totalColorDifference = 0;        // 总颜色差异
  let maxPossibleDifference = 0;       // 最大可能的差异（用于归一化）
  let matchingPixels = 0;              // 匹配的像素数
  let totalPixels = 0;                 // 总像素数

  // 遍历所有像素（每次步进4，因为每个像素由4个值组成：R,G,B,A）
  for (let i = 0; i < data1.length; i += 4) {
    // 检查两个图像在该像素点是否都有内容（alpha > 0）
    const hasContent1 = data1[i + 3] > 0;  // 第一个图像的alpha通道
    const hasContent2 = data2[i + 3] > 0;  // 第二个图像的alpha通道

    totalPixels++;

    // 情况1：两个图像在该点都有内容
    if (hasContent1 && hasContent2) {
      // 计算RGB三个通道的颜色差异
      const redDiff = Math.abs(data1[i] - data2[i]);           // R通道差异
      const greenDiff = Math.abs(data1[i + 1] - data2[i + 1]); // G通道差异
      const blueDiff = Math.abs(data1[i + 2] - data2[i + 2]);  // B通道差异

      totalColorDifference += redDiff + greenDiff + blueDiff;
      maxPossibleDifference += 3 * 255;  // 每个通道最大差异是255
      matchingPixels++;
    }
    // 情况2：两个图像在该点都无内容
    else if (!hasContent1 && !hasContent2) {
      // 两个图像在该点都无内容，视为完全匹配
      matchingPixels++;
    }
    // 情况3：一个有内容一个无内容
    // 不增加匹配计数，也不计入差异计算
  }

  // 如果没有任何重叠的像素，返回0相似度
  if (maxPossibleDifference === 0) return 0;

  // 计算颜色相似度（1 - 平均相对差异）
  const averageDifference = totalColorDifference / maxPossibleDifference;
  const colorSimilarity = 1 - averageDifference;

  // 计算像素重叠率（匹配的像素占总像素的比例）
  const overlapRate = matchingPixels / totalPixels;

  // 综合相似度 = 颜色相似度 * 像素重叠率
  // 这样可以同时考虑颜色匹配度和内容重叠度
  return colorSimilarity * overlapRate;
}

/**
 * 查找最匹配的瓦片类型
 * @param cellData 当前单元格的图像数据
 * @param referenceData 参考图像数据数组
 * @returns 最匹配的类型信息
 */
export function findBestMatchingTileType(
  cellData: Uint8ClampedArray,
  referenceData: ReferenceImageData[]
): SimilarityMatch {
  let bestMatch: SimilarityMatch = { type: GameElementType.EMPTY, similarity: 0 };

  for (const ref of referenceData) {
    const similarity = calculateImageSimilarity(cellData, ref.data);
    if (similarity > bestMatch.similarity) {
      bestMatch = { type: ref.type, similarity };
    }
  }

  return bestMatch;
}

/**
 * 检查位置是否在数组中
 */
export function isPositionInArray(x: number, y: number, arr: Position[]): boolean {
  return arr.some(item => item.x === x && item.y === y);
}

/**
 * 检查指定位置是否有绿色边框（表示玩家在目标点上）
 * @param ctx Canvas上下文
 * @param x X坐标（格子单位）
 * @param y Y坐标（格子单位）
 * @returns 是否有绿色边框
 */
export function checkForGreenBorder(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
  // 边框位置（根据drawPlayer函数中的绘制逻辑）
  const borderX = x * ImageProcessorConfig.CELL_SIZE + ImageProcessorConfig.BORDER_OFFSET;
  const borderY = y * ImageProcessorConfig.CELL_SIZE + ImageProcessorConfig.BORDER_OFFSET;

  // 检查四条边是否有绿色像素
  // 上边
  const topBorderData = ctx.getImageData(borderX + ImageProcessorConfig.CELL_SIZE / 2, borderY, 1, 1).data;
  // 右边
  const rightBorderData = ctx.getImageData(borderX + ImageProcessorConfig.CELL_SIZE - ImageProcessorConfig.BORDER_WIDTH, borderY + ImageProcessorConfig.CELL_SIZE / 2, 1, 1).data;
  // 下边
  const bottomBorderData = ctx.getImageData(borderX + ImageProcessorConfig.CELL_SIZE / 2, borderY + ImageProcessorConfig.CELL_SIZE - ImageProcessorConfig.BORDER_WIDTH, 1, 1).data;
  // 左边
  const leftBorderData = ctx.getImageData(borderX, borderY + ImageProcessorConfig.CELL_SIZE / 2, 1, 1).data;

  // 判断是否为绿色 (#00FF00)
  const isGreen = (data: Uint8ClampedArray): boolean => {
    // RGB接近绿色 (0, 255, 0)
    return data[0] < 50 && data[1] > 200 && data[2] < 50;
  };

  // 如果至少有两条边是绿色，则认为有绿色边框
  const greenBorderCount = [
    isGreen(topBorderData),
    isGreen(rightBorderData),
    isGreen(bottomBorderData),
    isGreen(leftBorderData)
  ].filter(Boolean).length;

  return greenBorderCount >= ImageProcessorConfig.GREEN_BORDER_THRESHOLD;
}