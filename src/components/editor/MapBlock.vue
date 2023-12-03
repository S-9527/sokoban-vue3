<template>
  <div class="w-[32px] h-[32px] bg-white border border-sky-500 select-none"
       @click="handleClick"
       @mousedown="handleMouseDown"
       @mousemove="handleMouseMove"
  >
    <template v-if="map[props.y][props.x] === MapTile.WALL">
      <img :src="wall" alt="wall" draggable="false">
    </template>
    <template v-else-if="map[props.y][props.x] === MapTile.FLOOR">
      <img :src="floor" alt="floor" draggable="false">
    </template>
  </div>
</template>

<script lang="ts" setup>
import wall from '../../assets/wall.png'
import floor from '../../assets/floor.png'
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {MapTile} from "@/store/game/map.ts";
import {useEditElementStore} from "@/store/editor/EditElement.ts";
import {useDrag} from "@/composables/useDrag.ts";

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