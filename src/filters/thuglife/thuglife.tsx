import * as React from 'react';
import { getDickHeadBox, getDickBox } from '../../helpers';
import type { FilterProps } from '../types';

import GlassesSrc from './thug-glasses.png';
import SmokeSrc from './smoke.png';
import Smoke2Src from './smoke2.png';

import { useEffect } from 'react';

export function Thuglife(props: FilterProps) {
    const dick = getDickBox(props.detections);
    const dickHead = getDickHeadBox(props.detections)
    if (!dickHead || !dick) return null;

    useEffect(() => {
        props.setBackgroundConfig({
            type: 'blur',
        });

    }, [])

    const {headWidth, headY, headX } = dickHead;

    return (
        <div className='overlay-cont'>
            <img
                className="overlay" 
                alt="overlay" 
                src={SmokeSrc}
                style={{
                    top: `0px`,
                    left: `0px`,
                    width: `100%`,
                    transform: 'rotate(180deg)',
                }}
            />
            <img
                className="overlay" 
                alt="overlay" 
                src={GlassesSrc}
                style={{
                    top: `${headY*1.1}px`,
                    left: `${headX*1.1}px`,
                    width: `${headWidth*1.1}px`,
                }}
            />
            <img
                className="overlay" 
                alt="overlay" 
                src={Smoke2Src}
                style={{
                    bottom: `0px`,
                    left: `0px`,
                    width: `100%`,
                }}
            />
        </div> 
    );
}