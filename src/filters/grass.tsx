import * as React from 'react';
import { getDetection, DICK } from '../helpers';
import type { FilterProps } from './types';

// @ts-ignore
import GrassSrc from '/public/filters/grass.png';

import "./grass.scss";

export function Grass(props: FilterProps) {
    const dick = getDetection(props.detections, DICK);
    const top = dick?.bbox_y || 0 + (dick?.bbox_y || 0);
    return (
        <div className='overlay-cont grass'>
            <img
                className="overlay" 
                alt="overlay" 
                src={GrassSrc}
            />
        </div> 
    );
}