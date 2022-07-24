import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { detectYolo, drawDetections, isWasmLoaded, loadScaledPhotoToCanvas } from './helpers';
import { Navigate } from 'react-router-dom'
import Webcam from "react-webcam";

//@ts-ignore
import Photo from '/public/dp2.jpg';

import "./app.scss";
import { Detection } from './types.js';
import { Header } from './components';

const BASE_SIZE = 640;


export function App() {
  const loaded = true;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [detections, setDetections] = useState<Detection[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    loadScaledPhotoToCanvas(canvasRef as MutableRefObject<HTMLCanvasElement>, Photo);
  }, []);

  useEffect(() => {
    drawDetections(canvasRef as MutableRefObject<HTMLCanvasElement>, detections);
  }, [detections]);

  const onResetClick = () => {
    if (!loaded) console.log('not loaded');
    videoFrameToCanvas();
  };

  const onDetectClick = () => {
    if (!loaded) console.log('not loaded');
    const detections = detectYolo(canvasRef as MutableRefObject<HTMLCanvasElement>);
    console.log(detections);
    setDetections(detections);
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

  const onUserMedia = (_: MediaStream) => {
    if (webcamRef.current === null || canvasRef.current === null) return;

    const { video } = webcamRef.current;
    if (!video) return;

    const canvas = canvasRef.current;
    let h = 480;
    let w = 640;
    video.addEventListener('play', function (e) {
      // Adjust canvas size
      if (video.videoWidth > 0) h = video.videoHeight / (video.videoWidth / w);
      canvas.setAttribute('width', w.toString());
      canvas.setAttribute('height', h.toString());

      videoFrameToCanvas();
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
        <Webcam onUserMedia={onUserMedia} mirrored={true} ref={webcamRef} />
        <canvas id="app-canvas" ref={canvasRef} width="640" height="640" />
        <br />
        <button onClick={onDetectClick}>Detect</button>
        <button onClick={onResetClick}>Reset</button>
      </div>
    </div>
  );
}