import * as React from 'react';
import { useEffect } from 'react';
import { getDickHeadBox, getDickBox } from '../../helpers';
import type { FilterProps } from '../types';

import GrassSrc from './grass.png';
import MarioHatSrc from './mario-hat.png';
import MeadowSrc from './meadow.jpg';

import "./grass.scss";

export function Grass(props: FilterProps) {
    const dick = getDickBox(props.detections);
    const dickHead = getDickHeadBox(props.detections)
    if (!dickHead || !dick) return null;


    useEffect(() => {
        props.setBackgroundConfig({
            type: 'image',
            url: MeadowSrc,
        });

    }, [])

    const {headWidth, headY, headX } = dickHead;
    const {dickWidth, dickHeight, dickY, dickX } = dick;
    const dickBottom = dickHeight + dickY;
    const dickMiddle = (dickX + dickWidth + dickX) / 2;

    const grassAspectRatio = 606 / 1000;
    const grassWidth = dickWidth * 2;
    const grassHeight = grassWidth * grassAspectRatio;
    const grassTop = dickBottom - grassHeight / 2;
    const grassLeft = dickMiddle - grassWidth / 2;
    return (
        <div className='overlay-cont grass'>
            <img
                className="overlay" 
                alt="overlay" 
                src={MarioHatSrc}
                style={{
                    top: `${headY}px`,
                    left: `${headX}px`,
                    width: `${headWidth}px`,
                }}
            />
            <img
                className="overlay" 
                alt="overlay" 
                src={GrassSrc}
                style={{
                    left: `${grassLeft}px`,
                    top: `${grassTop}px`,
                    width: `${grassWidth}px`,
                }}
            />
        </div> 
    );
}