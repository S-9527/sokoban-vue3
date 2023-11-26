<template>
  <div class="border border-white" @click="handleClick">
    <template v-if="map[props.y][props.x] === MapTile.WALL">
      <img :src="wall" alt="wall">
    </template>
    <template v-else-if="map[props.y][props.x] === MapTile.FLOOR">
      <img :src="floor" alt="floor">
    </template>
  </div>
</template>

<script lang="ts" setup>
import wall from '../../assets/wall.png'
import floor from '../../assets/floor.png'
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {MapTile} from "@/store/map.ts";
import {useEditElementStore} from "@/store/editor/EditElement.ts";

interface Props {
  x: number;
  y: number;
}

const { map } = useMapEditorStore();
const { getCurrentSelectedEditElement } = useEditElementStore();

const props = defineProps<Props>();

const handleClick = () => {
  getCurrentSelectedEditElement().execute(props);
}
</script>

<style scoped></style>