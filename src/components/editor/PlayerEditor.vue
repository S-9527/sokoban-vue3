<template>
  <div class="absolute border border-blue-400" :style="position">
    <img :src="keeper" alt="keeper">
  </div>
</template>

<script setup lang="ts">
import keeper from '../../assets/keeper.png'
import { STEP_EDIT, usePosition } from "@/composables/usePosition.ts";
import { useEditPlayerStore } from "@/store/editor/editPlayer.ts";

const { player } = useEditPlayerStore();

const { position } = usePosition(player,STEP_EDIT)

</script>

<style scoped></style>