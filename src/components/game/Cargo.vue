<template>
  <div class="absolute" :style="position">
    <img :src="cargo.onTarget ? CargoOnTarget : _Cargo" alt="cargo">
  </div>
</template>

<script lang="ts" setup>
import _Cargo from '../../assets/cargo.png'
import { type Cargo } from '../../store/cargo'
import CargoOnTarget from '../../assets/cargo_on_target.png'
import { usePosition } from "../../composables/usePosition.ts";

interface Props {
  cargo: Cargo
}

const props = defineProps<Props>()

const { position } = usePosition(props.cargo)

</script>

<style scoped></style>