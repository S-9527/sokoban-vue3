import { MapTile } from "@/store/game/map";
import { LevelGameData } from "@/data";

// 导入游戏素材
import wallImg from '@/assets/wall.png';
import floorImg from '@/assets/floor.png';
import emptyImg from '@/assets/empty.png';
import keeperImg from '@/assets/keeper.png';
import cargoImg from '@/assets/cargo.png';
import targetImg from '@/assets/target.png';
import cargoOnTargetImg from '@/assets/cargo_on_target.png';

// 常量定义
const CELL_SIZE = 32; // 格子像素大小

// 类型定义
type Position = { x: number; y: number };

/**
 * 将地图数据导出为图片快照
 * @param gameData 游戏地图数据
 * @returns 返回图片的 Data URL，失败时返回 null
 */
export async function exportMapToImage(gameData: LevelGameData): Promise<string | null> {
  // 解构游戏数据
  const { map, player, cargos, targets } = gameData;
  
  // 验证地图数据
  if (!map || map.length === 0 || !map[0] || map[0].length === 0) {
    console.error('地图数据无效');
    return null;
  }
  
  // 创建canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    console.error('无法创建canvas上下文');
    return null;
  }
  
  // 设置canvas尺寸
  canvas.width = map[0].length * CELL_SIZE;
  canvas.height = map.length * CELL_SIZE;
  
  // 加载所有图像
  const images = await Promise.all([
    loadImageElement(wallImg),
    loadImageElement(floorImg),
    loadImageElement(emptyImg),
    loadImageElement(keeperImg),
    loadImageElement(cargoImg),
    loadImageElement(targetImg),
    loadImageElement(cargoOnTargetImg)
  ]);
  
  // 检查是否有加载失败的图像
  if (images.some(img => !img)) {
    console.error('部分图像加载失败');
    return null;
  }
  
  const [wallElement, floorElement, emptyElement, keeperElement, cargoElement, targetElement, cargoOnTargetElement] = images;

  // 绘制地图背景
  drawMapBackground(ctx, map, wallElement, floorElement, emptyElement);
  
  // 绘制游戏对象和元素
  drawGameElements(ctx, player, cargos, targets, keeperElement, cargoElement, targetElement, cargoOnTargetElement);
  
  // 导出为图片
  return canvas.toDataURL('image/png');
}

/**
 * 绘制地图背景
 */
