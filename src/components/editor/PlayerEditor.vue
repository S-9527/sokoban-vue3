<template>
  <div class="absolute" :style="position">
    <img :src="keeper" alt="keeper" class="block">
  </div>
</template>

<script setup lang="ts">
import keeper from '../../assets/keeper.png'
import { usePosition } from "@/composables/usePosition.ts";
import { useEditPlayerStore } from "@/store/editor/editPlayer.ts";

const { player } = useEditPlayerStore();

const { position } = usePosition(player);

</script>

<style scoped></style>