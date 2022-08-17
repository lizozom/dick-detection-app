import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import {
  getTFLiteModelFileName,
  SegmentationConfig,
} from '../helpers/segmentationHelper'
import { useMLMoudle } from './useMLModule'
import { useWasmFeatures } from './useWasmFeatures'

declare function createTFLiteModule(): Promise<TFLite>
declare function createTFLiteSIMDModule(): Promise<TFLite>

export const isTFLite = (tbd: any): tbd is TFLite => {return tbd.hasOwnProperty('_runInference')}

export interface TFLite extends EmscriptenModule {
  _getModelBufferMemoryOffset(): number
  _getInputMemoryOffset(): number
  _getInputHeight(): number
  _getInputWidth(): number
  _getInputChannelCount(): number
  _getOutputMemoryOffset(): number
  _getOutputHeight(): number
  _getOutputWidth(): number
  _getOutputChannelCount(): number
  _loadModel(bufferSize: number): number
  _runInference(): number
}

export function useTFLite() {
  const { simd } = useWasmFeatures();
  const [ moduleName, setModuleName ] = useState<string>();
  const [ moduleFnName, setModuleFnName ] = useState<string>();
  const [ tfliteInit, settfliteInit ] = useState<TFLite>();

  const reportEvent = (action: string) => {
    ReactGA.event({
      category: 'ml',
      action,
      label: moduleName,
      nonInteraction: true,
    })
  }

  useEffect(() => {    
    reportEvent('use_tflite');
    if (simd === undefined) return;

    if (simd) {
      setModuleName('tflite/tflite-simd')
      setModuleFnName('createTFLiteSIMDModule')
    } else {
      setModuleName('tflite/tflite')
      setModuleFnName('createTFLiteModule')
    }
  }, [simd]);

  const { module: tflite, error } = useMLMoudle<TFLite>(moduleName, moduleFnName);

  useEffect(() => {
    async function loadTFLiteModel() {
      if (!tflite) {
        return
      }

      const modelFileName = getTFLiteModelFileName('256x144')
      console.log('Loading tflite model:', modelFileName)

      const modelResponse = await fetch(
        `/models/${modelFileName}.tflite`
      )
      const model = await modelResponse.arrayBuffer()
      console.log('Model buffer size:', model.byteLength)

      const modelBufferOffset = tflite._getModelBufferMemoryOffset()
      console.log('Model buffer memory offset:', modelBufferOffset)
      console.log('Loading model buffer...')
      tflite.HEAPU8.set(new Uint8Array(model), modelBufferOffset)
      console.log(
        '_loadModel result:',
        tflite._loadModel(model.byteLength)
      )

      console.log(
        'Input memory offset:',
        tflite._getInputMemoryOffset()
      )
      console.log('Input height:', tflite._getInputHeight())
      console.log('Input width:', tflite._getInputWidth())
      console.log('Input channels:', tflite._getInputChannelCount())

      console.log(
        'Output memory offset:',
        tflite._getOutputMemoryOffset()
      )
      console.log('Output height:', tflite._getOutputHeight())
      console.log('Output width:', tflite._getOutputWidth())
      console.log(
        'Output channels:',
        tflite._getOutputChannelCount()
      )

      settfliteInit(tflite)

    }

    loadTFLiteModel()
  }, [
    tflite
  ])

  return { tflite: tfliteInit, error }
}

