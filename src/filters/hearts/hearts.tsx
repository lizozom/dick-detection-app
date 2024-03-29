import * as React from 'react';
import { useEffect } from 'react';
import { getDickHeadBox } from '../../helpers';
import type { FilterProps } from '../types';

import HeartsSrc from './hearts.png';
import LoveEyesSrc from './love-eyes.png';
import ValentinesBgSrc from './valentines.jpg';

export function Hearts(props: FilterProps) {
    const dickHead = getDickHeadBox(props.detections)
    if (!dickHead) return null;
    
    useEffect(() => {
        props.setBackgroundConfig({
            type: 'image',
            url: ValentinesBgSrc,
        });

    }, [])


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