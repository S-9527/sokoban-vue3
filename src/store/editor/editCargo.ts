import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import { generateId } from "@/utils/id.ts";
import { useEditTargetStore } from "@/store/editor/editTarget.ts";

export interface EditCargo {
    x: number;
    y: number;
    id: number;
    onTarget: boolean
}

export const useEditCargoStore = defineStore('edit-cargo', () => {
    const cargos = reactive<EditCargo[]>([]);

    function createCargo({ x, y }: { x: number, y: number }): EditCargo {
        return { id: generateId(), x, y, onTarget: false }
    }

    function addCargo(cargo: EditCargo) {
        cargos.push(cargo);
        // 添加监听器来检测目标点状态变化
        watch(() => useEditTargetStore().targets, () => {
            updateCargoOnTargetStatus(cargo);
        }, { deep: true });
    }

    function updateCargoOnTargetStatus(cargo: EditCargo) {
        const targetStore = useEditTargetStore();
        cargo.onTarget = targetStore.targets.some(target =>
            target.x === cargo.x && target.y === cargo.y && target.visible
        );
    }

    function modifyCargo({ x, y }: { x: number, y: number }) {
        const cargo: EditCargo =  { id: generateId(), x, y, onTarget: false }
        cargos.forEach(c => c.x === cargo.x && c.y === cargo.y && Object.assign(c, cargo))
    }

    function removeCargo(cargo: EditCargo) {
        cargos.splice(cargos.indexOf(cargo), 1)
    }

    return {
        addCargo,
        createCargo,
        modifyCargo,
        removeCargo,
        updateCargoOnTargetStatus,
        cargos
    }
})