<template>
  <div class="absolute" :style="position">
    <img :src="target" alt="" />
  </div>
</template>

<script lang="ts" setup>
import target from "../../assets/target.png";
import { usePosition } from "../../composables/usePosition";

interface Props {
  x: number;
  y: number;
}

const props = defineProps<Props>();

const { position } = usePosition(props);
</script>

<style scoped></style>