<template>
  <div class="relative">
    <div v-for="row in map" class="flex">
      <div v-for="dot in row">
        <component :is="getElementComponent(dot)"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMapStore, MapTile } from "@/store/game/map.ts";
import { type Component } from "vue";
import Wall from "@/components/game/Wall.vue";
import Floor from "@/components/game/Floor.vue";
import Empty from "@/components/game/Empty.vue";

const { map } = useMapStore();

const mapElement: Record<MapTile, Component> = {
  [MapTile.WALL]: Wall,
  [MapTile.FLOOR]: Floor,
  [MapTile.EMPTY]: Empty
}

console.log(map)

function getElementComponent(element: MapTile){
  return mapElement[element];
}


</script>

<style scoped></style>