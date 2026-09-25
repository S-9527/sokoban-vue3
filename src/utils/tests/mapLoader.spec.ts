import { afterEach, describe, it, expect, vi } from "vitest";
import { loadMapsFromImages } from "../mapLoader";
import { MapTile } from "@/store/game/map";
import { Puzzle } from "@/robot/robot";
import { PuzzleSolver } from "@/robot/puzzleSolver";
import type { Point } from "@/types/game";

describe("mapLoader", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("should fall back to the default map when no map images can be loaded", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

        const gameData = await loadMapsFromImages();

        expect(gameData.length).toBeGreaterThan(0);
        expect(gameData[0].map.length).toBe(5);
        expect(gameData[0].cargos.length).toBe(1);

        const level = gameData[0];
        const puzzle = new Puzzle(
            level.map.map(row => row.map(cell => cell === MapTile.FLOOR ? MapTile.FLOOR : MapTile.WALL)),
            level.cargos.map(cargo => [cargo.x, cargo.y] as Point),
            level.targets.map(target => [target.x, target.y] as Point),
            [level.player.x, level.player.y]
        );

        expect(PuzzleSolver.solve(puzzle).length).toBeGreaterThan(0);
    });
});
