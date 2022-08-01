import * as React from 'react';
import { getDetection, DICK_HEAD } from '../helpers';
import type { FilterProps } from './types';

// @ts-ignore
import RainSrc from '/public/filters/rain.png';

export function Rain(props: FilterProps) {
    const dickHead = getDetection(props.detections, DICK_HEAD);
    const top = (dickHead?.bbox_y || 0) + (dickHead?.bbox_h || 0) * 0.3;
    
    return (
        
        <div className='overlay-cont' style={{

            backgroundSize: 'contain',
            backgroundRepeat: 'repeat-y',
            backgroundImage: `url("${RainSrc}")`,

        }}>
        </div>
    )
}