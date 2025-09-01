<template>
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
          <TargetEditor v-for="target in targets" :key="target.id" :target="target"/>
          <CargoEditor v-for="cargo in cargos" :key="cargo.id" :cargo="cargo"/>
          <PlayerEditor :player="player"/>
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
</template>

<script lang="ts" setup>
import MapEditor from "@/components/editor/MapEditor.vue";
import PlayerEditor from "@/components/editor/PlayerEditor.vue";
import CargoEditor from "@/components/editor/CargoEditor.vue";
import TargetEditor from "@/components/editor/TargetEditor.vue";
import { type Map } from "@/store/game/map.ts";
import { type EditCargo } from "@/store/editor/editCargo.ts";
import { type EditTarget} from "@/store/editor/editTarget.ts";
import { type EditPlayer } from "@/store/editor/editPlayer.ts";

interface Props {
  map: Map;
  cargos: EditCargo[];
  targets: EditTarget[];
  player: EditPlayer;
}

defineProps<Props>();
</script>