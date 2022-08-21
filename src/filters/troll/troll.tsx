import * as React from 'react';
import { getDickHeadBox, getDickBox } from '../../helpers';
import type { FilterProps } from '../types';

import TrollFaceSrc from './troll-face.png';

import { useEffect } from 'react';

export function Troll(props: FilterProps) {
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
                src={TrollFaceSrc}
                style={{
                    top: `${headY * 1.1}px`,
                    left: `${headX}px`,
                    width: `${headWidth}px`,
                }}
            />
        </div> 
    );
}