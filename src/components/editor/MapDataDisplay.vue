<template>
  <div class="flex-auto m-2">
    <textarea rows="10" cols="10" readonly>{{ gameData }}</textarea>
  </div>
</template>

<script setup lang="ts">
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";
import {useEditTargetStore} from "@/store/editor/editTarget.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {computed} from "vue";
import {getCoordinates} from "@/utils/id.ts";

const { player } = useEditPlayerStore();
const { cargos } = useEditCargoStore();
const { targets } = useEditTargetStore();
const { map } = useMapEditorStore();

const gameData = computed(() => {
  return {
    map,
    player,
    cargos: getCoordinates(cargos),
    targets: getCoordinates(targets)
  };
});
</script>

<style scoped></style>