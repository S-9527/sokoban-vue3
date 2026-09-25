import JSConfetti from "js-confetti";
import { watch } from "vue";
import { useGameStore } from "@/store/game/game.ts";

/** 监听过关状态，并在视图层播放彩带。 */
export function useGameConfetti() {
    const { game } = useGameStore();
    let confetti: JSConfetti | undefined;

    watch(() => game.isGameCompleted, (completed) => {
        if (!completed) return;
        confetti ??= new JSConfetti();
        confetti.addConfetti();
    }, { flush: "sync" });
}
