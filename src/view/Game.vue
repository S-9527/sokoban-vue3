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
    </div>
    <div v-if="game.isGameCompleted" class="flex justify-center m-6">
      <button @click="handleToNextLevel" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">下一关</button>
    </div>
    <div v-if="isGameNotStarted" class="mt-4 text-red-500">
      加载地图数据失败
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Map from "@/components/game/Map.vue";
import Player from "@/components/game/Player.vue";
import Cargo from "@/components/game/Cargo.vue";
import Target from "@/components/game/Target.vue";
import { useCargoStore } from '@/store/game/cargo.ts'
import { useTargetStore } from "@/store/game/target.ts";
import { useGameStore } from "@/store/game/game.ts";
import { loadMapsFromImages } from "@/utils/mapLoader.ts";

const { game, setupGame, toNextLevel } = useGameStore();
const { cargos } = useCargoStore();
const { targets } = useTargetStore();

const isGameNotStarted = ref(false);

// 在组件挂载时加载地图数据
onMounted(async () => {
  const mapData = await loadMapsFromImages();
  if (handleGameNotStarted(mapData)) return;
  setupGame(mapData || []);
});

const handleToNextLevel = () => {
  toNextLevel();
}

const handleGameNotStarted = (mapData: any) => {
  isGameNotStarted.value = !mapData || mapData.length === 0;
  return isGameNotStarted.value;
}

</script>

<style scoped></style>