import { ref } from 'vue';
import { exportMapToImage, loadMapFromImage } from "@/utils/imageSnapshot.ts";
import { getCoordinates } from "@/utils/id.ts";
import { useEditCargoStore } from "@/store/editor/editCargo.ts";
import { useEditTargetStore } from "@/store/editor/editTarget.ts";
import { useEditPlayerStore } from "@/store/editor/editPlayer.ts";
import { useMapEditorStore } from "@/store/editor/mapEditor.ts";

export function useImageHandler() {
  // 图片相关状态
  const imageDownloadUrl = ref<string | null>(null);
  const uploadedImageUrl = ref<string | null>(null);
  const uploadedGameData = ref<any>(null);

  // 导出图片快照
  const exportImageSnapshot = async () => {
    const { map } = useMapEditorStore();
    const { player } = useEditPlayerStore();
    const { cargos } = useEditCargoStore();
    const { targets } = useEditTargetStore();

    const gameData = {
      map: JSON.parse(JSON.stringify(map)),
      player: {x: player.x, y: player.y},
      cargos: getCoordinates(cargos),
      targets: getCoordinates(targets)
    };

    imageDownloadUrl.value = await exportMapToImage(gameData);
  };

  // 触发图片输入框点击事件
  const triggerImageInput = (imageInputRef: HTMLInputElement | null) => {
    if (imageInputRef) {
      imageInputRef.click();
    }
  };

  // 处理图片上传
  const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const imageDataUrl = e.target?.result as string;
        uploadedImageUrl.value = imageDataUrl;
        uploadedGameData.value = await loadMapFromImage(imageDataUrl);
      } catch (error) {
        alert('从图片加载地图失败: ' + (error as Error).message);
      }
    };

    reader.readAsDataURL(file);
  };

  // 关闭图片预览
  const closeImagePreview = () => {
    uploadedImageUrl.value = null;
    uploadedGameData.value = null;
    imageDownloadUrl.value = null;
  };

  // 确认加载上传的图片作为地图
  const confirmImageUpload = () => {
    if (uploadedGameData.value) {
      updateEditorFromGameData(uploadedGameData.value);
      uploadedImageUrl.value = null;
      uploadedGameData.value = null;
      alert('地图数据已从图片加载');
    }
  };

  // 根据游戏数据更新编辑器状态
  const updateEditorFromGameData = (gameData: any) => {
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
  };

  // 保存地图到本地存储
  const saveMapToLocal = () => {
    // TODO: 直接将图片下载到 /pubic/data/ 目录中
  };

  return {
    imageDownloadUrl,
    uploadedImageUrl,
    uploadedGameData,
    exportImageSnapshot,
    triggerImageInput,
    handleImageUpload,
    closeImagePreview,
    confirmImageUpload,
    updateEditorFromGameData,
    saveMapToLocal
  };
}