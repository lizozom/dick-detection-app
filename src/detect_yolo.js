import React, { useState, useEffect } from 'react';

const CHANNELS = 3;
const MAX_RESULTS = 20;
const SIZE_OF_RES = 6;


function resultBufferToDetections(qaqarray) {
    
    const detections = [];
    
    for (let i = 0; i < 20; i++) {
        var label = qaqarray[i * 6 + 0];
        var prob = qaqarray[i * 6 + 1];
        var bbox_x = qaqarray[i * 6 + 2];
        var bbox_y = qaqarray[i * 6 + 3];
        var bbox_w = qaqarray[i * 6 + 4];
        var bbox_h = qaqarray[i * 6 + 5];

        if (label == -233)
            continue;

        console.log('qaq ' + label + ' = ' + prob);
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
export function detectYolo(canvasRef) {
    const detections = [];

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    var imgData = ctx.getImageData(0, 0, width, height);

  
    if (imgData) {
        // allocate memory
        const dst = _malloc(imgData.length);
        HEAPU8.set(imgData, dst);

        // max 20 objects
        const resultarray = new Float32Array(SIZE_OF_RES * MAX_RESULTS);
        const resultbuffer = _malloc(SIZE_OF_RES * MAX_RESULTS * Float32Array.BYTES_PER_ELEMENT);
        HEAPF32.set(resultarray, resultbuffer / Float32Array.BYTES_PER_ELEMENT);

        // detect
        _detect_yolo(dst, width, height, resultbuffer);

        // results
        const qaqarray = HEAPF32.subarray(resultbuffer / Float32Array.BYTES_PER_ELEMENT, resultbuffer / Float32Array.BYTES_PER_ELEMENT + SIZE_OF_RES * MAX_RESULTS);
        const foundDet = resultBufferToDetections(qaqarray);

        // free mem
        _free(resultbuffer);
        _free(dst);
    }

    return detections;
}