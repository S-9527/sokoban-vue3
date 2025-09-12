import { getCoordinates } from "@/utils/id.ts";
import { useEditCargoStore } from "@/store/editor/editCargo.ts";
import { useEditTargetStore } from "@/store/editor/editTarget.ts";
import { useEditPlayerStore } from "@/store/editor/editPlayer.ts";
import { useMapEditorStore } from "@/store/editor/mapEditor.ts";
import { LevelGameData } from "@/data";

/**
 * 创建用于图像导出的游戏数据对象
 * @returns 包含地图、玩家、箱子和目标点数据的对象
 */
export function createGameDataForExport(): LevelGameData {
  const { map } = useMapEditorStore();
  const { player } = useEditPlayerStore();
  const { cargos } = useEditCargoStore();
  const { targets } = useEditTargetStore();

  return {
    map: JSON.parse(JSON.stringify(map)),
    player: { x: player.x, y: player.y },
    cargos: getCoordinates(cargos),
    targets: getCoordinates(targets)
  };
}

/**
 * 根据游戏数据更新编辑器状态
 * @param gameData 游戏数据对象
 */
export function updateEditorFromGameData(gameData: LevelGameData): void {
  const {map: mapData, player: playerData, cargos: cargosData, targets: targetsData} = gameData;

  // 更新地图尺寸
  const {setRow, setCol, initMap, resetMap} = useMapEditorStore();
  setRow(mapData.length);
  setCol(mapData[0].length);

  // 重置地图并重新初始化
  resetMap();
  initMap(mapData.length, mapData[0].length);

  // 更新地图数据
  const {map: editorMap} = useMapEditorStore();
  for (let i = 0; i < mapData.length; i++) {
    for (let j = 0; j < mapData[i].length; j++) {
      editorMap[i][j] = mapData[i][j];
    }
  }

  // 更新玩家位置
  const playerStore = useEditPlayerStore();
  playerStore.player.x = playerData.x;
  playerStore.player.y = playerData.y;

  // 更新箱子位置
  const cargoStore = useEditCargoStore();
  cargoStore.cargos.splice(0, cargoStore.cargos.length);
  cargosData.forEach((cargo: any) => {
    cargoStore.addCargo(cargoStore.createCargo({x: cargo.x, y: cargo.y}));
  });

  // 更新目标点位置
  const targetStore = useEditTargetStore();
  targetStore.targets.splice(0, targetStore.targets.length);
  targetsData.forEach((target: any) => {
    // 确保目标点始终可见
    const newTarget = targetStore.createTarget({x: target.x, y: target.y});
    newTarget.visible = true;
    targetStore.addTarget(newTarget);
  });
}