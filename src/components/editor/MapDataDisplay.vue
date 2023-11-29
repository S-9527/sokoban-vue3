<template>
  <div class="flex-auto">
    <div>地图 json 显示区域</div>
    <textarea rows="10" cols="10" readonly>{{ gameData }}</textarea>
  </div>
</template>

<script setup lang="ts">
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";
import {useEditTargetStore} from "@/store/editor/editTarget.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {computed} from "vue";
import {removeIdAttribute} from "@/utils/id.ts";

const { player } = useEditPlayerStore();
const { cargos } = useEditCargoStore();
const { targets } = useEditTargetStore();
const { map } = useMapEditorStore();

const gameData = computed(() => {
  return {
    map,
    player,
    cargos: removeIdAttribute(cargos),
    targets: removeIdAttribute(targets)
  };
});
</script>

<style scoped></style>