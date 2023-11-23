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

const { cargos } = useCargoStore()

</script>

<style scoped></style>