<template>
  <div class="container">
    <div class="flex">
      <div class="w-4/6 bg-pink-400">
        <MapEditor></MapEditor>
      </div>
      <div>数据展示区</div>
      <div>元素选择区</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapEditor from "@/components/editor/MapEditor.vue";
</script>

<style scoped></style>