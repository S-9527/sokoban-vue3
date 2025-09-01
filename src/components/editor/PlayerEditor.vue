<template>
  <div class="absolute" :style="position">
    <img :src="keeper" alt="keeper" class="block size-8">
    <div v-if="isOnTarget" class="absolute inset-0 border-2 border-green-500 rounded-sm pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import keeper from '../../assets/keeper.png'
import { usePosition } from "@/composables/usePosition.ts";
import { EditTarget, useEditTargetStore } from "@/store/editor/editTarget.ts";
import { computed } from "vue";
import { type EditPlayer } from "@/store/editor/editPlayer.ts";

interface Props {
  player: EditPlayer;
}

const props = defineProps<Props>();

const { position } = usePosition(props.player);
const { targets } = useEditTargetStore();

// 计算玩家是否在目标点上
const isOnTarget = computed(() => {
  return targets.some((target: EditTarget) => target.x === props.player.x && target.y === props.player.y);
});

</script>

<style scoped></style>