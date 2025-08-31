<template>
  <div class="space-y-6">
    <!-- 地图尺寸设置 -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-md font-medium text-gray-900 mb-3">地图尺寸</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="row" class="block text-sm font-medium text-gray-700 mb-1">行数</label>
          <input 
            type="number" 
            id="row" 
            v-model="row" 
            min="1"
            max="50"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
            placeholder="行数"
          />
        </div>
        <div>
          <label for="col" class="block text-sm font-medium text-gray-700 mb-1">列数</label>
          <input 
            type="number" 
            id="col" 
            v-model="col" 
            min="1"
            max="50"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
            placeholder="列数"
          />
        </div>
      </div>
      <p class="mt-2 text-xs text-gray-500">建议尺寸：5-20行/列</p>
    </div>

    <!-- 元素选择区 -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-md font-medium text-gray-900 mb-3">选择元素</h3>
      <div class="grid grid-cols-3 gap-3">
        <EditElement 
          v-for="element in editElements" 
          :key="element.name" 
          :edit-element="element"
          :class="{
            'ring-2 ring-blue-500 ring-offset-1': selectedEditElementName === element.name,
            'opacity-70 hover:opacity-100': selectedEditElementName !== element.name
          }"
          class="transition-all duration-150 ease-in-out cursor-pointer rounded-md p-2 bg-white hover:shadow-sm"
        />
      </div>
    </div>

    <!-- 当前选中状态 -->
    <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <div class="flex items-center">
        <span class="text-sm font-medium text-blue-800 mr-2">当前选中:</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ selectedEditElementName }}
        </span>
      </div>
      <div v-if="currentElementDescription" class="mt-2 text-xs text-blue-700">
        {{ currentElementDescription }}
      </div>
    </div>

    <!-- 操作提示 -->
    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
      <h3 class="text-sm font-medium text-yellow-800 mb-2">操作提示</h3>
      <ul class="text-xs text-yellow-700 space-y-1">
        <li>• 单击地图放置元素</li>
        <li>• 按住鼠标拖拽放置可拖拽元素</li>
        <li>• 双击元素可删除（玩家、箱子、目标点）</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditElement from "./EditElement.vue";
import {
  cargoEditElement,
  emptyEditElement,
  floorEditElement,
  playerEditElement, targetEditElement,
  useEditElementStore,
  wallEditElement
} from "@/store/editor/editElement.ts";
import { useMapEditorStore } from "@/store/editor/mapEditor.ts";
import { computed, toRefs, watchEffect } from "vue";

const { initMap, updateMapRow, updateMapCol } = useMapEditorStore();
const { row, col } = toRefs(useMapEditorStore())
const { getCurrentSelectedEditElement } = useEditElementStore();

initMap();

watchEffect(() => {
  if (!row.value) return;
  updateMapRow();
})

watchEffect(() => {
  if (!col.value) return;
  updateMapCol();
})

const selectedEditElementName = computed(() => {
  return getCurrentSelectedEditElement()?.name || "未选择";
})

const currentElementDescription = computed(() => {
  const element = getCurrentSelectedEditElement();
  if (!element) return "";
  
  switch (element.name) {
    case "墙":
      return "不可通过的障碍物，可拖拽放置";
    case "地板":
      return "可行走的区域，可拖拽放置";
    case "空白":
      return "地图边界外的区域，可拖拽放置";
    case "玩家":
      return "游戏主角，地图中只能有一个";
    case "箱子":
      return "可推动的物品，可放置多个";
    case "放置点":
      return "箱子的目标位置，可放置多个";
    default:
      return "";
  }
});

const editElements = [playerEditElement, wallEditElement, floorEditElement, emptyEditElement, cargoEditElement, targetEditElement];
</script>

<style scoped></style>