import type { MutableRefObject } from 'react';
import type { Detection } from '.';

const MAX_RESULTS = 20;
const SIZE_OF_RES = 6;

function resultBufferToDetections(qaqarray: Array<number>): Array<Detection> {
    
    const detections = [];
    
    for (let i = 0; i < MAX_RESULTS; i++) {
        var label = qaqarray[i * SIZE_OF_RES + 0];
        var prob = qaqarray[i * SIZE_OF_RES + 1];
        var bbox_x = qaqarray[i * SIZE_OF_RES + 2];
        var bbox_y = qaqarray[i * SIZE_OF_RES + 3];
        var bbox_w = qaqarray[i * SIZE_OF_RES + 4];
        var bbox_h = qaqarray[i * SIZE_OF_RES + 5]; 

        if (label == -233 || prob === 0)
            continue;

        // console.log('qaq ' + label + ' = ' + prob);
        detections.push({
            label,
            prob,
            bbox_h,
            bbox_w,
            bbox_x,
            bbox_y
        });
    }

    return detections;
}
export function detectYolo(canvas: HTMLCanvasElement | null): Array<Detection> {
    let detections: Array<Detection> = [];

    if (!canvas) return [];

    var ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;

    var imgData = ctx.getImageData(0, 0, width, height);

  
    if (imgData) {
        const { data } = imgData;
        // allocate memory
        // @ts-ignore-start ts(2304)
        const dst = _malloc(data.length);
        // @ts-ignore-start ts(2304)
        HEAPU8.set(data, dst);

        // max 20 objects
        const resultarray = new Float32Array(SIZE_OF_RES * MAX_RESULTS);
        // @ts-ignore-start ts(2304)
        const resultbuffer = _malloc(SIZE_OF_RES * MAX_RESULTS * Float32Array.BYTES_PER_ELEMENT);
        // @ts-ignore-start ts(2304)
        HEAPF32.set(resultarray, resultbuffer / Float32Array.BYTES_PER_ELEMENT);

        // detect
        // @ts-ignore-start ts(2304)
        _yolo_ncnn(dst, width, height, resultbuffer);

        // @ts-ignore-start ts(2304)
        // results
        const qaqarray = HEAPF32.subarray(resultbuffer / Float32Array.BYTES_PER_ELEMENT, resultbuffer / Float32Array.BYTES_PER_ELEMENT + SIZE_OF_RES * MAX_RESULTS);
        
        detections = resultBufferToDetections(qaqarray);

        // free mem
        // @ts-ignore-start ts(2304)
        _free(resultbuffer);
        // @ts-ignore-start ts(2304)
        _free(dst);
    }

    return detections;
}