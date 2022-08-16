import * as React from 'react';
import { useEffect, useRef, useState } from 'react'
import { simd, threads } from 'wasm-feature-detect'
import { copyImageToCanvas, Detection, detectYolo } from '../helpers';
import { useYolo } from '../hooks';

// @ts-ignore
import Dp1 from '/public/misc/dp1.jpg';

export function Debug() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [wasmSettings, setWasmSettings] = useState<{
        simd: boolean;
        threads: boolean;
    } | undefined>();

    const { yolo, error } = useYolo();
    const [ imgLoaded, setImageLoaded ] = useState<boolean>( false);
    const [ detections, setDetections ] = useState<Detection[]>([]);

    useEffect(() => {
        const img = new Image();
        img.src = Dp1;
        img.onload = () => {
            setImageLoaded(true);
            copyImageToCanvas(img, canvasRef.current!);
        }

    }, []);

    useEffect(() => {
        const testWasm = async () => {
            const simdEnabled = await simd();
            const threadsEnabled = await threads();

            setWasmSettings({
                simd: simdEnabled,
                threads: threadsEnabled,
            });
        }

        testWasm();
    }, []);

    useEffect(() => {
        if (yolo && imgLoaded) {
            const d = detectYolo(yolo, canvasRef.current);
            setDetections(d);
            
        }
    }, [yolo, imgLoaded]);

    return (
        <>
            <div>Simd {String(wasmSettings?.simd)}</div>
            <div>Threads {String(wasmSettings?.threads)}</div>
            <div>Yolo loaded {String(yolo !== undefined)}</div>
            <div>Yolo error {error}</div>
            <div>Detections {detections.length}</div>
            <canvas width="360" height="360" ref={canvasRef} style={{
                display: 'none'
            }}></canvas>
        </>
    )
}