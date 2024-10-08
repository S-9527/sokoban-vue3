import {Position} from "@/composables/usePosition.ts";
import {MapTile} from "@/store/game/map.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {defineStore} from "pinia";

import wall from '../../assets/wall.png'
import floor from '../../assets/floor.png'
import keeper from '../../assets/keeper.png'
import cargo from '../../assets/cargo.png'
import target from '../../assets/target.png'
import {ref, toRefs} from "vue";
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";
import {useEditTargetStore} from "@/store/editor/editTarget.ts";

export interface EditElement {
    name: string,
    img: string,
    canDrag: boolean,
    execute: (position: Position) => void
}

export const wallEditElement: EditElement = {
    name: '墙',
    img: wall,
    canDrag: true,
    execute: (position) => {
        const { map } = useMapEditorStore();
        map[position.y][position.x] = MapTile.WALL;
    }
}

export const floorEditElement: EditElement = {
    name: '地板',
    img: floor,
    canDrag: true,
    execute: (position) => {
        const { map } = useMapEditorStore();
        map[position.y][position.x] = MapTile.FLOOR;
    }
}

export const playerEditElement: EditElement = {
    name: '玩家',
    img: keeper,
    canDrag: false,
    execute: (position) => {
        const { player } = useEditPlayerStore();
        const { visible} = toRefs(useEditPlayerStore());
        player.x = position.x;
        player.y = position.y;

        visible.value = true;

        unset(position,MapTile.FLOOR)
    }
}

export const cargoEditElement: EditElement = {
    name: '箱子',
    img: cargo,
    canDrag: false,
    execute: (position) => {
        const { addCargo, createCargo, modifyCargo } = useEditCargoStore();
        const { targets} = useEditTargetStore();
        addCargo(createCargo({ x: position.x, y: position.y }));

        targets.forEach(target => {
            if (target.x === position.x && target.y === position.y) {
                modifyCargo(target);
            }
        })

        unset(position,MapTile.FLOOR)
    }
}

export const targetEditElement: EditElement = {
    name: '放置点',
    img: target,
    canDrag: false,
    execute: (position) => {
        const {addTarget, createTarget} = useEditTargetStore();
        addTarget(createTarget({ x: position.x, y: position.y }));

        unset(position,MapTile.FLOOR)
    }
}

function unset(position: Position, element: MapTile) {
    const { map } = useMapEditorStore();
    map[position.y][position.x] = element;
}


export const useEditElementStore = defineStore('edit-element', () => {
    let currentSelectedEditElement = ref<EditElement | undefined>();

    function getCurrentSelectedEditElement(): EditElement | undefined {
        return currentSelectedEditElement.value;
    }

    function setCurrentSelectedEditElement(editElement: EditElement) {
        currentSelectedEditElement.value = editElement;
    }

    return {
        getCurrentSelectedEditElement,
        setCurrentSelectedEditElement
    }
})