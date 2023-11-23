import { it, describe, expect, beforeEach } from "vitest";
import { usePlayerStore } from "../player.ts";
import { createPinia, setActivePinia } from "pinia";
import { handleKeyup } from "../../components/event/event.ts";

describe('player', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should move to the left', () => {
        const { movePlayerToLeft, player } = usePlayerStore();
        player.x = 1;
        player.y = 1;

        movePlayerToLeft();

        expect(player.x).toBe(0);
    });

    it('should move to the right', () => {
        const { movePlayerToRight, player } = usePlayerStore();
        player.x = 1;
        player.y = 1;

        movePlayerToRight();

        expect(player.x).toBe(2);
    });

    it('should move to the down', () => {
        const { movePlayerToDown, player } = usePlayerStore();
        player.x = 1;
        player.y = 1;

        movePlayerToDown();

        expect(player.y).toBe(2);
    });

    it('should move to the up', () => {
        const { movePlayerToUp, player } = usePlayerStore();
        player.x = 1;
        player.y = 1;

        movePlayerToUp();

        expect(player.y).toBe(0);
    });

    it("should move to left when press ArrowLeft", () => {
        const { player } = usePlayerStore();
        player.x = 1;
        player.y = 1;

        window.addEventListener("keyup",handleKeyup)

        window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft" }));

        expect(player.x).toBe(0);
    });
})