import * as React from 'react';
import { useState } from 'react';
import { CameraDetector } from './camera_detector';
import { SnapEditor } from './snap_editor';
import { Detection } from './helpers';
import { SplashScreen } from './splash_screen';

export function App() {
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
      <SplashScreen onStartClick={() => setStarted(true)} />
    );
  } if (snap) {
    return (
      <SnapEditor snap={snap} detections={detections} onClear={onClear} screenSize={screenSize} />
    );
  }
  return (
    <CameraDetector onSnap={onSnap} screenSize={screenSize} />
  );
}
