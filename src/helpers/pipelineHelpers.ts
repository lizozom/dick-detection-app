export type InputResolution = '640x360' | '256x256' | '256x144' | '160x96'

export const inputResolutions: {
  [resolution in InputResolution]: [number, number]
} = {
  '640x360': [640, 360],
  '256x256': [256, 256],
  '256x144': [256, 144],
  '160x96': [160, 96],
}

export function getTFLiteModelFileName(
  inputResolution: InputResolution
) {
    return inputResolution === '256x144' ? 'segm_full_v679' : 'segm_lite_v681'
}


export type BackgroundConfig = {
  type: 'none' | 'blur' | 'image'
  url?: string
}
export type RenderingPipeline = {
  render(): Promise<void>
  cleanUp(): void
}

export type SourcePlayback = {
  htmlElement: HTMLVideoElement | HTMLImageElement
  width: number
  height: number
}
