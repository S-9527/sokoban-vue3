<template>
  <div class="container">
    <div class="flex">
      <div class="w-4/6 bg-pink-400">
        <MapEditor></MapEditor>
        <PlayerEditor></PlayerEditor>
        <template v-for="cargo in cargos" :key="cargo.id">
          <CargoEditor :cargo="cargo"></CargoEditor>
        </template>
      </div>
      <div>数据展示区</div>
      <div><EditElementView></EditElementView></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapEditor from "@/components/editor/MapEditor.vue";
import EditElementView from "@/components/editor/EditElementView.vue";
import PlayerEditor from "@/components/editor/PlayerEditor.vue";
import CargoEditor from "@/components/editor/CargoEditor.vue";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";

const { cargos } = useEditCargoStore();
</script>

<style scoped></style>