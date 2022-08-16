import { useEffect, useRef, useState } from 'react'
import { buildCanvas2dPipeline } from '../pipelines/canvas2d/canvas2dPipeline'
import { RenderingPipeline } from '../helpers/renderingPipelineHelper'
import { SourcePlayback } from '../helpers/sourceHelper'
import { YoloModel } from './useYolo'
import { Detection } from '../helpers'

export function useRenderingPipeline(
  sourcePlayback?: SourcePlayback,
  yolo?: YoloModel,
  onDetections?: (detections: Array<Detection>) => void
) {
  const [pipeline, setPipeline] = useState<RenderingPipeline | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const [fps, setFps] = useState(0)
  const [durations, setDurations] = useState<number[]>([])

  useEffect(() => {
    if (!sourcePlayback || !yolo) return;

    // The useEffect cleanup function is not enough to stop
    // the rendering loop when the framerate is low
    let shouldRender = true

    let previousTime = 0
    let beginTime = 0
    let eventCount = 0
    let frameCount = 0
    const frameDurations: number[] = []

    let renderRequestId: number

    const newPipeline = buildCanvas2dPipeline(
      sourcePlayback,
      canvasRef.current,
      yolo,
      addFrameEvent,
      onDetections,
    )

    async function render() {
      if (!shouldRender) {
        return
      }
      beginFrame()
      await newPipeline.render()
      endFrame()
      renderRequestId = requestAnimationFrame(render)
    }

    function beginFrame() {
      beginTime = Date.now()
    }

    function addFrameEvent() {
      const time = Date.now()
      frameDurations[eventCount] = time - beginTime
      beginTime = time
      eventCount++
    }

    function endFrame() {
      const time = Date.now()
      frameDurations[eventCount] = time - beginTime
      frameCount++
      if (time >= previousTime + 1000) {
        setFps((frameCount * 1000) / (time - previousTime))
        setDurations(frameDurations)
        previousTime = time
        frameCount = 0
      }
      eventCount = 0
    }

    render()
    console.log(
      'Animation started:',
      sourcePlayback,
    )

    setPipeline(newPipeline)

    return () => {
      shouldRender = false
      cancelAnimationFrame(renderRequestId)
      newPipeline.cleanUp()
      console.log(
        'Animation stopped:',
        sourcePlayback,
      )

      setPipeline(null)
    }
  }, [sourcePlayback, yolo])

  return {
    pipeline,
    canvasRef,
    fps,
    durations,
  }
}

