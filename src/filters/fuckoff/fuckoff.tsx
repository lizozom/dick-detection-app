import * as React from 'react';
import { getDickHeadBox, getDickBox } from '../../helpers';
import type { FilterProps } from '../types';

import FuckOffSrc from './fuck-off.png';

import { useEffect } from 'react';

export function Fuckoff(props: FilterProps) {
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
                src={FuckOffSrc}
                style={{
                    top: `${headY*0.9}px`,
                    left: `${headX * 0.7}px`,
                    width: `${headWidth*2}px`,
                }}
            />
        </div> 
    );
}