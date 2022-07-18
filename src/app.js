import React, { useEffect, useRef } from 'react';
import { detectYolo } from './detect_yolo.js';

import { useYolo } from './use_yolo.js';
import Photo from '/public/dp1.jpg';

const BASE_SIZE = 640;

export function App() {
  const loaded = useYolo();
  const canvasRef = useRef();

  useEffect(() => {
    const img = new Image();
    img.src = Photo;
    img.onload = () => {
      const {width, height} = img;
      let scaleWidth = BASE_SIZE;
      let scaledHeight = BASE_SIZE;
      if (width > height) {
        const wpercent = BASE_SIZE / width;
        scaledHeight = height * wpercent;
      } else {
        const hpercent = BASE_SIZE / height;
        scaleWidth = width * hpercent;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")
      context.drawImage(img, 0, 0, scaleWidth, scaledHeight);
    }
  }, []);

  const onClick = (e) => {
    if (!loaded) console.log('not loaded');
    const detections = detectYolo(canvasRef);
    console.log(detections);
  };


  return (
    <div>
      <button onClick={onClick}>
        Click me
      </button>
      <canvas id="app-canvas" ref={canvasRef} width="640" height="640"></canvas>
    </div>
  );
}