function drawMapBackground(
  ctx: CanvasRenderingContext2D,
  map: MapTile[][],
  wallElement: HTMLImageElement | null,
  floorElement: HTMLImageElement | null,
  emptyElement: HTMLImageElement | null
): void {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];
      const posX = x * CELL_SIZE;
      const posY = y * CELL_SIZE;
      
      switch (tile) {
        case MapTile.WALL:
          wallElement && ctx.drawImage(wallElement, posX, posY, CELL_SIZE, CELL_SIZE);
          break;
        case MapTile.FLOOR:
          floorElement && ctx.drawImage(floorElement, posX, posY, CELL_SIZE, CELL_SIZE);
          break;
        case MapTile.EMPTY:
          emptyElement && ctx.drawImage(emptyElement, posX, posY, CELL_SIZE, CELL_SIZE);
          break;
        default:
          ctx.fillStyle = 'red';
          ctx.fillRect(posX, posY, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

/**
 * 检查位置是否在数组中
 */
function isPositionInArray(x: number, y: number, arr: Position[]): boolean {
  return arr.some(item => item.x === x && item.y === y);
}

/**
 * 绘制游戏元素（目标点、箱子、玩家）
 */
function drawGameElements(
  ctx: CanvasRenderingContext2D,
  player: Position,
  cargos: Position[],
  targets: Position[],
  keeperElement: HTMLImageElement | null,
  cargoElement: HTMLImageElement | null,
  targetElement: HTMLImageElement | null,
  cargoOnTargetElement: HTMLImageElement | null
): void {
  // 绘制目标点
  drawTargets(ctx, targets, cargos, targetElement);
  
  // 绘制箱子
  drawCargos(ctx, cargos, targets, cargoElement, cargoOnTargetElement);
  
  // 绘制玩家
  drawPlayer(ctx, player, targets, keeperElement);
}

/**
 * 绘制目标点
 */
function drawTargets(
  ctx: CanvasRenderingContext2D,
  targets: Position[],
  cargos: Position[],
  targetElement: HTMLImageElement | null
): void {
  for (const target of targets) {
    const hasCargoOnTarget = cargos.some(cargo => cargo.x === target.x && cargo.y === target.y);
    if (!hasCargoOnTarget) {
      targetElement && ctx.drawImage(targetElement, target.x * CELL_SIZE, target.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

/**
 * 绘制箱子
 */
function drawCargos(
  ctx: CanvasRenderingContext2D,
  cargos: Position[],
  targets: Position[],
  cargoElement: HTMLImageElement | null,
  cargoOnTargetElement: HTMLImageElement | null
): void {
  for (const cargo of cargos) {
    const isOnTarget = isPositionInArray(cargo.x, cargo.y, targets);
    const cargoImage = isOnTarget ? cargoOnTargetElement : cargoElement;
    cargoImage && ctx.drawImage(
      cargoImage, 
      cargo.x * CELL_SIZE, cargo.y * CELL_SIZE, 
      CELL_SIZE, CELL_SIZE
    );
  }
}

/**
 * 绘制玩家
 */
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Position,
  targets: Position[],
  keeperElement: HTMLImageElement | null
): void {
  if (player && player.x >= 0 && player.y >= 0) {
    keeperElement && ctx.drawImage(keeperElement, player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // 如果玩家站在目标点上，添加绿色边框
    const isPlayerOnTarget = targets.some(target => 
      target.x === player.x && target.y === player.y
    );
    
    if (isPlayerOnTarget) {
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        player.x * CELL_SIZE + 1, 
        player.y * CELL_SIZE + 1, 
        CELL_SIZE - 2, 
        CELL_SIZE - 2
      );
    }
  }
}

/**
 * 加载图像元素
 * @param src 图像源路径
 * @returns 返回加载的图像元素，加载失败时返回 null
 */
function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`图像加载失败: ${src}`);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * 从图片快照加载地图数据
 * @param imageData 图片数据（Data URL 格式）
 * @returns 解析后的地图数据，解析失败时返回 null
 */
export async function loadMapFromImage(imageData: string): Promise<LevelGameData | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      parseImageFromFile(img)
        .then(resolve)
        .catch((error) => {
          console.error('解析图片失败:', error);
          resolve(null);
        });
    };
    img.onerror = () => {
      console.error('图片加载失败');
      resolve(null);
    };
    img.src = imageData;
  });
}

/**
 * 从图片文件解析地图数据
 * @param img 加载的图片元素
 * @returns 解析后的地图数据
 */
