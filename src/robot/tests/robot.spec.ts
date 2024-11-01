import { describe, it, beforeEach, expect } from "vitest";
import { Puzzle } from "@/robot/robot.ts";
import { createPinia, setActivePinia } from "pinia";

describe('robot', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should solver', () => {
        const puzzle = new Puzzle([
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 2, 2, 3, 2, 2, 2, 1,
            1, 2, 2, 2, 2, 2, 2, 1,
            1, 2, 2, 1, 2, 2, 2, 1,
            1, 2, 2, 1, 2, 2, 2, 1,
            1, 2, 2, 1, 2, 2, 2, 1,
            1, 2, 2, 1, 2, 2, 2, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
        ], 8,{ 13:false }, [2,2]);

        const result: string[] = puzzle.generateNextActions().map(({puzzle}) => puzzle.toString());
        expect(result.join("\n")).toMatchInlineSnapshot(`
          "11111111
          12223221
          12222221
          12212221
          12212221
          12212221
          12212221
          11111111
          player: 3,1

          11111111
          12322221
          12222221
          12212221
          12212221
          12212221
          12212221
          11111111
          player: 3,1
          "
        `);
    });
});