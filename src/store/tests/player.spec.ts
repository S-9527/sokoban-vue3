import { it, describe, expect, beforeEach } from "vitest";
import { usePlayerStore } from "../player.ts";
import { createPinia, setActivePinia } from "pinia";
import { handleKeyup } from "../../components/event/event.ts";
import { useMapStore } from "../map.ts";

describe('player', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('normal move', () => {
        beforeEach(() => {
            const {setupMap} = useMapStore();
            setupMap([
                [2, 2, 2],
                [2, 2, 2],
                [2, 2, 2]
            ])
        })

        it('should move to the left', () => {

            const {setupMap} = useMapStore();
            setupMap([
                [2, 2, 2],
                [2, 2, 2],
                [2, 2, 2]
            ])


            const {movePlayerToLeft, player} = usePlayerStore();
            player.x = 1;
            player.y = 1;

            movePlayerToLeft();

            expect(player.x).toBe(0);
        });

        it('should move to the right', () => {
            const {movePlayerToRight, player} = usePlayerStore();
            player.x = 1;
            player.y = 1;

            movePlayerToRight();

            expect(player.x).toBe(2);
        });

        it('should move to the down', () => {
            const {movePlayerToDown, player} = usePlayerStore();
            player.x = 1;
            player.y = 1;

            movePlayerToDown();

            expect(player.y).toBe(2);
        });

        it('should move to the up', () => {
            const {movePlayerToUp, player} = usePlayerStore();
            player.x = 1;
            player.y = 1;

            movePlayerToUp();

            expect(player.y).toBe(0);
        });

    })

    describe('collision wall', () => {
        beforeEach(() => {
            let map = [
                [1, 1, 1, 1, 1],
                [1, 2, 2, 2, 1],
                [1, 2, 2, 2, 1],
                [1, 2, 2, 2, 1],
                [1, 1, 1, 1, 1],
            ];

            const { setupMap } = useMapStore();
            setupMap(map)
        })

        it('should not move to left when collision wall', () => {
            const {movePlayerToLeft, player} = usePlayerStore();
            player.x = 1;
            player.y = 1;

            movePlayerToLeft()

            expect(player.x).toBe(1);
        });

        it('should not move to right when collision wall', () => {
            const {movePlayerToRight, player} = usePlayerStore();
            player.x = 3;
            player.y = 1;

            movePlayerToRight()

            expect(player.x).toBe(3);
        });

        it('should not move to up when collision wall', () => {
            const {movePlayerToUp, player} = usePlayerStore();
            player.x = 1;
            player.y = 1;

            movePlayerToUp()

            expect(player.y).toBe(1);
        });

        it('should not move to down when collision wall', () => {
            const {movePlayerToDown, player} = usePlayerStore();
            player.x = 1;
            player.y = 3;

            movePlayerToDown()

            expect(player.y).toBe(3);
        });
    })

    describe('press the key', () => {
        beforeEach(() => {
            const {setupMap} = useMapStore();
            setupMap([
                [2, 2, 2],
                [2, 2, 2],
                [2, 2, 2]
            ]);
        })

        it("should move to left when press ArrowLeft", () => {
            const {player} = usePlayerStore();
            player.x = 1;
            player.y = 1;

            window.addEventListener("keyup", handleKeyup)

            window.dispatchEvent(new KeyboardEvent("keyup", {code: "ArrowLeft"}));

            expect(player.x).toBe(0);
        });
    })
})