import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {type Map, MapTile} from "@/store/game/map.ts";

export const useMapEditorStore = defineStore('mapEditor', () => {
    const map = reactive<Map>([]);

    const row = ref<number>(8);
    const col = ref<number>(8);

    function initMap(_row?: number, _col?: number) {
        row.value = _row ?? row.value;
        col.value = _col ?? col.value;

        for (let i = 0; i < row.value; i++) {
            let cells = new Array(col.value).fill(MapTile.EMPTY);
            map.push(cells);
        }
    }

    function updateMapRow() {
        const oldRow = map.length;
        const col = map[0].length;

        if (oldRow < row.value) {
            const diff = row.value - oldRow;

            for (let i = 0; i < diff; i++) {
                map.push(new Array(col).fill(MapTile.EMPTY));
            }
        }

        if (oldRow > row.value) {
            const diff = oldRow - row.value;
            map.splice(map.length - diff, map.length);
        }
    }

    function updateMapCol() {
        const oldCol = map[0].length;
        if (col.value > oldCol) {
            const diff = col.value - oldCol;

            map.forEach((cells) => {
                cells.push(...new Array(diff).fill(MapTile.EMPTY));
            });
        }

        if (col.value < oldCol) {
            const diff = oldCol - col.value;

            map.forEach((cells) => {
                cells.splice(cells.length - diff, cells.length);
            });
        }
    }

    function setRow(_row: number) {
        row.value = _row;
    }

    function setCol(_col: number) {
        col.value = _col;
    }

    // 添加重置地图功能
    function resetMap() {
        map.splice(0, map.length);
        for (let i = 0; i < row.value; i++) {
            let cells = new Array(col.value).fill(MapTile.EMPTY);
            map.push(cells);
        }
    }

    return {
        map,
        row,
        col,
        setCol,
        setRow,
        updateMapCol,
        updateMapRow,
        initMap,
        resetMap
    }
})