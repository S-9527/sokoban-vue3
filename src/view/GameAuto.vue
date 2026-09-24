<template>
  <div class="flex flex-col justify-center items-center h-screen">
    <div class="relative">
      <Map></Map>
      <template v-for="target in targets">
        <Target :x="target.x" :y="target.y"></Target>
      </template>
      <Player></Player>
      <template v-for="cargo in cargos" :key="cargo.id">
        <Cargo :cargo="cargo"></Cargo>
      </template>
      <div v-if="game.isGameCompleted" class="flex justify-center m-6">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="handleToNextLevel">下一关</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
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

const { solve, stopSolve } = useRobot();
setupGame(gameData)

let solveTimer: number | undefined;

onMounted(() => {
  solveTimer = window.setTimeout(solve, 1000);
});

// 离开页面时取消待执行的求解，并打断进行中的自动播放
onUnmounted(() => {
  if (solveTimer !== undefined) clearTimeout(solveTimer);
  stopSolve();
});

const handleToNextLevel = () => {
  toNextLevel();
  if (solveTimer !== undefined) clearTimeout(solveTimer);
  solveTimer = window.setTimeout(solve, 1000);
}

</script>

<style scoped></style>