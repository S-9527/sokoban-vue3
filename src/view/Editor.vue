<template>
  <div class="h-screen bg-gray-100 flex flex-col overflow-hidden">
    <!-- 图片预览模态框 -->
    <Teleport to="body">
      <div v-if="imageDownloadUrl || uploadedImageUrl"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ uploadedImageUrl ? '图片导入预览' : '图片导出预览' }}
            </h3>
            <button @click="closeImagePreview" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 p-6 flex justify-center items-center overflow-auto">
            <img :src="uploadedImageUrl || imageDownloadUrl || ''"
                 :alt="uploadedImageUrl ? '导入图片预览' : '导出图片预览'"
                 class="max-w-full h-auto max-h-[60vh]"/>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2">
            <template v-if="uploadedImageUrl">
              <button @click="confirmImageUpload"
                      class="flex-1 min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                确认导入地图
              </button>
              <button @click="closeImagePreview"
                      class="flex-1 min-w-[120px] bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded">
                取消
              </button>
            </template>
            <template v-else>
              <a :href="imageDownloadUrl || ''"
                 :download="`map-snapshot-${Date.now()}.png`"
                 class="flex-1 min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-center">
                下载图片
              </a>
              <button @click="saveMapToLocal"
                      class="flex-1 min-w-[120px] bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded">
                保存到本地
              </button>
              <button @click="closeImagePreview"
                      class="flex-1 min-w-[120px] bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded">
                关闭预览
              </button>
            </template>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">推箱子地图编辑器</h1>
        <div class="flex space-x-2">
          <button @click="exportImageSnapshot"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clip-rule="evenodd"/>
            </svg>
            导出图片
          </button>
          <button @click="triggerImageInput"
                  class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 011.414 0L9 8.586V3a1 1 0 112 0v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clip-rule="evenodd"/>
            </svg>
            导入图片
          </button>
          <input type="file"
                 ref="imageInputRef"
                 accept="image/*"
                 @change="handleImageUpload"
                 class="hidden"/>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="flex-1 overflow-hidden">
      <div class="h-full flex flex-col lg:flex-row overflow-hidden">
        <!-- 左侧编辑区域 -->
        <div class="flex-1 p-4 flex flex-col overflow-hidden">
          <!-- 地图编辑网格 -->
          <div class="flex-1 bg-white shadow-md rounded-lg p-4 overflow-auto">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">地图编辑区</h2>
              <div class="text-sm text-gray-600">
                当前地图: {{ map.length }}行 x {{ map[0]?.length || 0 }}列 |
                箱子: {{ cargos.length }} |
                目标点: {{ targets.length }}
              </div>
            </div>
            <div class="relative overflow-hidden border border-gray-200 rounded-lg bg-gray-50"
                 style="min-height: 500px; display: flex; justify-content: center; align-items: center;">
              <div v-if="map.length === 0" class="text-gray-500">
                请设置地图尺寸并开始编辑
              </div>
              <div v-else class="relative">
                <MapEditor/>
                <PlayerEditor/>
                <CargoEditor v-for="cargo in cargos" :key="cargo.id" :cargo="cargo"/>
                <TargetEditor v-for="target in targets" :key="target.id" :target="target"/>
              </div>
            </div>

            <!-- 快捷操作提示 -->
            <div class="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div class="flex items-center text-sm text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"/>
                </svg>
                <span>提示：在地图编辑区单击放置元素，双击删除特殊元素</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧工具面板 -->
        <div
            class="w-full lg:w-80 xl:w-96 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
          <div class="flex border-b border-gray-200">
            <button v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    class="flex-1 py-3 px-4 text-center text-sm font-medium"
                    :class="activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'">
              {{ tab.name }}
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <!-- 地图设计 -->
            <div v-show="activeTab === 'design'" class="h-full overflow-auto">
              <h2 class="text-lg font-medium text-gray-900 mb-4">地图设计</h2>
              <EditElementView/>
            </div>

            <!-- 地图数据 -->
            <div v-show="activeTab === 'data'" class="h-full overflow-auto">
              <h2 class="text-lg font-medium text-gray-900 mb-4">地图数据</h2>
              <MapDataDisplay/>
            </div>

            <!-- 操作指南 -->
            <div v-show="activeTab === 'guide'" class="h-full overflow-auto">
              <h2 class="text-lg font-medium text-gray-900 mb-4">操作指南</h2>
              <div class="text-sm text-gray-600 space-y-3">
                <div class="bg-blue-50 p-3 rounded-lg">
                  <h3 class="font-medium text-blue-800 mb-1">基础操作</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>在左侧编辑区域点击放置元素</li>
                    <li>双击元素可删除（玩家、箱子、目标点）</li>
                    <li>拖动可移动墙壁、地板和空白元素</li>
                  </ul>
                </div>

                <div class="bg-green-50 p-3 rounded-lg">
                  <h3 class="font-medium text-green-800 mb-1">元素叠加</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>玩家和箱子可以放在目标点上</li>
                    <li>系统会自动处理叠加元素的显示</li>
                  </ul>
                </div>

                <div class="bg-purple-50 p-3 rounded-lg">
                  <h3 class="font-medium text-purple-800 mb-1">数据管理</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>使用"地图数据"标签页导入/导出JSON</li>
                    <li>使用顶部按钮导入/导出图片</li>
                    <li>支持从已有地图图片导入</li>
                  </ul>
                </div>

                <div class="bg-yellow-50 p-3 rounded-lg">
                  <h3 class="font-medium text-yellow-800 mb-1">提示</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>请确保地图中至少有一个玩家</li>
                    <li>箱子数量应与目标点数量相等</li>
                    <li>保存地图前请预览确认</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from 'vue';
