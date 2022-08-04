import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import type { MutableRefObject } from 'react';
import ReactGA from 'react-ga4';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { Navigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Button, Fab } from '@mui/material';
import CameraIcon from '@mui/icons-material/Camera';
import { Header } from './components';
import type { ScreenSize } from './types';
import type { Detection } from './helpers';
import { detectYolo, drawDetections, isWasmLoaded } from './helpers';
import './camera_detector.scss';

export interface DetectorProps {
  screenSize: ScreenSize;
  onSnap: (imgData: string, d: Array<Detection>) => void;
}

function configureVideoSize(screenSize: ScreenSize, video: HTMLVideoElement) {
  const { videoHeight, videoWidth } = video;

  // Video should cover height and be centered
  const vidElemHeight = screenSize.height;
  const vidElemWidth = Math.round(videoWidth * (screenSize.height / videoHeight));

  video.setAttribute('height', String(vidElemHeight));
  video.setAttribute('width', String(vidElemWidth));
}

function copyVideoToCanvas(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const { videoWidth, videoHeight } = video;
  const { width: canvasWidth, height: canvasHeight } = canvas;

  const ratio = videoHeight / canvasHeight;
  const canvasWidthToCopy = canvasWidth * ratio;

  const margin = Math.abs(canvasWidthToCopy - videoWidth) / 2;

  // Draw video frame onto canvas
  const ctx = canvas.getContext('2d')!;
  // ctx.fillRect(0, 0, w, h);
  ctx.drawImage(video, margin, 0, canvasWidthToCopy, videoHeight, 0, 0, canvasWidth, canvasHeight);
}

function getVideoElement(webCamRef: React.RefObject<Webcam>) {
  return webCamRef.current?.video;
}

function getCanvasElement(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {
  return canvasRef.current;
}

export function CameraDetector(props: DetectorProps) {
  const detections = useRef<Array<Detection>>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [firstDetection, setFirstDetection] = useState<boolean>(false);

  useEffect(() => {
    if (firstDetection) {
      ReactGA.event({
        category: 'ml',
        action: 'first_detection',
      });
    }
  }, [firstDetection]);

  // Animation handler
  const detectOnFrame = () => {
    const video = getVideoElement(webcamRef);
    const canvas = getCanvasElement(canvasRef);
    if (!video || !canvas) return;

    copyVideoToCanvas(video, canvas);

    const d = detectYolo(canvasRef as MutableRefObject<HTMLCanvasElement>);

    if (d.length && !firstDetection) {
      setFirstDetection(true);
    }
    drawDetections(canvasRef as MutableRefObject<HTMLCanvasElement>, d);
    detections.current = d;

    requestAnimationFrame(detectOnFrame);
  };

  const onSnap = () => {
    const video = getVideoElement(webcamRef);
    if (!video) return;

    // report snap envent
    ReactGA.event({
      category: 'user',
      action: 'img_snap',
    });

    // create temp canvas
    const canvas = document.createElement('canvas');
    canvas.width = props.screenSize.width;
    canvas.height = props.screenSize.height;
    copyVideoToCanvas(video, canvas);
    const data = canvas.toDataURL('image/png');

    props.onSnap(data, detections.current);
  };

  const onUserMediaError = (_: string | DOMException) => {
    ReactGA.event({
      category: 'video',
      action: 'on_user_media_error',
      nonInteraction: true,
    });
    // eslint-disable-next-line no-console
    console.error('No media devices found');
  };

  const onUserMedia = (_: MediaStream) => {
    ReactGA.event({
      category: 'video',
      action: 'on_user_media',
      nonInteraction: true,
    });

    const video = getVideoElement(webcamRef);
    const canvas = getCanvasElement(canvasRef);
    if (!video || !canvas) return;

    video.addEventListener('play', (e) => {
      ReactGA.event({
        category: 'video',
        action: 'on_user_media_play',
        nonInteraction: true,
      });
      configureVideoSize(props.screenSize, video);
      detectOnFrame();
      setCameraEnabled(true);
    });
  };

  const onUploadClick = () => {

  };

  if (!isWasmLoaded()) {
    return (<Navigate replace to="/" />);
  }

  const uploadButton = <Button variant="contained" aria-label="upload" onClick={onUploadClick}> Upload Photo </Button>;
  return (
    <div className="camera-detector">
      <div className="main">
        <Webcam
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
          ref={webcamRef}
          videoConstraints={{
            facingMode: 'environment',
            height: { ideal: window.innerHeight },
          }}
        />
        <canvas id="app-canvas" ref={canvasRef} width={props.screenSize.width} height={props.screenSize.height} />
        <div className="overlay">
          <div className="overlay-text-1">
            Get it up and stick it in
            <br />
            this sexy box
          </div>
          <div className="overlay-text-2">
            It will help align everything nicely.
            <br />
            You&apos;re going to like it ;)
          </div>
        </div>
        <div className="app-control">
          <Fab color="primary" aria-label="add" disabled={!cameraEnabled} onClick={onSnap}>
            <CameraIcon />
          </Fab>
        </div>

        <Header extraButton={uploadButton} />
      </div>
    </div>
  );
}
