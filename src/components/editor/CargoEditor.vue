<template>
  <div class="absolute" :style="position" @dblclick="handleDblClick">
    <img :src="cargo.onTarget ? CargoOnTarget : _Cargo" alt="cargo" draggable="false" class="size-8">
  </div>
</template>

<script lang="ts" setup>
import _Cargo from "../../assets/cargo.png";
import CargoOnTarget from '../../assets/cargo_on_target.png'
import {type EditCargo, useEditCargoStore} from "@/store/editor/editCargo.ts";
import { usePosition } from "@/composables/usePosition.ts";

interface Props {
  cargo: EditCargo;
}

const props = defineProps<Props>();

const { position } = usePosition(props.cargo)
const { removeCargo } = useEditCargoStore();

const handleDblClick = () => {
  removeCargo(props.cargo);
};
</script>

<style scoped></style>