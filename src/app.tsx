import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { detectYolo, drawDetections, isWasmLoaded, loadScaledPhotoToCanvas } from './helpers';
import { Navigate } from 'react-router-dom'
import Webcam from "react-webcam";

import "./app.scss";
import { Detection } from './types.js';
import { Header } from './components';

const BASE_SIZE = 640;


export function App() {
  const loaded = true;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const onResetClick = () => {
    if (!loaded) console.log('not loaded');
    videoFrameToCanvas();
  };

  const onDetectClick = () => {
    if (!loaded) console.log('not loaded');
    const detections = detectYolo(canvasRef as MutableRefObject<HTMLCanvasElement>);
    drawDetections(canvasRef as MutableRefObject<HTMLCanvasElement>, detections);
  };

  const videoFrameToCanvas = () => {
    if (
      webcamRef.current === null ||
      webcamRef.current.video === null ||
      canvasRef.current === null
    ) return;

    const { video } = webcamRef.current;
    const canvas = canvasRef.current;

    const h = parseInt(canvas.getAttribute('height') || '0');
    const w = parseInt(canvas.getAttribute('width') || '0');
    // Draw video frame onto canvas
    const ctx = canvas.getContext("2d")!;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(video, 0, 0, w, h);
  }

  const detectOnFrame = () => {
    videoFrameToCanvas();

    const d = detectYolo(canvasRef as MutableRefObject<HTMLCanvasElement>);
    drawDetections(canvasRef as MutableRefObject<HTMLCanvasElement>, d);

    requestAnimationFrame(detectOnFrame);
  }

  const onUserMediaError = (e: string | DOMException) => {
    console.error("No media devices found")
  }

  const onUserMedia = (_: MediaStream) => {
    if (webcamRef.current === null || canvasRef.current === null) return;

    const { video } = webcamRef.current;
    if (!video) return;

    const canvas = canvasRef.current;
    video.addEventListener('play', function (e) {
      const { videoHeight, videoWidth } = video;
      const { clientHeight } = document.documentElement;

      // Video should cover height and be centered
      const vidElemHeight = clientHeight;
      const vidElemWidth = Math.round(videoWidth * clientHeight / videoHeight);
  
      video.setAttribute('height', String(vidElemHeight));
      video.setAttribute('width', String(vidElemWidth));

      // Canvas should be cropped to visible area
      let canvasHeight = vidElemHeight;
      let canvasWidth = vidElemWidth; // Math.min(vidElemWidth, innerWidth);

      canvas.setAttribute('width', canvasWidth.toString());
      canvas.setAttribute('height', canvasHeight.toString());

      detectOnFrame();
    });
    if (!loaded) console.log('not loaded');
  };

  if (!isWasmLoaded()) {
    return (<Navigate replace to="/" />);
  }

  return (
    <div className='app-container'>
      <Header />
      <div className='main'>
        <Webcam onUserMedia={onUserMedia} onUserMediaError={onUserMediaError} ref={webcamRef} videoConstraints={{
          
          facingMode: "environment",
          height: { ideal: window.innerHeight}
        }}/>
        <canvas id="app-canvas" ref={canvasRef} width="640" height="640" />
        <br />
        <button onClick={onDetectClick}>Detect</button>
        <button onClick={onResetClick}>Reset</button>
      </div>
    </div>
  );
}