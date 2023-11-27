import { computed } from "vue";

export interface Position {
    x: number
    y: number
}

export const STEP_GAME:number = 32
export const STEP_EDIT:number = 34
export function usePosition (pos: Position, step: number = STEP_GAME) {

    const position = computed(()=> {
        return {
            left: pos.x * step + "px",
            top: pos.y * step + "px"
        }
    })

    return { position }
}