<template>
  <div>
    <div v-for="(row, i) in map" class="flex">
      <div v-for="(col, j) in map[i]">
        <template v-if="map[i][j] === MapTile.WALL">
          <img :src="wall" alt="wall"/>
        </template>
        <template v-else-if="map[i][j] === MapTile.FLOOR">
          <img :src="floor" alt="floor"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import floor from "../../assets/floor.png";
import wall from "../../assets/wall.png";
import { useMapStore, MapTile } from "../../store/map";
const { map } = useMapStore();
</script>

<style scoped></style>