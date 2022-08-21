import * as React from 'react';
import { BackgroundConfig } from '../helpers/pipelineHelpers';

import type { Detection } from '../helpers';
import { Gentleman, GentlemanLogo } from './gentleman';
import { Hipster, HipsterLogo } from './hipster';
import { Grass, GrassLogo } from './grass';
import { Hearts, HeartsLogo } from './hearts';
import { Rain, RainLogo } from './rain';
import { Santa, SantaLogo } from './santa';

import "./index.scss";

export interface OverlayItem {
    id: string;
    src: string;
    render: (detections: Array<Detection>, setBackgroundConfig: (backgroundConfig: BackgroundConfig) => void) => JSX.Element;
}

export const items: Array<OverlayItem> = [{
        id: 'gentleman',
        src: GentlemanLogo,
        render: (detections, setBackgroundConfig) => <Gentleman detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }, {
        id: 'hipster',
        src: HipsterLogo,
        render: (detections, setBackgroundConfig) => <Hipster detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    },{
        id: 'grass',
        src: GrassLogo,
        render: (detections, setBackgroundConfig) => <Grass detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    },{
        id: 'santa',
        src: SantaLogo,
        render: (detections, setBackgroundConfig) => <Santa detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }, {
    //     id: 'frame',
    //     src: FrameSrc,
    //     render: (detections) => <Frame detections={detections}/>
    // }, {
        id: 'rain',
        src: RainLogo,
        render: (detections, setBackgroundConfig) => <Rain detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }, {
        id: 'hearts',
        src: HeartsLogo,
        render: (detections, setBackgroundConfig) => <Hearts detections={detections} setBackgroundConfig={setBackgroundConfig}/>
    }];