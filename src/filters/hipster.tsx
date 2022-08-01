import * as React from 'react';
import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { getDetection, DICK_HEAD } from '../helpers';
import type { FilterProps } from './types';

// @ts-ignore
import GlassesSrc from '/public/filters/glasses.png';
// @ts-ignore
import CigaretteSrc from '/public/filters/cigarette.png';

export function Hispter(props: FilterProps) {
    const [topHatHeight, setTopHatHeight] = useState<number>(0);
    const dickHead = getDetection(props.detections, DICK_HEAD);
    const top = (dickHead?.bbox_y || 0) + (dickHead?.bbox_h || 0) * 0.3;

    const onLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        setTopHatHeight(e.currentTarget.height);
    }
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
            <img
                className="overlay" 
                alt="overlay" 
                src={CigaretteSrc}
                style={{
                    top: top > 0 ? top + 'px' : '50%',
                    left: (dickHead?.bbox_x || 0) * 0.7 + 'px' || 'auto',
                    width: dickHead?.bbox_w ? dickHead?.bbox_w + 'px' : '80%',
                }}
            />
        </div>);
}