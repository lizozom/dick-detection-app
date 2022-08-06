import { Detection } from ".";

export const DICK = 1;
export const DICK_HEAD = 2;

export function getDetection(detections: Array<Detection>, label: number) {
    return detections.find(x => x.label === label)
}

export function getDickBox(detections: Array<Detection>) {
    const dick = getDetection(detections, DICK);
    if (!dick) return undefined;
    return {
        dickHeight: dick.bbox_h,
        dickWidth: dick.bbox_w,
        dickY: dick.bbox_y,
        dickX: dick.bbox_x,
    }
}

export function getDickHeadBox(detections: Array<Detection>) {
    const dick = getDetection(detections, DICK_HEAD);
    if (!dick) return undefined;
    return {
        headHeight: dick.bbox_h,
        headWidth: dick.bbox_w,
        headY: dick.bbox_y,
        headX: dick.bbox_x,
    }
}