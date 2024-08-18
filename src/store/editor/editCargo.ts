import { defineStore } from "pinia";
import { reactive } from "vue";
import { generateId } from "@/utils/id.ts";
import { Cargo } from "@/store/game/cargo.ts";

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
        cargos.push(cargo)
    }

    function modifyCargo({ x, y }: { x: number, y: number }) {
        const cargo: Cargo =  { id: generateId(), x, y, onTarget: true }
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
        cargos
    }
})