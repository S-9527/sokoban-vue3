<template>
  <div class="space-y-2">
    <label for="gameData" class="block text-sm font-medium text-gray-700">Game Data</label>
    <textarea
        id="gameData"
        :value="JSON.stringify(gameData, null, 2)"
        rows="10"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        readonly
    ></textarea>
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
    map, player,
    cargos: getCoordinates(cargos),
    targets: getCoordinates(targets)
  };
});
</script>

<style scoped></style>