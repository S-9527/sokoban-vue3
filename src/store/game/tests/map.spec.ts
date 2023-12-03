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
})