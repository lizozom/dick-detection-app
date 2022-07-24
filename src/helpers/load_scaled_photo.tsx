import type { MutableRefObject } from 'react';

export function loadScaledPhotoToCanvas(canvasRef: MutableRefObject<HTMLCanvasElement>, photo: string) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const BASE_SIZE = canvas.width; // assumes canvas is square
    const img = new Image();
    img.src = photo;
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

      ctx.drawImage(img, 0, 0, scaleWidth, scaledHeight);
    }
}