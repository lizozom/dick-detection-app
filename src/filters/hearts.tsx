import * as React from 'react';
import { getDickHeadBox, getDickBox } from '../helpers';
import type { FilterProps } from './types';

// @ts-ignore
import HeartsSrc from './images/hearts.png';
// @ts-ignore
import LoveEyesSrc from './images/love-eyes.png';

export function Hearts(props: FilterProps) {
    const dickHead = getDickHeadBox(props.detections)
    if (!dickHead) return null;

    const {headWidth, headY, headX } = dickHead;

    return (
        <div className="overlay-cont">
            <img
                className="overlay" 
                alt="overlay" 
                src={LoveEyesSrc}
                style={{
                    top: `${headY*1.1}px`,
                    left: `${headX * 1.1}px`,
                    width: `${headWidth * 0.8}px`,
                }}
            />
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