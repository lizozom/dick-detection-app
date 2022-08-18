import { Detection, BackgroundConfig } from "../helpers";

export interface FilterProps {
    detections: Array<Detection>
    setBackgroundConfig: (backgroundConfig:BackgroundConfig) => void
}
