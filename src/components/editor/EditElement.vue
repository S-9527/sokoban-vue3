<template>
  <div 
    @click="handleClick"
    class="flex flex-col items-center p-2 rounded-md transition-all duration-200 ease-in-out"
  >
    <div class="w-10 h-10 flex items-center justify-center mb-1">
      <img :src="editElement.img" :alt="editElement.name" class="block max-w-full max-h-full">
    </div>
    <span class="text-xs text-gray-700 font-medium">{{ editElement.name }}</span>
    <div v-if="editElement.canDrag" class="mt-1">
      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        拖拽
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type EditElement, useEditElementStore } from "@/store/editor/editElement.ts";

interface Props {
  editElement: EditElement
}

const { setCurrentSelectedEditElement } = useEditElementStore()

const props = defineProps<Props>()

const handleClick = () => {
  setCurrentSelectedEditElement(props.editElement)
}
</script>

<style scoped></style>