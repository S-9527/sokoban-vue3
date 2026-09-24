import {beforeEach, describe, expect, it} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {useMapStore} from "../map.ts";

describe("map", () => {
    beforeEach(()=>{
        setActivePinia(createPinia());
    })

    it('should setup map', () => {
        const { map, setupMap } = useMapStore();

        const newMap = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];

        setupMap(newMap);

        expect(map).toEqual(newMap);
    });

    it('should not share row references with the source map', () => {
        const { setupMap, map } = useMapStore();

        const newMap = [
            [1, 2],
            [2, 1]
        ];
        setupMap(newMap);
        newMap[0][0] = 2;

        expect(map[0][0]).toBe(1);
    });

    it('should treat out-of-bounds positions as walls', () => {
        const { setupMap, isWall } = useMapStore();

        setupMap([
            [1, 2, 1],
            [1, 2, 1],
            [1, 2, 1]
        ]);

        expect(isWall({ x: 0, y: -1 })).toBe(true);
        expect(isWall({ x: -1, y: 0 })).toBe(true);
        expect(isWall({ x: 3, y: 0 })).toBe(true);
        expect(isWall({ x: 0, y: 3 })).toBe(true);
        expect(isWall({ x: 1, y: 1 })).toBe(false);
    });

    it('should treat EMPTY tiles as impassable', () => {
        const { setupMap, isWall } = useMapStore();

        setupMap([
            [1, 2, 0]
        ]);

        expect(isWall({ x: 2, y: 0 })).toBe(true);
        expect(isWall({ x: 1, y: 0 })).toBe(false);
    });
})