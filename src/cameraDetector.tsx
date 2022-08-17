import * as React from 'react';
import {
  useRef, useState, useEffect, ReactNode,
} from 'react';
import type { ChangeEvent } from 'react';
import ReactGA from 'react-ga4';
import Webcam from 'react-webcam';
import { Button, Fab } from '@mui/material';
import CameraIcon from '@mui/icons-material/Camera';
import { Header, ErrorModal } from './components';
import type { ScreenSize } from './types';
import {
  copyToCanvas, Detection, detectYolo,
} from './helpers';
import './cameraDetector.scss';
import { YoloModel, useRenderingPipeline } from './hooks';
import { SourcePlayback } from './helpers/sourceHelper';

export interface DetectorProps {
  yolo?: YoloModel;
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

export function CameraDetector(props: DetectorProps) {
  const webcamRef = useRef<Webcam>(null);
  const [sourcePlayback, setSourcePlayback] = useState<SourcePlayback>();
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [firstDetection, setFirstDetection] = useState<boolean>(false);
  const [error, setError] = useState<string | ReactNode | undefined>();
  const [detections, setDetections] = useState<FreshDetections>({
    detections: [],
    timestamp: new Date().getTime(),
  });

  const onDetections = (d: Array<Detection>) => {
    if (!firstDetection && d.length > 0) {
      setFirstDetection(true);
    }
    // Delay clearing last detections to smooth up the ux
    const now = new Date().getTime();
    if (d.length >= 2 || now - detections.timestamp > 1500) {
      setDetections({
        detections: d,
        timestamp: now,
      });
    }
  };

  const {
    canvasRef,
  } = useRenderingPipeline(
    sourcePlayback,
    props.yolo,
    {
      onDetections,
    },
  );

  useEffect(() => {
    if (firstDetection) {
      ReactGA.event({
        category: 'ml',
        action: 'first_detection',
      });
    }
  }, [firstDetection]);

  const onSnap = () => {
    const video = sourcePlayback?.htmlElement;
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
    copyToCanvas(video, canvas);
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
        copyToCanvas(img, canvas);

        const d = detectYolo(props.yolo, canvas);

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

    const video = webcamRef.current!.video!;

    video.addEventListener('play', (e) => {
      ReactGA.event({
        category: 'video',
        action: 'on_user_media_play',
        nonInteraction: true,
      });
      configureVideoSize(props.screenSize, video);
      setCameraEnabled(true);

      setSourcePlayback({
        htmlElement: video,
        width: Number(video.getAttribute('width') || '1'),
        height: Number(video.getAttribute('height') || '1'),
      });
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
          ref={webcamRef}
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
          videoConstraints={{
            facingMode: 'environment',
            height: { ideal: window.innerHeight },
          }}
        />
        <canvas
          id="app-canvas"
          ref={canvasRef}
          width={props.screenSize.width}
          height={props.screenSize.height}
        />
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
