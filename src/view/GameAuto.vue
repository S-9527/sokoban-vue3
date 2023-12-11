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
import Map from "@/components/game/Map.vue";
import Player from "@/components/game/Player.vue";
import Cargo from "@/components/game/Cargo.vue";
import Target from "@/components/game/Target.vue";
import { useCargoStore } from '@/store/game/cargo.ts'
import { useTargetStore } from "@/store/game/target.ts";
import { useGameStore } from "@/store/game/game.ts";
import { gameData } from "@/data";
import { useRobot } from "@/composables/useRobot.ts";

const { game,setupGame,toNextLevel } = useGameStore();
const { cargos } = useCargoStore();
const { targets } = useTargetStore();
const { solve } = useRobot();

setupGame(gameData)

setTimeout(solve,1000);

const handleToNextLevel = () => {
  setTimeout(solve,1000);
  toNextLevel();
}

</script>

<style scoped></style>