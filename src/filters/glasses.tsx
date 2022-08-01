import * as React from 'react';
import { getDetection, DICK_HEAD } from '../helpers';
import type { FilterProps } from './types';

// @ts-ignore
import GlassesSrc from '/public/filters/glasses.png';

export function Glasses(props: FilterProps) {
    const dickHead = getDetection(props.detections, DICK_HEAD);
    const top = (dickHead?.bbox_y || 0) + (dickHead?.bbox_h || 0) * 0.3;
    return (
        <div className='overlay-cont'>
            <img
                className="overlay" 
                alt="overlay" 
                src={GlassesSrc}
                style={{
                    top: top > 0 ? top + 'px' : '50%',
                    left: dickHead?.bbox_x + 'px' || 'auto',
                    width: dickHead?.bbox_w ? dickHead?.bbox_w + 'px' : '80%',
                }}
            />
        </div>);
}