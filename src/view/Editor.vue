<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">地图编辑器</h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">地图:</h2>
          <div class="relative overflow-hidden">
            <MapEditor></MapEditor>
            <PlayerEditor></PlayerEditor>
            <template v-for="cargo in cargos" :key="cargo.id">
              <CargoEditor :cargo="cargo"></CargoEditor>
            </template>
            <template v-for="target in targets" :key="target.id">
              <TargetEditor :target="target"></TargetEditor>
            </template>
          </div>
        </div>
        <div class="lg:w-1/3 space-y-6">
          <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">编辑元素</h2>
            <EditElementView></EditElementView>
          </div>
          <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Map Data</h2>
            <MapDataDisplay></MapDataDisplay>
          </div>
        </div>
      </div>
    </main>
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