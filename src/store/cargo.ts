import {defineStore} from "pinia";
import {reactive} from "vue";
import {Position} from "../composables/usePosition.ts";
import {useMapStore} from "./map.ts";

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

        return true;
    }

    return {
        addCargo,
        createCargo,
        findCargo,
        moveCargo,
        cargos
    }
})