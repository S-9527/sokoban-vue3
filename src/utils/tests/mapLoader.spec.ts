import { describe, it, expect } from "vitest";
import { loadMapsFromImages } from "../mapLoader";

describe("mapLoader", () => {
    it("should fall back to the default map when no map images can be loaded", async () => {
        const gameData = await loadMapsFromImages();

        expect(gameData.length).toBeGreaterThan(0);
        expect(gameData[0].map.length).toBe(5);
        expect(gameData[0].cargos.length).toBe(1);
    });
});
