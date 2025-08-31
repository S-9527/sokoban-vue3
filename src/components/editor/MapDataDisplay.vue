<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="gameData" class="block text-sm font-medium text-gray-700">Game Data</label>
      <textarea
          id="gameData"
          v-model="gameDataJson"
          rows="10"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="在此处输入或编辑JSON格式的地图数据"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <button @click="importFromJson" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        从JSON导入
      </button>
      <button @click="exportToJson" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        导出为JSON
      </button>
    </div>

    <button @click="exportToImage"
            class="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
      导出为图片
    </button>

    <!-- 当前地图状态信息 -->
    <div class="text-sm text-gray-700 grid grid-cols-2 gap-1">
      <p>当前地图: {{ map.length }}行 x {{ map[0]?.length || 0 }}列</p>
      <p>玩家位置: ({{ player.x }}, {{ player.y }})</p>
      <p>箱子数量: {{ cargos.length }}</p>
      <p>目标点数量: {{ targets.length }}</p>
    </div>

    <!-- 图片预览模态框 -->
    <Teleport to="body">
      <div v-if="imagePreview" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900">地图图片预览</h3>
            <button @click="imagePreview = null" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="flex-1 p-6 flex justify-center items-center overflow-auto">
            <img :src="imagePreview || ''" alt="地图预览" class="max-w-full h-auto max-h-[60vh]"/>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex space-x-2">
            <a :href="imagePreview || ''" :download="`map-${Date.now()}.png`"
               class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-center">
              下载图片
            </a>
            <button @click="imagePreview = null"
                    class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded">
              关闭预览
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";
import {useEditTargetStore} from "@/store/editor/editTarget.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {computed, onMounted, ref} from "vue";
import {getCoordinates} from "@/utils/id.ts";
import {exportMapToImage} from "@/utils/imageSnapshot.ts";

const { player } = useEditPlayerStore();
const { cargos } = useEditCargoStore();
const { targets } = useEditTargetStore();
const { map, setRow, setCol, initMap } = useMapEditorStore();

// JSON数据和图片预览
const gameDataJson = ref('');
const imagePreview = ref<string | null>(null);

// 确保在组件挂载时初始化地图
onMounted(() => {
  initMap();
});

// 当前游戏数据
const currentGameData = computed(() => ({
  map,
  player,
  cargos: getCoordinates(cargos),
  targets: getCoordinates(targets)
}));

// 导出为JSON
const exportToJson = () => {
  gameDataJson.value = JSON.stringify(currentGameData.value, null, 2);
};

// 从JSON导入
const importFromJson = () => {
  if (!gameDataJson.value) {
    alert('请先输入JSON数据');
    return;
  }

  const data = JSON.parse(gameDataJson.value);
  console.log('导入的数据:', data);

  // 更新地图尺寸和数据
  if (data.map && Array.isArray(data.map)) {
    setRow(data.map.length);
    setCol(data.map[0].length);
    initMap(data.map.length, data.map[0].length);

    // 更新地图数据
    for (let i = 0; i < data.map.length; i++) {
      for (let j = 0; j < data.map[i].length; j++) {
        map[i][j] = data.map[i][j];
      }
    }
  }

  // 更新玩家位置
  if (data.player) {
    player.x = data.player.x;
    player.y = data.player.y;
  }

  // 更新箱子位置
  if (data.cargos && Array.isArray(data.cargos)) {
    cargos.splice(0, cargos.length);
    data.cargos.forEach((cargo: any) => {
      cargos.push({
        id: Date.now() + Math.random(),
        x: cargo.x,
        y: cargo.y,
        onTarget: false
      });
    });
  }

  // 更新目标点位置
  if (data.targets && Array.isArray(data.targets)) {
    targets.splice(0, targets.length);
    data.targets.forEach((target: any) => {
      targets.push({
        id: Date.now() + Math.random(),
        x: target.x,
        y: target.y
      });
    });
  }

  alert('数据导入成功');
};

// 导出为图片
const exportToImage = async () => {
  // 确保地图和玩家位置有效
  if (map.length === 0) {
    alert('地图数据为空，请先创建地图');
    return;
  }

  if (player.x < 0 || player.y < 0 || player.x >= map[0].length || player.y >= map.length) {
    alert('玩家位置无效，请确保已添加玩家');
    return;
  }

  // 构造地图数据并导出为图片
  const gameData = {
    map: JSON.parse(JSON.stringify(map)),
    player: {x: player.x, y: player.y},
    cargos: getCoordinates(cargos),
    targets: getCoordinates(targets)
  };

  imagePreview.value = await exportMapToImage(gameData);
};
</script>

<style scoped></style>