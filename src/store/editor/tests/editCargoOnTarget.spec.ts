import { it, expect, describe, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useEditCargoStore } from "../editCargo";
import { useEditTargetStore } from "../editTarget";

describe("editCargoOnTarget", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("should update cargo onTarget status when target is present", () => {
        const cargoStore = useEditCargoStore();
        const targetStore = useEditTargetStore();

        // 创建一个目标点
        const target = targetStore.createTarget({ x: 1, y: 1 });
        targetStore.addTarget(target);

        // 创建一个在目标点上的箱子
        const cargo = cargoStore.createCargo({ x: 1, y: 1 });
        cargoStore.addCargo(cargo);

        // 手动调用更新函数来检查onTarget状态
        cargoStore.updateCargoOnTargetStatus(cargo);

        // 验证箱子的onTarget状态已更新
        expect(cargo.onTarget).toBe(true);
    });

    it("should update cargo onTarget status when target is not present", () => {
        const cargoStore = useEditCargoStore();

        // 创建一个不在目标点上的箱子
        const cargo = cargoStore.createCargo({ x: 2, y: 2 });
        cargoStore.addCargo(cargo);

        // 手动调用更新函数来检查onTarget状态
        cargoStore.updateCargoOnTargetStatus(cargo);

        // 验证箱子的onTarget状态为false
        expect(cargo.onTarget).toBe(false);
    });

    it("should update cargo onTarget status when target is added after cargo", async () => {
        const cargoStore = useEditCargoStore();
        const targetStore = useEditTargetStore();

        // 创建一个在目标点上的箱子
        const cargo = cargoStore.createCargo({ x: 1, y: 1 });
        cargoStore.addCargo(cargo);

        // 手动调用更新函数来检查onTarget状态
        cargoStore.updateCargoOnTargetStatus(cargo);
        expect(cargo.onTarget).toBe(false);

        // 创建一个目标点
        const target = targetStore.createTarget({ x: 1, y: 1 });
        targetStore.addTarget(target);

        // 手动调用更新函数来检查onTarget状态
        cargoStore.updateCargoOnTargetStatus(cargo);
        expect(cargo.onTarget).toBe(true);
    });
});