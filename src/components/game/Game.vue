<template>
  <Map></Map>
  <template v-for="target in targets">
    <Target :x="target.x" :y="target.y"></Target>
  </template>
  <Player></Player>
  <template v-for="cargo in cargos" :key="cargo.id">
    <Cargo :cargo="cargo"></Cargo>
  </template>
  <div v-if="game.isGameCompleted">
    <button class="bg-red-500" @click="handleToNextLevel">下一关</button>
  </div>
</template>

<script lang="ts" setup>
import Map from "./Map.vue";
import Player from "./Player.vue";
import Cargo from "./Cargo.vue";
import Target from "./Target.vue";
import { useCargoStore } from '@/store/cargo.ts'
import { useTargetStore } from "@/store/target.ts";
import { useGameStore } from "@/store/game.ts";
import { gameData } from "@/data";

const { game,setupGame,toNextLevel } = useGameStore();
const { cargos } = useCargoStore();
const { targets } = useTargetStore();

setupGame(gameData)

const handleToNextLevel = () => {
  toNextLevel();
}

</script>

<style scoped></style>