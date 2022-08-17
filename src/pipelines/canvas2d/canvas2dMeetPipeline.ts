import { Detection, DICK, drawDetections, getDetection, getDickBox } from '../../helpers'
import { BackgroundConfig } from '../../helpers/backgroundHelper'
import { PostProcessingConfig } from '../../helpers/postProcessingHelper'
import {
  inputResolutions,
} from '../../helpers/segmentationHelper'
import { SourcePlayback } from '../../helpers/sourceHelper'
import { TFLite } from '../../hooks/useTFLite'

export function buildCanvas2dPipeline(
  sourcePlayback: SourcePlayback,
  backgroundConfig: BackgroundConfig,
  canvas: HTMLCanvasElement,
  tflite: TFLite,
  addFrameEvent: () => void,
  detections?: Array<Detection>,
) {
  const ctx = canvas.getContext('2d')!

  const [segmentationWidth, segmentationHeight] = inputResolutions['256x144']
  const segmentationPixelCount = segmentationWidth * segmentationHeight
  const segmentationMask = new ImageData(segmentationWidth, segmentationHeight)
  const segmentationMaskCanvas = document.createElement('canvas')
  segmentationMaskCanvas.width = segmentationWidth
  segmentationMaskCanvas.height = segmentationHeight
  const segmentationMaskCtx = segmentationMaskCanvas.getContext('2d')!

  const tempMaskCanvas = document.createElement('canvas');
  tempMaskCanvas.width = sourcePlayback.width;
  tempMaskCanvas.height = sourcePlayback.height;
  const tempMaskCanvasCtx = tempMaskCanvas.getContext('2d')!

  const inputMemoryOffset = tflite._getInputMemoryOffset() / 4
  const outputMemoryOffset = tflite._getOutputMemoryOffset() / 4

  let postProcessingConfig: PostProcessingConfig

  async function render() {
    if (backgroundConfig.type !== 'none') {
      await resizeSource()
    }

    addFrameEvent()

    if (backgroundConfig.type !== 'none') {
      await runTFLiteInference()
    }

    addFrameEvent()

    runPostProcessing()
  }

  function cleanUp() {
    // Nothing to clean up in this rendering pipeline
  }

  async function resizeSource() {
    segmentationMaskCtx.drawImage(
      sourcePlayback.htmlElement,
      0,
      0,
      sourcePlayback.width,
      sourcePlayback.height,
      0,
      0,
      segmentationWidth,
      segmentationHeight
    )
    
    const imageData = segmentationMaskCtx.getImageData(
      0,
      0,
      segmentationWidth,
      segmentationHeight
    )

    for (let i = 0; i < segmentationPixelCount; i++) {
      tflite.HEAPF32[inputMemoryOffset + i * 3] = imageData.data[i * 4] / 255
      tflite.HEAPF32[inputMemoryOffset + i * 3 + 1] =
        imageData.data[i * 4 + 1] / 255
      tflite.HEAPF32[inputMemoryOffset + i * 3 + 2] =
        imageData.data[i * 4 + 2] / 255
    }
  }

  async function runTFLiteInference() {
    tflite._runInference()
    // const dickBox= getDetection(detections || [], DICK);

    for (let i = 0; i < segmentationPixelCount; i++) {
      const background = tflite.HEAPF32[outputMemoryOffset + i * 2]
      const person = tflite.HEAPF32[outputMemoryOffset + i * 2 + 1]
      const shift = Math.max(background, person)
      const backgroundExp = Math.exp(background - shift)
      const personExp = Math.exp(person - shift)

      segmentationMask.data[i * 4 + 3] = 
        (255 * personExp) / (backgroundExp + personExp) /* softmax */
    }
    segmentationMaskCtx.putImageData(segmentationMask, 0, 0);
  }

  function runPostProcessing() {
    ctx.globalCompositeOperation = 'copy'
    ctx.filter = 'none'

    if (postProcessingConfig?.smoothSegmentationMask) {
      if (backgroundConfig.type === 'blur') {
        ctx.filter = 'blur(8px)' // FIXME Does not work on Safari
      } else if (backgroundConfig.type === 'image') {
        ctx.filter = 'blur(4px)' // FIXME Does not work on Safari
      }
    }

    if (backgroundConfig.type !== 'none') {
      drawSegmentationMask()
      ctx.globalCompositeOperation = 'source-in'
      ctx.filter = 'none'
    }

    ctx.drawImage(sourcePlayback.htmlElement, 0, 0)

    if (backgroundConfig.type === 'blur') {
      blurBackground()
    }

    // if (detections) {
    //   ctx.filter = 'none' // FIXME Does not work on Safari
    //   ctx.globalCompositeOperation = 'source-over'
    //   drawDetections(canvas, detections);
    // }
  }
  function roundedRect(x: number, y: number, width: number, height: number, radius: number) {
    return new Path2D(`M ${x + radius} ${y} H ${x + width - radius} a ${radius} ${radius} 0 0 1 ${radius} ${radius} V ${y + height - radius} a ${radius} ${radius} 0 0 1 ${-radius} ${radius} H ${x + radius} a ${radius} ${radius} 0 0 1 ${-radius} ${-radius} V ${y + radius} a ${radius} ${radius} 0 0 1 ${radius} ${-radius}`);
  }

  async function drawSegmentationMask() {
    ctx.drawImage(
      segmentationMaskCanvas,
      0,
      0,
      segmentationWidth,
      segmentationHeight,
      0,
      0,
      sourcePlayback.width,
      sourcePlayback.height
    )

    // delete anything outside the dick box
    const dickBox= getDetection(detections || [], DICK);
    if (dickBox) {
      ctx.globalCompositeOperation = 'destination-in'
      ctx.filter = 'blur(8px)' 
      ctx.fill(roundedRect(dickBox.bbox_x, dickBox.bbox_y, dickBox.bbox_w, dickBox.bbox_h, 20));
    }
  }

  function blurBackground() {
    ctx.globalCompositeOperation = 'destination-over'
    ctx.filter = 'blur(8px)' // FIXME Does not work on Safari
    ctx.drawImage(sourcePlayback.htmlElement, 0, 0)
  }

  return { render, cleanUp }
}
