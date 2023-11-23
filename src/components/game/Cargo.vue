<template>
  <div class="absolute" :style="position">
    <img :src="Cargo" alt="cargo">
  </div>
</template>

<script lang="ts" setup>
import Cargo from '../../assets/cargo.png'
import { usePosition } from "../../composables/usePosition.ts";

interface Props {
  x: number,
  y: number
}

const props = defineProps<Props>()

const { position } = usePosition(props)

</script>

<style scoped></style>