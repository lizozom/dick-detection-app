import { Detection } from ".";

export const DICK = 1;
export const DICK_HEAD = 2;

export function getDetection(detections: Array<Detection>, label: number) {
    return detections.find(x => x.label === label)
}