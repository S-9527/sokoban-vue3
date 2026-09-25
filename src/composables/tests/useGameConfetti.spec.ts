import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import { gameData } from "@/data";
import { useGameStore } from "@/store/game/game";
import { useGameConfetti } from "@/composables/useGameConfetti";

const { addConfetti } = vi.hoisted(() => ({
    addConfetti: vi.fn()
}));

vi.mock("js-confetti", () => ({
    default: class {
        addConfetti = addConfetti;
    }
}));

describe("useGameConfetti", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        addConfetti.mockClear();
    });

    it("should play when a level is completed during setup", async () => {
        useGameConfetti();
        const { setupGame } = useGameStore();

        setupGame(gameData);
        await nextTick();

        expect(gameData[0].cargos[0]).toEqual(gameData[0].targets[0]);
        expect(addConfetti).toHaveBeenCalledOnce();
    });

    it("should play when wrapping reaches a completed level", () => {
        useGameConfetti();
        const { setupGame, toNextLevel, game } = useGameStore();
        const levels = [gameData[0], gameData[1]];
        setupGame(levels);
        addConfetti.mockClear();
        game.level = levels.length;
        game.isGameCompleted = true;

        toNextLevel();

        expect(game.level).toBe(1);
        expect(game.isGameCompleted).toBe(true);
        expect(addConfetti).toHaveBeenCalledOnce();
    });
});
