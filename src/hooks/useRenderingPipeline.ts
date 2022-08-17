import { useEffect, useRef, useState } from 'react'
import { buildCanvas2dYoloPipeline, buildCanvas2dPipeline } from '../pipelines'
import { RenderingPipeline } from '../helpers/renderingPipelineHelper'
import { SourcePlayback } from '../helpers/sourceHelper'
import { isYolo } from './useYolo'
import { Detection } from '../helpers'
import { isTFLite } from './useTFLite'

export function useRenderingPipeline<T extends EmscriptenModule>(
  sourcePlayback?: SourcePlayback,
  emsModule?: T,
  extras?: Record<string, any>,
) {
  const [pipeline, setPipeline] = useState<RenderingPipeline | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const [fps, setFps] = useState(0)
  const [durations, setDurations] = useState<number[]>([])

  useEffect(() => {
    if (!sourcePlayback || !emsModule) return;

    let modelName: string;

    // The useEffect cleanup function is not enough to stop
    // the rendering loop when the framerate is low
    let shouldRender = true

    let previousTime = 0
    let beginTime = 0
    let eventCount = 0
    let frameCount = 0
    const frameDurations: number[] = []

    let renderRequestId: number

    let newPipeline: RenderingPipeline;


    if (isYolo(emsModule)) {
      newPipeline = buildCanvas2dYoloPipeline(
        sourcePlayback,
        canvasRef.current,
        emsModule,
        addFrameEvent,
        extras?.onDetections,
      )
      modelName = 'yolo'
    } else if (isTFLite(emsModule)) {
      newPipeline = buildCanvas2dPipeline(
        sourcePlayback,
        {
          type: 'blur',
        },
        canvasRef.current,
        emsModule,
        addFrameEvent,
        extras?.detections,
      )
      modelName = 'meet'

    } else {
      console.log('unknown model')
      return;
    }

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
      `Animation started ${modelName}:`,
      sourcePlayback,
    )

    setPipeline(newPipeline)

    return () => {
      shouldRender = false
      cancelAnimationFrame(renderRequestId)
      newPipeline.cleanUp()
      console.log(
        `Animation stopped ${modelName}:`,
        sourcePlayback,
      )

      setPipeline(null)
    }
  }, [sourcePlayback, emsModule])

  return {
    pipeline,
    canvasRef,
    fps,
    durations,
  }
}

