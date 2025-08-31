<template>
  <div 
    class="w-[32px] h-[32px] border border-gray-300 select-none relative transition-colors duration-150 ease-in-out"
    :class="{
      'bg-gray-100 hover:bg-gray-200': map[props.y][props.x] === MapTile.EMPTY,
      'bg-amber-50 hover:bg-amber-100': map[props.y][props.x] === MapTile.FLOOR,
      'bg-gray-800 hover:bg-gray-900': map[props.y][props.x] === MapTile.WALL,
    }"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
  >
    <template v-if="map[props.y][props.x] === MapTile.WALL">
      <img :src="wall" alt="wall" draggable="false" class="w-full h-full object-contain">
    </template>
    <template v-else-if="map[props.y][props.x] === MapTile.FLOOR">
      <img :src="floor" alt="floor" draggable="false" class="w-full h-full object-contain">
    </template>
    <template v-else-if="map[props.y][props.x] === MapTile.EMPTY">
      <img :src="empty" alt="empty" draggable="false" class="w-full h-full object-contain opacity-50">
    </template>
    <div v-else class="bg-red-500 w-[32px] h-[32px]"></div>
  </div>
</template>

<script lang="ts" setup>
import wall from '../../assets/wall.png'
import floor from '../../assets/floor.png'
import empty from '../../assets/empty.png'
import { MapTile } from "@/store/game/map.ts";
import { useMapEditorStore } from "@/store/editor/mapEditor.ts";
import { useEditElementStore } from "@/store/editor/editElement.ts";
import { useDrag } from "@/composables/useDrag.ts";

interface Props {
  x: number;
  y: number;
}

const { map } = useMapEditorStore();
const { getCurrentSelectedEditElement } = useEditElementStore();
const { startDrag, stopDrag, isDragging } = useDrag()

const props = defineProps<Props>();

const handleClick = () => {
  getCurrentSelectedEditElement()?.execute(props);
}

const handleMouseUp = () => {
  stopDrag();
  window.removeEventListener("mouseup",handleMouseUp);
}

const handleMouseDown = () => {
  startDrag();
  window.addEventListener("mouseup",handleMouseUp);
}

const handleMouseMove = () => {
  if (isDragging() && getCurrentSelectedEditElement()?.canDrag) {
    getCurrentSelectedEditElement()?.execute(props);
  }
}
</script>

<style scoped></style>