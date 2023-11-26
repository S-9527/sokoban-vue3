import {beforeEach, describe, it,expect} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {floorEditElement, useEditElementStore, wallEditElement} from "@/store/editor/EditElement.ts";
import {MapTile} from "@/store/map.ts";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";

describe("editElement", () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should change to wall when current selected element is wall', () => {
        const { setCurrentSelectedEditElement,getCurrentSelectedEditElement } = useEditElementStore();
        const { map } = useMapEditorStore();

        setCurrentSelectedEditElement(wallEditElement);

        getCurrentSelectedEditElement().execute({ x:1, y:1 });

        expect(map[1][1]).toBe(MapTile.WALL);
    });

    it('should change to floor when current selected element is floor', () => {
        const { setCurrentSelectedEditElement,getCurrentSelectedEditElement } = useEditElementStore();
        const { map } = useMapEditorStore();

        setCurrentSelectedEditElement(floorEditElement);

        getCurrentSelectedEditElement().execute({ x:1, y:1 });

        expect(map[1][1]).toBe(MapTile.FLOOR);
    });
})