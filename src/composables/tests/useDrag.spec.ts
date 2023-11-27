import {describe, it, expect} from "vitest";
import {useDrag} from "@/composables/useDrag.ts";

describe('useDrag', () => {
    it('should start drag', () => {
        const { startDrag, isDragging } = useDrag();

        startDrag();

        expect(isDragging()).toBe(true);
    });

    it("should stop drag", () => {
        const { stopDrag, isDragging } = useDrag();

        stopDrag();

        expect(isDragging()).toBe(false);
    });
})