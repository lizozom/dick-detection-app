import type { Detection } from '.';
import { YoloModel } from '../hooks';

const MAX_RESULTS = 20;
const SIZE_OF_RES = 6;

function resultBufferToDetections(qaqarray: Float32Array): Array<Detection> {
    
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
export function detectYolo(yolo?: YoloModel, canvas?: HTMLCanvasElement | null): Array<Detection> {
    let detections: Array<Detection> = [];

    if (!canvas || !yolo) return [];

    var ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;

    var imgData = ctx.getImageData(0, 0, width, height);

  
    if (imgData) {
        const { data } = imgData;
        // allocate memory
        const dst = yolo._malloc(data.length);
        yolo.HEAPU8.set(data, dst);

        // max 20 objects
        const resultarray = new Float32Array(SIZE_OF_RES * MAX_RESULTS);
        const resultbuffer = yolo._malloc(SIZE_OF_RES * MAX_RESULTS * Float32Array.BYTES_PER_ELEMENT);
        yolo.HEAPF32.set(resultarray, resultbuffer / Float32Array.BYTES_PER_ELEMENT);

        // detect
        yolo._yolo_ncnn(dst, width, height, resultbuffer);

        // results
        const qaqarray = yolo.HEAPF32.subarray(resultbuffer / Float32Array.BYTES_PER_ELEMENT, resultbuffer / Float32Array.BYTES_PER_ELEMENT + SIZE_OF_RES * MAX_RESULTS);
        
        detections = resultBufferToDetections(qaqarray);

        // free mem
        yolo._free(resultbuffer);
        yolo._free(dst);
    }

    return detections;
}