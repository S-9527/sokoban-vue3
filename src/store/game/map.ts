import { defineStore } from "pinia";
import { Position } from '@/composables/usePosition.ts'
import { reactive } from "vue";

export enum MapTile {
    EMPTY = 0,
    WALL = 1,
    FLOOR = 2,
}

export type Map = MapTile[][]


export const useMapStore = defineStore('map', ()=> {
    let map = reactive<Map>([])

    function setupMap(newMap: Map) {
        map.splice(0, map.length, ...newMap)
    }

    function isWall(position: Position) {
        const row = map[position.y];
        // 越界视为墙，避免走出地图边缘时崩溃
        if (!row) return true;
        const tile = row[position.x];
        if (tile === undefined) return true;
        // 只有 FLOOR 可通行，EMPTY 与 WALL 一样阻挡
        return tile !== MapTile.FLOOR
    }


    return { map,setupMap,isWall }
})