<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="row" class="block text-sm font-medium text-gray-700">行</label>
        <input type="number" id="row" v-model="row" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label for="col" class="block text-sm font-medium text-gray-700">列</label>
        <input type="number" id="col" v-model="col" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">选择元素</label>
      <div class="grid grid-cols-5 gap-2">
        <EditElement v-for="element in editElements" :key="element.name" :edit-element="element" />
      </div>
    </div>

    <div class="text-sm text-gray-600">
      当前选择的: <span class="font-medium">{{ selectedEditElementName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditElement from "./EditElement.vue";
import {
  cargoEditElement,
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
  return getCurrentSelectedEditElement()?.name || "没有选中";
})

const editElements = [playerEditElement, wallEditElement, floorEditElement, cargoEditElement, targetEditElement];
</script>

<style scoped></style>