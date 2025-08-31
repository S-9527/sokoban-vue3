import {LevelGameData, GameData} from "@/data";
import {loadMapFromImage} from "./imageSnapshot";

/**
 * 从data目录加载地图图片并解析为游戏数据
 */
export async function loadMapsFromImages(): Promise<GameData> {
    // 获取所有图片路径并加载地图
    const mapImagePaths = await getMapImagePaths();
    const gameData: GameData = [];

    // 并行加载所有地图图片
    const loadPromises = mapImagePaths.map(
        imagePath => loadMapFromImagePath(imagePath)
    );
    const results = await Promise.allSettled(loadPromises);

    // 收集成功加载的地图
    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            gameData.push(result.value);
        }
    });

    // 如果没有地图，尝试从本地存储加载或创建默认地图
    if (gameData.length === 0) {
        createDefaultMap();
    }

    return gameData;
}

/**
 * 获取地图图片路径列表
 */
async function getMapImagePaths(): Promise<string[]> {
    const mapImagePaths: string[] = [];

    // 添加预定义地图
    for (let i = 1; i <= 12; i++) {
        mapImagePaths.push(`/sokoban-vue3/data/maps/level-${i}.png`);
    }

    return mapImagePaths;
}

/**
 * 从图片路径加载地图数据
 */
async function loadMapFromImagePath(imagePath: string): Promise<LevelGameData | null> {
    // 数据URL直接使用，普通路径需要先获取图片数据
    if (imagePath.startsWith('data:image/')) {
        return await loadMapFromImage(imagePath);
    }

    const response = await fetch(imagePath);
    if (!response.ok) return null;

    const blob = await response.blob();
    const dataUrl = await blobToDataURL(blob);
    return await loadMapFromImage(dataUrl);
}

/**
 * 将Blob转换为DataURL
 */
function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * 创建一个简单的默认地图
 */
function createDefaultMap(): LevelGameData {
    return {
        map: [
            [1, 1, 1, 1, 1],
            [1, 2, 2, 2, 1],
            [1, 2, 2, 2, 1],
            [1, 2, 2, 2, 1],
            [1, 1, 1, 1, 1]
        ],
        player: {x: 2, y: 2},
        cargos: [{x: 3, y: 2}],
        targets: [{x: 1, y: 1}]
    };
}