<template>
  <div class="absolute" :style="position">
    <img :src="keeper" alt="keeper">
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import keeper from "../../assets/keeper.png";
import { handleKeyup } from "../event/event.ts";
import { usePlayerStore } from "@/store/game/player.ts";
import { usePosition } from "@/composables/usePosition.ts";

const { player } = usePlayerStore()
const { position } = usePosition(player)

onMounted(() => {
  window.addEventListener("keyup", handleKeyup);
});

onUnmounted(() => {
  window.removeEventListener("keyup", handleKeyup);
});

</script>

<style scoped></style>