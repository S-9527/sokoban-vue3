<template>
  <div @click="handleClick">
    <img :src="editElement.img" alt="selected">
  </div>
</template>

<script lang="ts" setup>
import { type EditElement, useEditElementStore } from "@/store/editor/EditElement.ts";

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