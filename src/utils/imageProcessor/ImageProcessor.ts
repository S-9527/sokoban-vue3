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

// 导入配置
import { ImageProcessorConfig } from "./config";

// 导入类型定义
import { 
  Position, 
  CanvasCreator, 
  ImageLoader, 
  ImageElementArray, 
  ReferenceImageDataArray,
  GameElementType,
  SimilarityMatch
} from "./types";

// 导入默认实现
import { DefaultCanvasCreator, DefaultImageLoader } from "./defaultImplementations";

// 导入工具函数
import { 
  findBestMatchingTileType, 
  checkForGreenBorder 
} from "./imageUtils";

import { 
  isGameDataValid, 
  calculateMapDimensions, 
  initializeGameData, 
  findDefaultPlayerPosition 
} from "./mapUtils";

import { 
  drawMapBackground, 
  drawGameElements,
} from "./drawUtils";

// 导入策略
import { StrategyFactory } from "./strategies";

// 定义解析参数接口
interface ParseMapAndElementsParams {
  ctx: CanvasRenderingContext2D;
  map: MapTile[][];
  player: Position;
  cargos: Position[];
  targets: Position[];
  referenceData: ReferenceImageDataArray;
  mapWidth: number;
  mapHeight: number;
  positionsToCheckForGreenBorder: Position[];
}

interface ProcessMatchingResultParams {
  bestMatch: SimilarityMatch;
  row: MapTile[];
  player: Position;
  cargos: Position[];
  targets: Position[];
  x: number;
  y: number;
  positionsToCheckForGreenBorder: Position[];
}

interface CheckPlayerGreenBorderParams {
  ctx: CanvasRenderingContext2D;
  positionsToCheckForGreenBorder: Position[];
  targets: Position[];
}

/**
 * 统一图像处理器类
 */
export class ImageProcessor {
  private canvasCreator: CanvasCreator;
  private imageLoader: ImageLoader;

  constructor(
    canvasCreator: CanvasCreator = new DefaultCanvasCreator(),
    imageLoader: ImageLoader = new DefaultImageLoader()
  ) {
    this.canvasCreator = canvasCreator;
    this.imageLoader = imageLoader;
  }

  /**
   * 将地图数据导出为图片快照
   * @param gameData 游戏地图数据
   * @returns 返回图片的 Data URL，失败时返回 null
   */
  async exportMapToImage(gameData: LevelGameData): Promise<string | null> {
    // 验证地图数据
    if (!isGameDataValid(gameData.map)) {
      console.error('地图数据无效');
      return null;
    }

    // 创建canvas和上下文
    const { canvas, ctx } = this.createCanvasAndContext(gameData.map);
    if (!ctx) {
      console.error('无法创建canvas上下文');
      return null;
    }

    // 加载所有图像
    const images = await this.loadAllImages();
    if (!images) {
      console.error('部分图像加载失败');
      return null;
    }

    // 绘制地图和游戏元素
    this.drawMapAndElements(ctx, gameData, images);

    // 导出为图片
    return canvas.toDataURL('image/png');
  }

