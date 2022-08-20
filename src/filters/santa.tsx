import * as React from 'react';
import { getDickHeadBox, getDickBox } from '../helpers';
import type { FilterProps } from './types';

import ChristmasGiftsSrc from './images/gift-box.png';
import SantaSrc from './images/christmas.png';
import SantaBgSrc from './images/christmas-bg.png';

import "./santa.scss";
import { useEffect } from 'react';

export function Santa(props: FilterProps) {
    const dick = getDickBox(props.detections);
    const dickHead = getDickHeadBox(props.detections)
    if (!dickHead || !dick) return null;

    useEffect(() => {
        props.setBackgroundConfig({
            type: 'image',
            url: SantaBgSrc,
        });

    }, [])

    const {headWidth, headY, headX } = dickHead;
    const {dickWidth, dickHeight, dickY, dickX } = dick;
    const dickBottom = dickHeight + dickY;
    const dickMiddle = (dickX + dickWidth + dickX) / 2;

    const giftsAspectRatio = 790 / 1000;
    const giftsWidth = dickWidth * 2;
    const giftsHeight = giftsWidth * giftsAspectRatio;
    const giftsTop = dickBottom - giftsHeight / 2;
    const giftsLeft = dickMiddle - giftsWidth / 2;
    return (
        <div className='overlay-cont'>
            <img
                className="overlay" 
                alt="overlay" 
                src={SantaSrc}
                style={{
                    top: `${headY*0.9}px`,
                    left: `${headX*1.1}px`,
                    width: `${headWidth}px`,
                }}
            />
            <img
                className="overlay" 
                alt="overlay" 
                src={ChristmasGiftsSrc}
                style={{
                    left: `${giftsLeft}px`,
                    top: `${giftsTop}px`,
                    width: `${giftsWidth}px`,
                }}
            />
        </div> 
    );
}