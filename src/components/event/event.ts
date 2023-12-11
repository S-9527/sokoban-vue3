import { usePlayerStore } from "@/store/game/player.ts";

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
}