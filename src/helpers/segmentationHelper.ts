export type SegmentationModel = 'bodyPix' | 'meet' | 'mlkit'
export type SegmentationBackend = 'webgl' | 'wasm' | 'wasmSimd'
export type InputResolution = '640x360' | '256x256' | '256x144' | '160x96'

export const inputResolutions: {
  [resolution in InputResolution]: [number, number]
} = {
  '640x360': [640, 360],
  '256x256': [256, 256],
  '256x144': [256, 144],
  '160x96': [160, 96],
}

export type PipelineName = 'canvas2dCpu' | 'webgl2'

export type SegmentationConfig = {
  model: SegmentationModel
  backend: SegmentationBackend
  inputResolution: InputResolution
  pipeline: PipelineName
}

export function getTFLiteModelFileName(
  inputResolution: InputResolution
) {
    return inputResolution === '256x144' ? 'segm_full_v679' : 'segm_lite_v681'
}
