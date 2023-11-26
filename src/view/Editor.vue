<template>
  <div class="container">
    <div class="flex">
      <div class="w-4/6 bg-pink-400">
        <MapEditor></MapEditor>
      </div>
      <div>数据展示区</div>
      <div><EditElementView></EditElementView></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapEditor from "@/components/editor/MapEditor.vue";
import EditElementView from "@/components/editor/EditElementView.vue";
</script>

<style scoped></style>