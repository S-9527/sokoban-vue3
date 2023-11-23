<template>
  <div class="absolute" :style="position">
    <img :src="keeper" alt="keeper">
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted} from "vue";
import keeper from "../../assets/keeper.png";
import { usePlayerStore } from "../../store/player.ts";
import {handleKeyup} from "../event/event.ts";

const { position } = usePosition()

onMounted(() => {
  window.addEventListener("keyup", handleKeyup);
});

onUnmounted(() => {
  window.removeEventListener("keyup", handleKeyup);
});


function usePosition() {
  const { player } = usePlayerStore();

  const STEP = 32;
  const position = computed(() => {
    return {
      left: player.x * STEP + "px",
      top: player.y * STEP + "px"
    }
  })

  return { position }
}

</script>

<style scoped></style>