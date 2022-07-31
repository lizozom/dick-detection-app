import * as React from 'react';
import { useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { detectYolo, drawDetections, isWasmLoaded, loadScaledPhotoToCanvas } from './helpers';
import { Navigate } from 'react-router-dom'
import Webcam from "react-webcam";
import { Header } from './components';
import { Fab } from '@mui/material';
import type { ScreenSize } from './types';
import type { Detection } from './helpers';

import CameraIcon from '@mui/icons-material/Camera';
import "./camera_detector.scss";

export interface DetectorProps {
  screenSize: ScreenSize;
  onSnap?: (imgData: string, d: Array<Detection>) => void;
}

function configureVideoSize(screenSize: ScreenSize, video: HTMLVideoElement) {
  const { videoHeight, videoWidth } = video;

  // Video should cover height and be centered
  const vidElemHeight = screenSize.height;
  const vidElemWidth = Math.round(videoWidth * screenSize.height / videoHeight);

  video.setAttribute('height', String(vidElemHeight));
  video.setAttribute('width', String(vidElemWidth));
}

function copyVideoToCanvas(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const { videoWidth, videoHeight } = video;
  const { width: canvasWidth} = canvas;

  const margin = Math.abs(canvasWidth - videoWidth) / 2;

  // Draw video frame onto canvas
  const ctx = canvas.getContext("2d")!;
  // ctx.fillRect(0, 0, w, h);
  ctx.drawImage(video, margin, 0, canvasWidth, videoHeight, 0, 0, canvasWidth, videoHeight);
}

function getVideoElement(webCamRef: React.RefObject<Webcam>) {
  return webCamRef.current?.video;
}

function getCanvasElement(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {
  return canvasRef.current;
}

export function CameraDetector(props: DetectorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);

  // Animation handler
  const detectOnFrame = () => {
    const video = getVideoElement(webcamRef);
    const canvas = getCanvasElement(canvasRef);
    if (!video || !canvas) return;

    copyVideoToCanvas(video, canvas);

    const d = detectYolo(canvasRef as MutableRefObject<HTMLCanvasElement>);
    drawDetections(canvasRef as MutableRefObject<HTMLCanvasElement>, d);

    requestAnimationFrame(detectOnFrame);
  }

  const onSnap = () => {
    if (props.onSnap) {
      const video = getVideoElement(webcamRef);
      if (!video) return;

      // create temp canvas
      var canvas = document.createElement("canvas");
      canvas.width = props.screenSize.width;
      canvas.height = props.screenSize.height;
      copyVideoToCanvas(video, canvas);
      const data = canvas.toDataURL('image/png');

      // detect
      const d = detectYolo(canvasRef as MutableRefObject<HTMLCanvasElement>);
      props.onSnap(data, d);
    }
  };

  const onUserMediaError = (e: string | DOMException) => {
    console.error("No media devices found")
  }

  const onUserMedia = (_: MediaStream) => {
    const video = getVideoElement(webcamRef);
    const canvas = getCanvasElement(canvasRef);
    if (!video || !canvas) return;
    
    video.addEventListener('play', function (e) {
      configureVideoSize(props.screenSize, video);
      detectOnFrame();
      setCameraEnabled(true);
    });
  };

  if (!isWasmLoaded()) {
    return (<Navigate replace to="/" />);
  }

  return (
    <div className='camera-detector'>
      <div className='main'>
        <Webcam onUserMedia={onUserMedia} onUserMediaError={onUserMediaError} ref={webcamRef} videoConstraints={{
          facingMode: "environment",
          height: { ideal: window.innerHeight}
        }}/>
        <canvas id="app-canvas" ref={canvasRef} width={props.screenSize.width} height={props.screenSize.height} />
        <div className='overlay'>
          <div className='overlay-text-1'>Get it up and stick it in <br/>this sexy box</div>
          <div className='overlay-text-2'>It will help align everything nicely. <br/>You're going to like it ;)</div>
        </div>
        <div className="app-control">
          <Fab color="primary" aria-label="add" disabled={!cameraEnabled} onClick={onSnap}>
            <CameraIcon />
          </Fab>
        </div>
        
        <Header />
      </div>
    </div>
  );
}