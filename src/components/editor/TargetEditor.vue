<template>
  <div class="absolute" :style="position" @click="handleClick" @dblclick="handleDbClick">
    <img :src="target" alt="target" draggable="false" v-if="visible" class="size-8">
  </div>
</template>

<script setup lang="ts">
import target from '../../assets/target.png'
import {usePosition} from "@/composables/usePosition.ts";
import {type EditTarget, useEditTargetStore} from "@/store/editor/editTarget.ts";
import {cargoEditElement, playerEditElement, useEditElementStore} from "@/store/editor/editElement.ts";
import {ref} from "vue";

interface Props {
  target: EditTarget
}

const props = defineProps<Props>()

const visible = ref(true)
const { position } = usePosition(props.target)
const { removeTarget } = useEditTargetStore();

const { getCurrentSelectedEditElement } = useEditElementStore();
const handleClick = () => {
  if (getCurrentSelectedEditElement()?.name === cargoEditElement.name || getCurrentSelectedEditElement()?.name === playerEditElement.name) {
    visible.value = false
    getCurrentSelectedEditElement()?.execute({ x: props.target.x, y:props.target.y });
  }
}

const handleDbClick = () => {
  removeTarget(props.target)
}

</script>

<style scoped></style>