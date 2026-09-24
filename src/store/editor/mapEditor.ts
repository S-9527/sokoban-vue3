import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {type Map, MapTile} from "@/store/game/map.ts";

export const useMapEditorStore = defineStore('mapEditor', () => {
    const map = reactive<Map>([]);

    const row = ref<number>(8);
    const col = ref<number>(8);

    // 幂等：无论调用多少次都重建为 row x col 的空地图
    function initMap(_row?: number, _col?: number) {
        row.value = _row ?? row.value;
        col.value = _col ?? col.value;

        map.splice(0, map.length);
        for (let i = 0; i < row.value; i++) {
            map.push(new Array(col.value).fill(MapTile.EMPTY));
        }
    }

    function updateMapRow() {
        if (map.length === 0 || !map[0]) return;
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
        if (map.length === 0 || !map[0]) return;
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

    return {
        map,
        row,
        col,
        setCol,
        setRow,
        updateMapCol,
        updateMapRow,
        initMap
    }
})