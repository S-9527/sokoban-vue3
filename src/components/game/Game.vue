<template>
  <Map></Map>
  <template v-for="target in targets">
    <Target :x="target.x" :y="target.y"></Target>
  </template>
  <Player></Player>
  <template v-for="cargo in cargos">
    <Cargo :cargo="cargo"></Cargo>
  </template>
  <div v-if="game.isGameCompleted">
    <button class="bg-red-500">下一关</button>
  </div>
</template>

<script lang="ts" setup>
import Map from "./Map.vue";
import Player from "./Player.vue";
import Cargo from "./Cargo.vue";
import Target from "./Target.vue";
import { useCargoStore } from '../../store/cargo.ts'
import { useTargetStore } from "../../store/target.ts";
import { useGameStore } from "../../store/game.ts";
import { levelGameData } from "../../data";

const { game,setupGame } = useGameStore();
const { cargos } = useCargoStore();
const { targets } = useTargetStore();

setupGame(levelGameData)

</script>

<style scoped></style>