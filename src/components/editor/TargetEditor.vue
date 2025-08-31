<template>
  <div class="absolute" :style="position" @click="handleClick" @dblclick="handleDbClick">
    <img :src="target" alt="target" draggable="false" v-if="props.target.visible" class="size-8">
  </div>
</template>

<script setup lang="ts">
import target from '../../assets/target.png'
import {usePosition} from "@/composables/usePosition.ts";
import {type EditTarget, useEditTargetStore} from "@/store/editor/editTarget.ts";
import {cargoEditElement, playerEditElement, useEditElementStore} from "@/store/editor/editElement.ts";
import {watch} from "vue";
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";

interface Props {
  target: EditTarget
}

const props = defineProps<Props>()

const { position } = usePosition(props.target)
const { removeTarget, disableTarget, enableTarget } = useEditTargetStore();

const { getCurrentSelectedEditElement } = useEditElementStore();
const handleClick = () => {
  if (getCurrentSelectedEditElement()?.name === cargoEditElement.name || getCurrentSelectedEditElement()?.name === playerEditElement.name) {
    disableTarget(props.target.x, props.target.y);
    getCurrentSelectedEditElement()?.execute({ x: props.target.x, y:props.target.y });
  }
}

const handleDbClick = () => {
  removeTarget(props.target)
}

const { player } = useEditPlayerStore();
watch(() => player, (newPlayer) => {
  if (!props.target.visible && (newPlayer.x !== props.target.x || newPlayer.y !== props.target.y)) {
    enableTarget(props.target.x, props.target.y);
  }
}, { deep: true })

</script>

<style scoped></style>