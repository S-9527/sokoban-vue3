<template>
  <div class="m-2 space-y-2">
    <div>row: <input type="text" class="border border-blue-50" v-model="row" /></div>
    <div>col: <input type="text" class="border border-blue-50" v-model="col" /></div>
  </div>

  <div class="flex space-x-2 m-2">
    <EditElement :edit-element="playerEditElement"></EditElement>
    <EditElement :edit-element="wallEditElement"></EditElement>
    <EditElement :edit-element="floorEditElement"></EditElement>
    <EditElement :edit-element="cargoEditElement"></EditElement>
    <EditElement :edit-element="targetEditElement"></EditElement>
  </div>

  <div>当前选择的: {{ selectedEditElementName }}</div>
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
</script>

<style scoped></style>