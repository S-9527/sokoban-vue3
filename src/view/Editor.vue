<template>
  <div class="bg-white h-screen">
    <div class="flex">
      <MapEditor></MapEditor>
      <PlayerEditor></PlayerEditor>
        <template v-for="cargo in cargos" :key="cargo.id">
          <CargoEditor :cargo="cargo"></CargoEditor>
        </template>
        <template v-for="target in targets" :key="target.id">
          <TargetEditor :target="target"></TargetEditor>
        </template>
    <MapDataDisplay></MapDataDisplay>
    </div>
    <div><EditElementView></EditElementView></div>
  </div>
</template>

<script lang="ts" setup>
import MapEditor from "@/components/editor/MapEditor.vue";
import EditElementView from "@/components/editor/EditElementView.vue";
import PlayerEditor from "@/components/editor/PlayerEditor.vue";
import CargoEditor from "@/components/editor/CargoEditor.vue";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";
import {useEditTargetStore} from "@/store/editor/editTarget.ts";
import TargetEditor from "@/components/editor/TargetEditor.vue";
import MapDataDisplay from "@/components/editor/MapDataDisplay.vue";

const { cargos } = useEditCargoStore();
const { targets } = useEditTargetStore();
</script>

<style scoped></style>