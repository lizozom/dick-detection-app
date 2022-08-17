import { useState, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useMLMoudle } from './useMLModule'
import { useWasmFeatures } from './useWasmFeatures'


export const isYolo = (tbd: any): tbd is YoloModel => {return tbd.hasOwnProperty('_yolo_ncnn')}
export interface YoloModel extends EmscriptenModule {
  _yolo_ncnn(dst: any, width: number, height: number, resultbuffer: any): number
}

declare function createYoloModule(): Promise<YoloModel>

export function useYolo() {
  const [yoloModuleName, setYoloModuleName] = useState<string | undefined>()

  const reportEvent = (action: string) => {
    ReactGA.event({
      category: 'ml',
      action,
      label: yoloModuleName,
      nonInteraction: true,
    })
  }

  const { simd, threads } = useWasmFeatures();

  useEffect(() => {    
    reportEvent('use_yolo');
    if (simd === undefined || threads === undefined) return;

    if (simd && threads) {
      setYoloModuleName('duckpuc')
    } else if (threads) {
      setYoloModuleName('duckpuc-ios-new')
    } else {
      setYoloModuleName('duckpuc-ios-old')
    }
  }, [simd, threads]);

  return useMLMoudle<YoloModel>(yoloModuleName, 'createYoloModule');
}