import MapEditor from "@/components/editor/MapEditor.vue";
import EditElementView from "@/components/editor/EditElementView.vue";
import PlayerEditor from "@/components/editor/PlayerEditor.vue";
import CargoEditor from "@/components/editor/CargoEditor.vue";
import TargetEditor from "@/components/editor/TargetEditor.vue";
import MapDataDisplay from "@/components/editor/MapDataDisplay.vue";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";
import {useEditTargetStore} from "@/store/editor/editTarget.ts";
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {exportMapToImage, loadMapFromImage} from "@/utils/imageSnapshot.ts";
import {getCoordinates} from "@/utils/id.ts";

const {player} = useEditPlayerStore();
const {cargos} = useEditCargoStore();
const {targets} = useEditTargetStore();
const {map} = useMapEditorStore();

// 标签页状态
const activeTab = ref<'design' | 'data' | 'guide'>('design');
const tabs = reactive([
  {id: 'design' as const, name: '地图设计'},
  {id: 'data' as const, name: '地图数据'},
  {id: 'guide' as const, name: '操作指南'}
]);

// 图片相关状态
const imageInputRef = ref<HTMLInputElement | null>(null);
const imageDownloadUrl = ref<string | null>(null);
const uploadedImageUrl = ref<string | null>(null);
const uploadedGameData = ref<any>(null);

// 关闭图片预览
const closeImagePreview = () => {
  uploadedImageUrl.value = null;
  uploadedGameData.value = null;
  imageDownloadUrl.value = null;
};

// 触发图片输入框点击
const triggerImageInput = () => {
  if (imageInputRef.value) imageInputRef.value.click();
};

// 导出图片快照
const exportImageSnapshot = async () => {
  const gameData = {
    map: JSON.parse(JSON.stringify(map)),
    player: {x: player.x, y: player.y},
    cargos: getCoordinates(cargos),
    targets: getCoordinates(targets)
  };

  imageDownloadUrl.value = await exportMapToImage(gameData);
};

// 保存地图到本地存储
const saveMapToLocal = () => {
  // TODO: 直接将图片下载到 /pubic/data/ 目录中
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
    targetStore.addTarget(targetStore.createTarget({x: target.x, y: target.y}));
  });
};
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: #f1f5f9;
}
</style>