import * as React from 'react';
import { getDetection, DICK_HEAD } from '../helpers';
import type { FilterProps } from './types';

// @ts-ignore
import HeartsSrc from '/public/filters/hearts.png';

export function Hearts(props: FilterProps) {
    const dickHead = getDetection(props.detections, DICK_HEAD);
    const top = (dickHead?.bbox_y || 0) + (dickHead?.bbox_h || 0) * 0.3;
    return (
        <div className="overlay-cont">
            <img
                className="overlay" 
                alt="overlay" 
                src={HeartsSrc}
                style={{
                    bottom: '0px',
                    top: 'auto',
                    left: 'auto',
                    width: '100%',
                }}
            />
            
        </div>
        );
}