import {defineStore} from "pinia";
import {reactive} from "vue";
import {Position} from "@/composables/usePosition.ts";
import {useMapStore} from "./map.ts";
import {useTargetStore} from "./target.ts";
import {generateId} from "@/utils/id.ts";

export interface Cargo {
    id: number,
    x: number,
    y: number,
    onTarget: boolean
}

export const useCargoStore = defineStore('cargo',() => {
    const cargos: Cargo[] = reactive([])

    function createCargo({x, y}: {x: number, y: number}):Cargo {
        return { id: generateId(), x, y, onTarget: false }
    }

    function addCargo(cargo: Cargo) {
        cargos.push(cargo)
    }

    function modifyCargo({ x, y }: { x: number, y: number }) {
        const cargo: Cargo =  { id: generateId(), x, y, onTarget: true }
        cargos.forEach(c => c.x === cargo.x && c.y === cargo.y && Object.assign(c, cargo))
    }

    function findCargo(position: Position):Cargo | undefined {
        return cargos.find(cargo => cargo.x === position.x && cargo.y === position.y)
    }

    function moveCargo(cargo: Cargo, dx: number, dy: number): boolean {
        const { isWall } = useMapStore();
        const position: Position = {
            x: cargo.x + dx,
            y: cargo.y + dy
        }

        if (isWall(position)) return false;
        if (findCargo(position)) return false;

        cargo.x += dx;
        cargo.y += dy;

        detectionTarget(cargo);

        return true;
    }

    function detectionTarget(cargo: Cargo) {
        const { findTarget } = useTargetStore();
        cargo.onTarget = !!findTarget(cargo);
    }

    function cleanAllCargos() {
        cargos.splice(0, cargos.length);
    }

    return {
        cleanAllCargos,
        addCargo,
        createCargo,
        findCargo,
        modifyCargo,
        moveCargo,
        cargos
    }
})