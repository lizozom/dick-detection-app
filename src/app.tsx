import * as React from 'react';
import { useState } from 'react';
import { CameraDetector } from './cameraDetector';
import { SnapEditor } from './snapEditor';
import { Detection } from './helpers';
import { SplashScreen } from './splashScreen';
import { useYolo } from './hooks';
import { useTFLite } from './hooks/useTFLite';

export function App() {
  const { module: yolo, error: loadError } = useYolo();
  const { tflite } = useTFLite();
  const [started, setStarted] = useState<boolean>(false);
  const [snap, setSnap] = useState<string | null>(null);
  const [detections, setDetections] = useState<Array<Detection>>([]);
  const { clientHeight, clientWidth } = document.documentElement;
  const screenSize = {
    width: clientWidth,
    height: clientHeight,
  };

  const onSnap = (imgData: string, d: Array<Detection>) => {
    setSnap(imgData);
    setDetections(d);
  };

  const onClear = () => {
    setSnap(null);
  };

  if (!started) {
    return (
      <SplashScreen yolo={yolo}  loadError={loadError} onStartClick={() => setStarted(true)} />
    );
  } if (snap && tflite) {
    return (
      <SnapEditor tflite={tflite} snap={snap} detections={detections} onClear={onClear} screenSize={screenSize} />
    );
  }
  return (
    <CameraDetector yolo={yolo} onSnap={onSnap} screenSize={screenSize} />
  );
}
