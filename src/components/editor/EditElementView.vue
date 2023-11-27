<template>
  <h3>元素选择区</h3>
  <div class="m-2 space-y-2">
    <div>row: <input type="text" class="border border-blue-50" v-model="row" /></div>
    <div>col: <input type="text" class="border border-blue-50" v-model="col" /></div>
  </div>
  <div class="flex space-x-2 m-2">
    <h4>地图</h4>
    <EditElement :edit-element="wallEditElement"></EditElement>
    <EditElement :edit-element="floorEditElement"></EditElement>
  </div>

  <div class="flex">
    <h4>玩家</h4>
    <EditElement :edit-element="playerEditElement"></EditElement>
    <div class="bg-amber-400">当前选择的: {{ selectedEditElementName }}</div>
  </div>
</template>

<script setup lang="ts">
import EditElement from "./EditElement.vue";
import { floorEditElement, playerEditElement, useEditElementStore, wallEditElement } from "@/store/editor/EditElement.ts";
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
</script>

<style scoped></style>