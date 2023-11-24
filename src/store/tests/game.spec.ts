import {beforeEach, describe, it,expect} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {useCargoStore} from "../cargo.ts";
import {useTargetStore} from "../target.ts";
import {useGameStore} from "../game.ts";
import {useMapStore} from "../map.ts";
import {usePlayerStore} from "../player.ts";

describe("game", () => {
    beforeEach(() => {
        setActivePinia(createPinia());

        let map = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
        ];

        const { setupMap } = useMapStore();
        setupMap(map);
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

    it('should setupGame', () => {
        const { setupGame } = useGameStore();

        const levelGameData = {
            player: { x: 1, y: 1 },
            map: [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
            ],
            cargos: [
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ],
            targets: [
                { x: 4, y: 3 },
                { x: 6, y: 3 },
            ],
        };

        setupGame(levelGameData);

        const { player } = usePlayerStore();
        const { map } = useMapStore();
        const { cargos } = useCargoStore();
        const { targets } = useTargetStore();

        expect(player.x).toBe(levelGameData.player.x);
        expect(player.y).toBe(levelGameData.player.y);
        expect(map).toEqual(levelGameData.map);
        expect(cargos.length).toBe(levelGameData.cargos.length);
        expect(targets.length).toBe(levelGameData.targets.length);
    });
});