import * as React from 'react';
import {
  useRef, useState, useEffect, ReactNode,
} from 'react';
import type { ChangeEvent, MutableRefObject } from 'react';
import ReactGA from 'react-ga4';
import Webcam from 'react-webcam';
import { Button, Fab } from '@mui/material';
import CameraIcon from '@mui/icons-material/Camera';
import { Header, ErrorModal } from './components';
import type { ScreenSize } from './types';
import {
  copyImageToCanvas, copyVideoToCanvas, Detection, detectYolo, drawDetections, isWasmLoaded,
} from './helpers';
import './camera_detector.scss';

export interface DetectorProps {
  screenSize: ScreenSize;
  onSnap: (imgData: string, d: Array<Detection>) => void;
}

interface FreshDetections {
  detections: Array<Detection>;
  timestamp: number;
}

function configureVideoSize(screenSize: ScreenSize, video: HTMLVideoElement) {
  const { videoHeight, videoWidth } = video;

  // Video should cover height and be centered
  const vidElemHeight = screenSize.height;
  const vidElemWidth = Math.round(videoWidth * (screenSize.height / videoHeight));

  video.setAttribute('height', String(vidElemHeight));
  video.setAttribute('width', String(vidElemWidth));
}

function getVideoElement(webCamRef: React.RefObject<Webcam>) {
  return webCamRef.current?.video;
}

function getCanvasElement(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {
  return canvasRef.current;
}

export function CameraDetector(props: DetectorProps) {
  const [detections, setDetections] = useState<FreshDetections>({
    detections: [],
    timestamp: new Date().getTime(),
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [firstDetection, setFirstDetection] = useState<boolean>(false);
  const [error, setError] = useState<string | ReactNode | undefined>();

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

    const d = detectYolo(canvasRef.current);

    if (d.length && !firstDetection) {
      setFirstDetection(true);
    }
    drawDetections(canvasRef as MutableRefObject<HTMLCanvasElement>, d);

    // Delay clearing last detections to smooth up the ux
    const now = new Date().getTime();
    if (d.length >= 2 || now - detections.timestamp > 1500) {
      setDetections({
        detections: d,
        timestamp: now,
      });
    }
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

    props.onSnap(data, detections.detections);
  };

  const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    ReactGA.event({
      category: 'user',
      action: 'img_upload_request',
    });

    if (files?.length) {
      const img = new Image();
      img.onload = () => {
        ReactGA.event({
          category: 'user',
          action: 'img_upload_success',
        });
        const canvas = document.createElement('canvas');
        canvas.width = props.screenSize.width;
        canvas.height = props.screenSize.height;
        copyImageToCanvas(img, canvas);

        const d = detectYolo(canvas);

        if (d.length) {
          const imgData = canvas.toDataURL('image/png');
          props.onSnap(imgData, d);
        } else {
          setError(
            <div>
              <p>Please upload a duckpuc.</p>
              <p>If you don&apos;t have one or you&apos;re feeling shy, finger photos work too!</p>
            </div>,
          );
        }
      };
      img.onerror = (e) => {
        ReactGA.event({
          category: 'user',
          action: 'img_upload_error',
          label: (e instanceof Error) ? e.message : e as string,
        });
        setError('Failed to upload image');
      };
      img.src = URL.createObjectURL(files[0]);
    }
  };

  const onUserMediaError = (e: string | DOMException) => {
    ReactGA.event({
      category: 'video',
      action: 'on_user_media_error',
      label: (e instanceof DOMException) ? e.message : e,
      nonInteraction: true,
    });
    setError('Couldn\'t find a media device');
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

  const uploadButton = (
    <Button variant="contained" aria-label="upload" component="label">
      Upload
      <input hidden accept="image/*" type="file" onChange={onImageUpload} />
    </Button>
  );
  return (
    <div className="camera-detector">
      <Header extraButton={uploadButton} extraClass="floating" />
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
          <div className="overlay-text">
            <div className="overlay-text-1">
              Get it up and stick it in
              <br />
              this sexy box
            </div>
            <div className="overlay-text-2">
              Or upload a
              {' '}
              <b>duckpuc</b>
              {' '}
              from your device.
            </div>
          </div>
        </div>
        <div className="app-control">
          <Fab color="primary" aria-label="add" disabled={!cameraEnabled || detections.detections.length < 2} onClick={onSnap}>
            <CameraIcon />
          </Fab>
        </div>

        <ErrorModal closeModal={() => setError(undefined)} message={error} />
      </div>
    </div>
  );
}
