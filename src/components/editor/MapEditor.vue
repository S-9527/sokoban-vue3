<template>
  <div class="map-container">
    <div v-for="(_,i) in map" class="flex">
      <div v-for="(_, j) in map[i]">
        <MapBlock :x="j" :y="i"></MapBlock>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapBlock from "./MapBlock.vue";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";

const { map } = useMapEditorStore();

</script>

<style scoped></style>
