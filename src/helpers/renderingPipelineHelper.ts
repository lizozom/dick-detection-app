import { PostProcessingConfig } from './postProcessingHelper'

export type RenderingPipeline = {
  render(): Promise<void>
  cleanUp(): void
}
