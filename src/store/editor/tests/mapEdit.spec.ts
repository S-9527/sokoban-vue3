import {beforeEach, describe, it, expect} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {useMapEditorStore} from "@/store/editor/mapEditor.ts";

describe("mapEdit", () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should init map', () => {
        const {initMap, map} = useMapEditorStore()

        const row = 8;
        const col = 8;

        initMap();

        expect(map.length).toBe(row);
        expect(map[0].length).toBe(col);
    });

    it('should not duplicate rows when initMap is called repeatedly', () => {
        const {initMap, map} = useMapEditorStore()

        initMap();
        initMap();

        expect(map.length).toBe(8);
        expect(map[0].length).toBe(8);
    });

    it('should not throw when updating rows or cols on an empty map', () => {
        const {updateMapRow, updateMapCol} = useMapEditorStore()

        expect(() => {
            updateMapRow();
            updateMapCol();
        }).not.toThrow();
    });

    describe("row", () => {
        it("should add a line when increase", () => {
            const {updateMapRow, setRow, initMap, map} = useMapEditorStore();
            initMap(2, 2);

            setRow(4);

            updateMapRow();

            expect(map).toMatchInlineSnapshot(`
        [
          [
            0,
            0,
          ],
          [
            0,
            0,
          ],
          [
            0,
            0,
          ],
          [
            0,
            0,
          ],
        ]
      `);
        })

        it("should remove a line when decrease", () => {
            const { updateMapRow, setRow, initMap, map } = useMapEditorStore();
            initMap(3, 3);

            setRow(1);

            updateMapRow();

            expect(map).toMatchInlineSnapshot(`
        [
          [
            0,
            0,
            0,
          ],
        ]
      `);
        });
    })

    describe("col", () => {
        it("should add when increase", () => {
            const {updateMapCol, setCol, initMap, map} = useMapEditorStore();
            initMap(2, 2);

            setCol(3);

            updateMapCol();

            expect(map).toMatchInlineSnapshot(`
        [
          [
            0,
            0,
            0,
          ],
          [
            0,
            0,
            0,
          ],
        ]
      `);
        });

        it("should remove when decrease", () => {
            const {updateMapCol, setCol, initMap, map} = useMapEditorStore();
            initMap(3, 3);

            setCol(2);

            updateMapCol();

            expect(map).toMatchInlineSnapshot(`
        [
          [
            0,
            0,
          ],
          [
            0,
            0,
          ],
          [
            0,
            0,
          ],
        ]
      `);
        });
    })
})