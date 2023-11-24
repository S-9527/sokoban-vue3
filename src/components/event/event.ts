import { usePlayerStore } from "../../store/player.ts";
import { useGameStore } from "../../store/game.ts";

export function handleKeyup(e: KeyboardEvent) {
    const {
        movePlayerToLeft,
        movePlayerToDown,
        movePlayerToRight,
        movePlayerToUp,
    } = usePlayerStore();


    switch (e.code) {
        case "ArrowLeft":
            movePlayerToLeft();
            break;
        case "ArrowRight":
            movePlayerToRight();
            break;
        case "ArrowUp":
            movePlayerToUp();
            break;
        case "ArrowDown":
            movePlayerToDown();
            break;
    }

    const { detectionGameCompleted } = useGameStore();
    detectionGameCompleted();
}