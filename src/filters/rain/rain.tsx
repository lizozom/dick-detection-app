import * as React from 'react';
import { getDickHeadBox } from '../../helpers';
import type { FilterProps } from '../types';

import RainSrc from './rain.png';
import UmbrellatTopSrc from './umbrella-top.png';
import LightningSrc from './lightning.png';

export function Rain(props: FilterProps) {
    const dickHead = getDickHeadBox(props.detections)
    if (!dickHead) return null;

    const {headWidth, headY, headX } = dickHead;
    const umbrellaWidth = headWidth * 3;
    const headMiddle = (headX + headX + headWidth) / 2;
    const umbrellaLeft = headMiddle - umbrellaWidth / 2;
    
    return (
        <div className='overlay-cont'>
            <img
                className="overlay" 
                alt="overlay" 
                src={LightningSrc}
                style={{
                    top: `0px`,
                    left: `0px`,
                    width: `100%`,
                }}
            />

            <img
                className="overlay" 
                alt="overlay" 
                src={UmbrellatTopSrc}
                style={{
                    top: `${headY}px`,
                    left: `${umbrellaLeft}px`,
                    width: `${umbrellaWidth}px`,
                }}
            />
            <div className='overlay-cont' style={{

                backgroundSize: 'contain',
                backgroundRepeat: 'repeat-y',
                backgroundImage: `url("${RainSrc}")`,

            }}>
            </div>
        
        </div>
    )
}