import * as React from 'react';
import { BackgroundConfig } from '../helpers/pipelineHelpers';

import type { Detection } from '../helpers';
import { Gentleman } from './genetleman';
import { Hispter } from './hipster';
import { Frame } from './frame';
import { Grass } from './grass';
import { Hearts } from './hearts';
import { Rain } from './rain';
import { Santa } from './santa';

// @ts-ignore
import MustacheSrc from './images/mustache.png';
// @ts-ignore
import GlassesSrc from './images/glasses.png';
// @ts-ignore
import FrameSrc from './images/frame.png';
// @ts-ignore
import RainSrc from './images/rain.png';
// @ts-ignore
import GrassSrc from './images/grass.png';
// @ts-ignore
import HeartsSrc from './images/hearts.png';
// @ts-ignore
import SantaHatSrc from './images/christmas.png';

import "./index.scss";

export interface OverlayItem {
    id: string;
    src: string;
    render: (detections: Array<Detection>, setBackgroundConfig: (backgroundConfig: BackgroundConfig) => void) => JSX.Element;
}

export const items: Array<OverlayItem> = [{
        id: 'gentleman',
        src: MustacheSrc,
        render: (detections, setBackgroundConfig) => <Gentleman detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }, {
        id: 'hipster',
        src: GlassesSrc,
        render: (detections, setBackgroundConfig) => <Hispter detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    },{
        id: 'grass',
        src: GrassSrc,
        render: (detections, setBackgroundConfig) => <Grass detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    },{
        id: 'santa',
        src: SantaHatSrc,
        render: (detections, setBackgroundConfig) => <Santa detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }, {
    //     id: 'frame',
    //     src: FrameSrc,
    //     render: (detections) => <Frame detections={detections}/>
    // }, {
        id: 'rain',
        src: RainSrc,
        render: (detections, setBackgroundConfig) => <Rain detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }, {
        id: 'hearts',
        src: HeartsSrc,
        render: (detections, setBackgroundConfig) => <Hearts detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }];