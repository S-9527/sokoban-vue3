import {beforeEach, describe, it,expect} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {useCargoStore} from "../cargo.ts";
import {useTargetStore} from "../target.ts";
import {useGameStore} from "../game.ts";

describe("game", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("should game completed", () => {
        const { addCargo, createCargo, moveCargo } = useCargoStore();
        const cargo = createCargo({x: 2, y: 1 });
        addCargo(cargo);

        const { addTarget, createTarget } = useTargetStore();
        addTarget(createTarget({ x: 3, y: 1 }));

        moveCargo(cargo, 1, 0);

        const { detectionGameCompleted, game } = useGameStore();

        detectionGameCompleted()
        expect(game.isGameCompleted).toBe(true);
    });

    it("should not game completed", () => {
        const { addCargo, createCargo, moveCargo } = useCargoStore();
        const cargo = createCargo({ x: 2, y: 1 });
        addCargo(cargo);

        const { addTarget, createTarget } = useTargetStore();
        addTarget(createTarget({ x: 3, y: 1 }));

        moveCargo(cargo, 1, 0);
        moveCargo(cargo, 1, 0);

        const { detectionGameCompleted, game } = useGameStore();

        detectionGameCompleted()
        expect(game.isGameCompleted).toBe(false);

    });
});