  /**
   * 从图片快照加载地图数据
   * @param imageData 图片数据（Data URL 格式）
   * @returns 解析后的地图数据，解析失败时返回 null
   */
  async loadMapFromImage(imageData: string): Promise<LevelGameData | null> {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = imageData;
      });

      return await this.parseImageFromFile(img);
    } catch (error) {
      console.error('解析图片失败:', error);
      return null;
    }
  }

  /**
   * 创建canvas和上下文
   */
  private createCanvasAndContext(
    map: MapTile[][]
  ): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null } {
    const width = map[0].length * ImageProcessorConfig.CELL_SIZE;
    const height = map.length * ImageProcessorConfig.CELL_SIZE;
    const canvas = this.canvasCreator.createCanvas(width, height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    return { canvas, ctx };
  }

  /**
   * 加载所有图像
   */
  private async loadAllImages(): Promise<ImageElementArray | null> {
    // 定义图像源数组
    const imageSources = [
      wallImg,
      floorImg,
      emptyImg,
      keeperImg,
      cargoImg,
      targetImg,
      cargoOnTargetImg
    ];

    // 并行加载所有图像
    const loadTasks = imageSources.map(src => this.imageLoader.loadImage(src));
    const images = await Promise.all(loadTasks);

    // 检查是否有加载失败的图像
    if (images.some(img => !img)) {
      return null;
    }

    // 类型断言，确保返回正确的元组类型
    return images as ImageElementArray;
  }

  /**
   * 绘制地图和游戏元素
   */
  private drawMapAndElements(
    ctx: CanvasRenderingContext2D,
    gameData: LevelGameData,
    images: ImageElementArray
  ): void {
    const { map, player, cargos, targets } = gameData;
    const [wallElement, floorElement, emptyElement, keeperElement, cargoElement, targetElement, cargoOnTargetElement] = images;

    // 绘制地图背景
    drawMapBackground({ ctx, map, wallElement, floorElement, emptyElement });

    // 绘制游戏对象和元素
    drawGameElements({ ctx, player, cargos, targets, keeperElement, cargoElement, targetElement, cargoOnTargetElement });
  }

  /**
   * 从Context获取图像数据
   */
  private getImageData(ctx: CanvasRenderingContext2D, img: HTMLImageElement): Uint8ClampedArray {
    ctx.clearRect(0, 0, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
    ctx.drawImage(img, 0, 0, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
    return ctx.getImageData(0, 0, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE).data;
  }

  /**
   * 创建并初始化 Canvas
   */
  private createAndInitializeCanvas(
    img: HTMLImageElement
  ): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D } {
    const canvas = this.canvasCreator.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('无法创建canvas上下文');

    ctx.drawImage(img, 0, 0);

    return { canvas, ctx };
  }

  /**
   * 加载参考图像并获取像素数据
   */
  private async loadReferenceImageData(): Promise<ReferenceImageDataArray> {
    // 定义图像源和类型映射
    const imageSources = [
      { src: wallImg, type: GameElementType.WALL },
      { src: floorImg, type: GameElementType.FLOOR },
      { src: emptyImg, type: GameElementType.EMPTY },
      { src: keeperImg, type: GameElementType.KEEPER },
      { src: cargoImg, type: GameElementType.CARGO },
      { src: targetImg, type: GameElementType.TARGET },
      { src: cargoOnTargetImg, type: GameElementType.CARGO_ON_TARGET }
    ];

    // 创建参考canvas和上下文
    const refCanvas = this.canvasCreator.createCanvas(ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE);
    const refCtx = refCanvas.getContext('2d', { willReadFrequently: true });
    if (!refCtx) throw new Error('无法创建参考canvas上下文');

    // 并行加载所有图像并获取像素数据
    const loadTasks = imageSources.map(async ({ src, type }) => {
      const img = await this.imageLoader.loadImage(src);
      if (!img) {
        throw new Error(`图像加载失败: ${src}`);
      }
      const data = this.getImageData(refCtx, img);
      return { type, data };
    });

    const results = await Promise.all(loadTasks);
    // 类型断言，确保返回正确的元组类型
    return results as ReferenceImageDataArray;
  }

  /**
   * 从图片文件解析地图数据
   * @param img 加载的图片元素
   * @returns 解析后的地图数据
   */
  private async parseImageFromFile(img: HTMLImageElement): Promise<LevelGameData> {
    // 初始化 Canvas 和上下文
    const { ctx } = this.createAndInitializeCanvas(img);

    // 计算地图尺寸
    const { mapWidth, mapHeight } = calculateMapDimensions(img);

    // 初始化游戏数据结构
    const { map, player, cargos, targets } = initializeGameData();

    // 加载参考图像并获取像素数据
    const referenceData = await this.loadReferenceImageData();

    // 记录需要检查绿色边框的位置
    const positionsToCheckForGreenBorder: Position[] = [];

    // 解析地图和元素
    this.parseMapAndElements({ ctx, map, player, cargos, targets, referenceData, mapWidth, mapHeight, positionsToCheckForGreenBorder });

    // 检查玩家位置是否有绿色边框（表示玩家在目标点上）
    this.checkPlayerGreenBorder({ ctx, positionsToCheckForGreenBorder, targets });

    // 如果没有找到玩家，默认放在第一个地板位置
    this.handleMissingPlayer(map, player);

    return { map, player, cargos, targets };
  }

  /**
   * 解析地图和元素
   */
  private parseMapAndElements(params: ParseMapAndElementsParams): void {
    const { ctx, map, referenceData, mapWidth, mapHeight } = params;
    
    for (let y = 0; y < mapHeight; y++) {
      const row: MapTile[] = [];
      for (let x = 0; x < mapWidth; x++) {
        const cellX = x * ImageProcessorConfig.CELL_SIZE;
        const cellY = y * ImageProcessorConfig.CELL_SIZE;
        const cellData = ctx.getImageData(cellX, cellY, ImageProcessorConfig.CELL_SIZE, ImageProcessorConfig.CELL_SIZE).data;

        // 计算与每个参考图像的相似度并找出最相似的类型
        const bestMatch: SimilarityMatch = findBestMatchingTileType(cellData, referenceData);

        // 根据匹配结果设置地图元素和游戏对象
        this.processMatchingResult({ ...params, bestMatch, row, x, y });
      }
      map.push(row);
    }
  }

  /**
   * 处理匹配结果
   */
  private processMatchingResult(params: ProcessMatchingResultParams): void {
    const { bestMatch } = params;
    
    // 获取对应的策略
    const strategy = StrategyFactory.getStrategy(bestMatch.type) || StrategyFactory.getDefaultStrategy();
    
    // 执行策略
    strategy.process(params);
  }

  /**
   * 检查玩家位置是否有绿色边框（表示玩家在目标点上）
   */
  private checkPlayerGreenBorder(params: CheckPlayerGreenBorderParams): void {
    const { ctx, positionsToCheckForGreenBorder, targets } = params;
    
    for (const pos of positionsToCheckForGreenBorder) {
      // 检查边框颜色
      const hasGreenBorder = checkForGreenBorder(ctx, pos.x, pos.y);
      // 如果有绿色边框，且该位置还没有被标记为目标点，则添加
      if (hasGreenBorder) {
        const isAlreadyTarget = targets.some(target => target.x === pos.x && target.y === pos.y);
        if (!isAlreadyTarget) {
          targets.push({ x: pos.x, y: pos.y });
        }
      }
    }
  }

  /**
   * 处理缺失的玩家位置
   */
  private handleMissingPlayer(map: MapTile[][], player: Position): void {
    if (player.x === -1 || player.y === -1) {
      findDefaultPlayerPosition(map, player);
    }
  }
}