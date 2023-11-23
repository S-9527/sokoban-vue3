import {defineStore} from "pinia";
import {reactive} from "vue";
import {Position} from "../composables/usePosition.ts";

interface Cargo {
    x: number,
    y: number
}

export const useCargoStore = defineStore('cargo',() => {
    const cargos: Cargo[] = reactive([])

    function createCargo({x, y}: {x: number, y: number}):Cargo {
        return { x, y }
    }

    function addCargo(cargo: Cargo) {
        cargos.push(cargo)
    }

    function findCargo(position: Position):Cargo | undefined {
        return cargos.find(cargo => cargo.x === position.x && cargo.y === position.y)
    }

    return {
        addCargo,
        createCargo,
        findCargo,
        cargos
    }
})