import {Position} from "@/composables/usePosition.ts";
import {MapTile} from "@/store/game/map.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";
import {defineStore} from "pinia";

import wall from '../../assets/wall.png'
import floor from '../../assets/floor.png'
import empty from '../../assets/empty.png'
import keeper from '../../assets/keeper.png'
import cargo from '../../assets/cargo.png'
import target from '../../assets/target.png'
import {ref} from "vue";
import {useEditPlayerStore} from "@/store/editor/editPlayer.ts";
import {useEditCargoStore} from "@/store/editor/editCargo.ts";
import {useEditTargetStore} from "@/store/editor/editTarget.ts";

export interface EditElement {
    name: string,
    description: string,
    img: string,
    canDrag: boolean,
    execute: (position: Position) => void
}

export const wallEditElement: EditElement = {
    name: '墙',
    description: '不可通过的障碍物，可拖拽放置',
    img: wall,
    canDrag: true,
    execute: (position) => {
        const { map } = useMapEditorStore();
        map[position.y][position.x] = MapTile.WALL;
    }
}

export const floorEditElement: EditElement = {
    name: '地板',
    description: '可行走的区域，可拖拽放置',
    img: floor,
    canDrag: true,
    execute: (position) => {
        const { map } = useMapEditorStore();
        map[position.y][position.x] = MapTile.FLOOR;
    }
}

export const emptyEditElement: EditElement = {
    name: '空白',
    description: '地图边界外的区域，可拖拽放置',
    img: empty,
    canDrag: true,
    execute: (position) => {
        const { map } = useMapEditorStore();
        map[position.y][position.x] = MapTile.EMPTY;
    }
}

export const playerEditElement: EditElement = {
    name: '玩家',
    description: '游戏主角，地图中只能有一个',
    img: keeper,
    canDrag: false,
    execute: (position) => {
        const { player } = useEditPlayerStore();
        player.x = position.x;
        player.y = position.y;
    }
}

export const cargoEditElement: EditElement = {
    name: '箱子',
    description: '可推动的物品，可放置多个',
    img: cargo,
    canDrag: false,
    execute: (position) => {
        const { addCargo, createCargo, modifyCargo } = useEditCargoStore();
        const { targets} = useEditTargetStore();
        addCargo(createCargo({ x: position.x, y: position.y }));

        // 检查该位置是否有目标点，如果有则更新箱子状态
        targets.forEach(target => {
            if (target.x === position.x && target.y === position.y) {
                modifyCargo(target);
            }
        })
    }
}

export const targetEditElement: EditElement = {
    name: '放置点',
    description: '箱子的目标位置，可放置多个',
    img: target,
    canDrag: false,
    execute: (position) => {
        const {addTarget, createTarget} = useEditTargetStore();
        addTarget(createTarget({ x: position.x, y: position.y }));
    }
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