async function parseImageFromFile(img: HTMLImageElement): Promise<LevelGameData> {
  // 创建并初始化 Canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('无法创建canvas上下文');
  
  // 设置canvas尺寸
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  // 计算地图尺寸
  const mapWidth = Math.floor(img.width / CELL_SIZE);
  const mapHeight = Math.floor(img.height / CELL_SIZE);
  
  // 初始化数据
  const map: MapTile[][] = [];
  const player = { x: -1, y: -1 };
  const cargos: { x: number; y: number }[] = [];
  const targets: { x: number; y: number }[] = [];
  
  // 加载参考图像并获取它们的像素数据
  const images = await Promise.all([
    loadImage(wallImg),
    loadImage(floorImg),
    loadImage(emptyImg),
    loadImage(keeperImg),
    loadImage(cargoImg),
    loadImage(targetImg),
    loadImage(cargoOnTargetImg)
  ]);
  
  // 检查是否有加载失败的图像
  if (images.some(img => !img)) {
    throw new Error('部分参考图像加载失败');
  }
  
  const [wallElement, floorElement, emptyElement, keeperElement, 
         cargoElement, targetElement, cargoOnTargetElement] = images;
         
  // 获取参考图像的像素数据
  const refCanvas = document.createElement('canvas');
  const refCtx = refCanvas.getContext('2d', { willReadFrequently: true });
  if (!refCtx) throw new Error('无法创建参考canvas上下文');
  
  refCanvas.width = CELL_SIZE;
  refCanvas.height = CELL_SIZE;
  
  // 获取所有参考图像的像素数据
  const referenceData = [
    wallElement && { type: 'wall', data: getImageData(refCtx, wallElement) },
    floorElement && { type: 'floor', data: getImageData(refCtx, floorElement) },
    emptyElement && { type: 'empty', data: getImageData(refCtx, emptyElement) },
    keeperElement && { type: 'keeper', data: getImageData(refCtx, keeperElement) },
    cargoElement && { type: 'cargo', data: getImageData(refCtx, cargoElement) },
    targetElement && { type: 'target', data: getImageData(refCtx, targetElement) },
    cargoOnTargetElement && { type: 'cargoOnTarget', data: getImageData(refCtx, cargoOnTargetElement) }
  ].filter(Boolean) as { type: string; data: Uint8ClampedArray }[];
  
  // 解析地图和元素
  for (let y = 0; y < mapHeight; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < mapWidth; x++) {
      const cellX = x * CELL_SIZE;
      const cellY = y * CELL_SIZE;
      const cellData = ctx.getImageData(cellX, cellY, CELL_SIZE, CELL_SIZE).data;
      
      // 计算与每个参考图像的相似度并找出最相似的类型
      const bestMatch = findBestMatchingTileType(cellData, referenceData);
      
      // 根据匹配结果设置地图元素和游戏对象
      if (bestMatch.type === 'wall') {
        row.push(MapTile.WALL);
      } else if (['floor', 'keeper', 'cargo', 'target', 'cargoOnTarget'].includes(bestMatch.type)) {
        row.push(MapTile.FLOOR);
        
        // 记录游戏对象
        if (bestMatch.type === 'keeper') player.x = x, player.y = y;
        if (bestMatch.type === 'cargo' || bestMatch.type === 'cargoOnTarget') cargos.push({ x, y });
        if (bestMatch.type === 'target' || bestMatch.type === 'cargoOnTarget') targets.push({ x, y });
      } else {
        row.push(MapTile.EMPTY);
      }
    }
    map.push(row);
  }
  
  // 如果没有找到玩家，默认放在第一个地板位置
  if (player.x === -1 || player.y === -1) {
    findDefaultPlayerPosition(map, player);
  }
  
  return { map, player, cargos, targets };
}

/**
 * 从Context获取图像数据
 */
function getImageData(ctx: CanvasRenderingContext2D, img: HTMLImageElement): Uint8ClampedArray {
  ctx.clearRect(0, 0, CELL_SIZE, CELL_SIZE);
  ctx.drawImage(img, 0, 0, CELL_SIZE, CELL_SIZE);
  return ctx.getImageData(0, 0, CELL_SIZE, CELL_SIZE).data;
}

/**
 * 加载图像
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * 计算两个图像数据的相似度
 */
function calculateImageSimilarity(data1: Uint8ClampedArray, data2: Uint8ClampedArray): number {
  let diff = 0;
  let total = 0;
  
  for (let i = 0; i < data1.length; i += 4) {
    if (data1[i + 3] > 0 && data2[i + 3] > 0) {
      diff += Math.abs(data1[i] - data2[i]) + 
              Math.abs(data1[i + 1] - data2[i + 1]) + 
              Math.abs(data1[i + 2] - data2[i + 2]);
      total += 3 * 255;
    }
  }
  
  return total === 0 ? 0 : 1 - (diff / total);
}

/**
 * 查找最匹配的瓦片类型
 * @param cellData 当前单元格的图像数据
 * @param referenceData 参考图像数据数组
 * @returns 最匹配的类型信息
 */
function findBestMatchingTileType(
  cellData: Uint8ClampedArray, 
  referenceData: { type: string; data: Uint8ClampedArray }[]
): { type: string; similarity: number } {
  let bestMatch = { type: 'unknown', similarity: 0 };
  
  for (const ref of referenceData) {
    const similarity = calculateImageSimilarity(cellData, ref.data);
    if (similarity > bestMatch.similarity) {
      bestMatch = { type: ref.type, similarity };
    }
  }
  
  return bestMatch;
}

/**
 * 查找默认的玩家位置
 * @param map 地图数据
 * @param player 玩家位置对象（会被修改）
 */
function findDefaultPlayerPosition(map: MapTile[][], player: Position): void {
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
