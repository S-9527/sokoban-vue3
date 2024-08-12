import {EditCargo} from "@/store/editor/editCargo.ts";
import {EditTarget} from "@/store/editor/editTarget.ts";

let id :number = 0;

export function generateId() {
    return id++;
}

export function getCoordinates<T extends EditCargo | EditTarget>(element: T[]) {
    return element.map(item => ({ x: item.x, y: item.y }));
}