<template>
  <Map></Map>
  <Player></Player>
  <template v-for="cargo in cargos">
    <Cargo :x="cargo.x" :y="cargo.y"></Cargo>
  </template>
</template>

<script lang="ts" setup>
import Map from "./Map.vue";
import Player from "./Player.vue";
import Cargo from "./Cargo.vue";
import { useCargoStore } from '../../store/cargo.ts'

const { cargos,addCargo,createCargo } = useCargoStore()

addCargo(createCargo({ x: 2, y: 2 }));
addCargo(createCargo({ x: 3, y: 3 }));

</script>

<style scoped></style>