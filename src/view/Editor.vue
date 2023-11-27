<template>
  <div class="container">
    <div class="flex">
      <div class="w-4/6 bg-pink-400">
        <MapEditor></MapEditor>
        <PlayerEditor></PlayerEditor>
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
</script>

<style scoped></style>