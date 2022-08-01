import * as React from 'react';

import type { Detection } from '../helpers';
import { Gentleman } from './genetleman';
import { Hispter } from './hipster';
import { Frame } from './frame';
import { Grass } from './grass';
import { Hearts } from './hearts';
import { Rain } from './rain';

// @ts-ignore
import MustacheSrc from '/public/filters/mustache.png';
// @ts-ignore
import GlassesSrc from '/public/filters/glasses.png';
// @ts-ignore
import FrameSrc from '/public/filters/frame.png';
// @ts-ignore
import RainSrc from '/public/filters/rain.png';
// @ts-ignore
import GrassSrc from '/public/filters/grass.png';
// @ts-ignore
import HeartsSrc from '/public/filters/hearts.png';

import "./index.scss";

export interface OverlayItem {
    id: string;
    src: string;
    render: (detections: Array<Detection>) => JSX.Element;
}

export const items: Array<OverlayItem> = [{
        id: 'gentleman',
        src: MustacheSrc,
        render: (detections) => <Gentleman detections={detections}/>
    }, {
        id: 'hipster',
        src: GlassesSrc,
        render: (detections) => <Hispter detections={detections}/>
    }, {
        id: 'frame',
        src: FrameSrc,
        render: (detections) => <Frame detections={detections}/>
    }, {
        id: 'rain',
        src: RainSrc,
        render: (detections) => <Rain detections={detections}/>
    }, {
        id: 'hearts',
        src: HeartsSrc,
        render: (detections) => <Hearts detections={detections}/>
    },{
        id: 'grass',
        src: GrassSrc,
        render: (detections) => <Grass detections={detections}/>
    }];