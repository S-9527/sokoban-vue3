import {beforeEach, describe, expect, it} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {useMapStore} from "../map.ts";

describe("map", () => {
    beforeEach(()=>{
        setActivePinia(createPinia());
    })
    it('should ', () => {
        const { map } = useMapStore()
        expect(map).toEqual([
            [1, 1, 1, 1, 1],
            [1, 2, 2, 2, 1],
            [1, 2, 2, 2, 1],
            [1, 2, 2, 2, 1],
            [1, 1, 1, 1, 1]
        ])
    });
})