import { computed } from "vue";

export interface Position {
    x: number
    y: number
}

const STEP:number = 32
export function usePosition (pos: Position) {

    const position = computed(()=> {
        return {
            left: pos.x * STEP + "px",
            top: pos.y * STEP + "px"
        }
    })

    return { position }
}