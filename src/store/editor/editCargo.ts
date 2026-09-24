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
        updateCargoOnTargetStatus(cargo);
    }

    function updateCargoOnTargetStatus(cargo: EditCargo) {
        const targetStore = useEditTargetStore();
        cargo.onTarget = targetStore.targets.some(target =>
            target.x === cargo.x && target.y === cargo.y && target.visible
        );
    }

    // 目标点变化时统一刷新所有箱子；store 级单个 watcher，
    // 避免每个箱子各挂一个无法停止的 watcher
    watch(() => useEditTargetStore().targets, () => {
        cargos.forEach(cargo => updateCargoOnTargetStatus(cargo));
    }, { deep: true });

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