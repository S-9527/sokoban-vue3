<template>
  <div class="absolute" :style="position" @dblclick="handleDblClick">
    <img :src="cargo.onTarget ? CargoOnTarget : _Cargo" alt="cargo" draggable="false" class="size-8">
  </div>
</template>

<script lang="ts" setup>
import _Cargo from "../../assets/cargo.png";
import CargoOnTarget from '../../assets/cargo_on_target.png'
import {type EditCargo, useEditCargoStore} from "@/store/editor/editCargo.ts";
import { usePosition } from "@/composables/usePosition.ts";
import { useEditTargetStore } from "@/store/editor/editTarget.ts";
import { onMounted, watch } from "vue";

interface Props {
  cargo: EditCargo;
}

const props = defineProps<Props>();

const { position } = usePosition(props.cargo)
const { removeCargo } = useEditCargoStore();
const { targets } = useEditTargetStore();

// 检查箱子是否在目标点上
const checkIfOnTarget = () => {
  // 更新箱子的onTarget状态
  props.cargo.onTarget = targets.some(target =>
      target.x === props.cargo.x && target.y === props.cargo.y && target.visible
  );
};

const handleDblClick = () => {
  removeCargo(props.cargo);
};

// 监听目标点变化，更新箱子的onTarget状态
watch(() => targets, () => {
  checkIfOnTarget();
}, { deep: true });

// 组件挂载时检查一次
onMounted(() => {
  checkIfOnTarget();
});

// 监听箱子位置变化
watch(() => props.cargo, () => {
  checkIfOnTarget();
}, { deep: true });

</script>

<style scoped></style>