import * as React from 'react';
import { getDetection, DICK } from '../helpers';
import type { FilterProps } from './types';

// @ts-ignore
import FrameSrc from '/public/filters/frame.png';

import "./frame.scss";

export function Frame(props: FilterProps) {
    const dick = getDetection(props.detections, DICK);
    const aspectRatio = 568/654;

    // Leave room for frame
    const top = (dick?.bbox_y || 0) * 0.8;
    const height = (dick?.bbox_h || 0) * 1.2;
    const width = (dick?.bbox_h || 0) * aspectRatio;
    return (
        <div 
            className='overlay-cont frame'
            style={{
                borderWidth: `${top}px 0 ${height}px 0`,
                height: `${height}px`,
        }}>
        <img
            className="overlay" 
            alt="overlay" 
            src={FrameSrc}
            style={{
                // top: top ? top + 'px' : '0',
                height: height ? height + 'px' : '100%',
                width: width ? width + 'px' : 'auto',
            }}
        /></div>
    );
}