<template>
  <div class="absolute" :style="position" @dblclick="handleDbClick">
    <img :src="target" alt="target" draggable="false">
  </div>
</template>

<script setup lang="ts">
import target from '../../assets/target.png'
import {usePosition} from "@/composables/usePosition.ts";
import {EditTarget, useEditTargetStore} from "@/store/editor/editTarget.ts";

interface Props {
  target: EditTarget
}

const props = defineProps<Props>()

const { position } = usePosition(props.target)
const { removeTarget } = useEditTargetStore();

const handleDbClick = () => {
  removeTarget(props.target)
}

</script>

<style scoped></style>