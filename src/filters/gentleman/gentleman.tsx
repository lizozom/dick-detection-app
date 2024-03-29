import * as React from 'react';
import type { SyntheticEvent } from 'react';
import { useState, useEffect } from 'react';
import { getDetection, DICK_HEAD } from '../../helpers';
import type { FilterProps } from '../types';

import MustacheSrc from './mustache.png';
import TopHatSrc from './tophat.png';
import ClubSrc from './club.jpg';

export function Gentleman(props: FilterProps) {
    const [topHatHeight, setTopHatHeight] = useState<number>(0);

    const dickHead = getDetection(props.detections, DICK_HEAD);
    const topHead = (dickHead?.bbox_y || 0) - topHatHeight * 0.5;
    const top = (dickHead?.bbox_y || 0) + (dickHead?.bbox_h || 0) * 0.5;

    useEffect(() => {
        props.setBackgroundConfig({
            type: 'image',
            url: ClubSrc,
        });

    }, [])

    const onLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        setTopHatHeight(e.currentTarget.height);
    }

    return (
        <div className='overlay-cont'>
        <img
            className="overlay" 
            alt="overlay" 
            src={TopHatSrc}
            onLoad={onLoad}
            style={{
                top: topHead > 0 ? topHead + 'px' : '50%',
                left: dickHead?.bbox_x + 'px' || 'auto',
                width: dickHead?.bbox_w ? dickHead?.bbox_w + 'px' : '80%',
            }}
        />
        <img
            className="overlay" 
            alt="overlay" 
            src={MustacheSrc}
            style={{
                top: top > 0 ? top + 'px' : '50%',
                left: dickHead?.bbox_x + 'px' || 'auto',
                width: dickHead?.bbox_w ? dickHead?.bbox_w + 'px' : '80%',
            }}
        />
        </div>);
}