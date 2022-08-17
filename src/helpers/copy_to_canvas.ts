
export function copyToCanvas(element: HTMLVideoElement | HTMLImageElement, canvas: HTMLCanvasElement) {
  let { width, height } = element;
  if (element instanceof HTMLVideoElement) {
    width = element.videoWidth;
    height = element.videoHeight;

  }
  const { width: canvasWidth, height: canvasHeight } = canvas;

  const ratio = height / canvasHeight;
  const canvasWidthToCopy = canvasWidth * ratio;

  const margin = Math.abs(canvasWidthToCopy - width) / 2;

  // Draw video frame onto canvas
  const ctx = canvas.getContext('2d')!;
  // ctx.fillRect(0, 0, w, h);
  ctx.drawImage(element, margin, 0, canvasWidthToCopy, height, 0, 0, canvasWidth, canvasHeight);
}

