import {Position} from "@/composables/usePosition.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {MapTile} from "@/store/map.ts";
import {defineStore} from "pinia";

import wall from '../../assets/wall.png'
import floor from '../../assets/floor.png'
import keeper from '../../assets/keeper.png'
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";

export interface EditElement {
    img: string,
    execute: (position: Position) => void
}

export const wallEditElement: EditElement = {
    img: wall,
    execute: (position) => {
        const { map } = useMapEditorStore();
        map[position.y][position.x] = MapTile.WALL;
    }
}

export const floorEditElement: EditElement = {
    img: floor,
    execute: (position) => {
        const { map } = useMapEditorStore();
        map[position.y][position.x] = MapTile.FLOOR;
    }
}

export const playerEditElement: EditElement = {
    img: keeper,
    execute: (position) => {
        const { player } = useEditPlayerStore();
        player.x = position.x;
        player.y = position.y;
    }
}


export const useEditElementStore = defineStore('edit-element', () => {
    let currentSelectedEditElement: EditElement;

    function getCurrentSelectedEditElement(): EditElement {
        return currentSelectedEditElement;
    }

    function setCurrentSelectedEditElement(editElement: EditElement) {
        currentSelectedEditElement = editElement;
    }

    return {
        getCurrentSelectedEditElement,
        setCurrentSelectedEditElement
    }
})