<template>
  <div class="absolute" :style="position" v-show="visible" @dblclick="handleDblClick">
    <img :src="keeper" alt="keeper" class="block size-8">
  </div>
</template>

<script setup lang="ts">
import keeper from '../../assets/keeper.png'
import { usePosition } from "@/composables/usePosition.ts";
import { useEditPlayerStore } from "@/store/editor/editPlayer.ts";
import { toRefs } from "vue";

const { player, hidden } = useEditPlayerStore();
const { position } = usePosition(player);
const { visible } = toRefs(useEditPlayerStore())
function handleDblClick() {
  hidden()
}

</script>

<style scoped></style>