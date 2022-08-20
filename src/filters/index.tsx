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

import MustacheSrc from './images/mustache.png';
import GlassesSrc from './images/glasses.png';
import RainSrc from './images/rain.png';
import GrassSrc from './images/grass.png';
import HeartsSrc from './images/hearts.png';
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