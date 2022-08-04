
export function copyVideoToCanvas(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
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


export function copyImageToCanvas(image: HTMLImageElement, canvas: HTMLCanvasElement) {
    const { width, height } = image;
    const { width: canvasWidth, height: canvasHeight } = canvas;
  
    const ratio = height / canvasHeight;
    const canvasWidthToCopy = canvasWidth * ratio;
  
    const margin = Math.abs(canvasWidthToCopy - width) / 2;
  
    // Draw video frame onto canvas
    const ctx = canvas.getContext('2d')!;
    // ctx.fillRect(0, 0, w, h);
    ctx.drawImage(image, margin, 0, canvasWidthToCopy, height, 0, 0, canvasWidth, canvasHeight);
  }