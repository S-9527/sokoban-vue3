import {EditCargo} from "@/store/editor/editCargo.ts";
import {EditTarget} from "@/store/editor/editTarget.ts";

let id :number = 0;

export function generateId() {
    return id++;
}

export function removeIdAttribute(element:EditCargo[] | EditTarget[]) {
    return element.map((item: EditCargo | EditTarget) => {
        return { x: item.x, y: item.y }
    })
}