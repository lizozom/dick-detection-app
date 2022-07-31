import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import type { Detection, ScreenSize } from './types';
import { Header } from './components';
import { Fab } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


// @ts-ignore
import Mustache from '/public/filters/mustache.png';
// @ts-ignore
import Glasses from '/public/filters/glasses.png';
// @ts-ignore
import Frame from '/public/filters/frame.png';
// @ts-ignore
import Rain from '/public/filters/rain.png';
// @ts-ignore
import Grass from '/public/filters/grass.png';
// @ts-ignore
import Retry from '/public/retry-icon.svg';


import "./snap_editor.scss";
import { Carousel, CarouselItem } from './components';

export interface SnapEditorProps {
    snap: string;
    detections: Array<Detection>;
    screenSize: ScreenSize;
    onClear: () => void;
}

function getItemWidth(detections: Array<Detection>, item: CarouselItem) {
    const dick = detections.find(x => x.label === 1);
    const widthFraction = (item.xPercent || 0.8);
    if (dick) {
        return dick.bbox_w * (item.xPercent || 0.8) + 'px';
    } else {
        return 100 * widthFraction + '%'
    }
}

export function SnapEditor(props: SnapEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [item, setItem] = useState<CarouselItem | null>(null);

    const renderOnCanvas = () => {
        if (!imgRef.current || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d")!;
        ctx.drawImage(imgRef.current, 0, 0);
    };

    const items: Array<CarouselItem> = [
    {
        id: 'retake',
        img: Retry,
        handler: () => {
            props.onClear();
        }
    }, {
        id: 'mustache',
        img: Mustache,
    }, {
        id: 'glasses',
        img: Glasses,
        xPercent: 0.6,
    }, {
        id: 'frame',
        img: Frame,
    }, {
        id: 'rain',
        img: Rain,
    }, {
        id: 'grass',
        img: Grass,
    }];

    const onCarouselClick = (item: CarouselItem) => {
        if (item.handler) {
            item.handler(item);
        } else {
            setItem(item);
        }
    }

    return (
        <div className='snap-editor'>
            <Header/>
            <img className="loader" ref={imgRef} alt="tmp" src={props.snap} width={props.screenSize.width} height={props.screenSize.height} onLoad={renderOnCanvas}/>
            <canvas width={props.screenSize.width} height={props.screenSize.height} ref={canvasRef} />
            {item && 
                <img 
                    className="overlay" 
                    alt="overlay" 
                    src={item.img} 
                    width={getItemWidth(props.detections, item)}
                />}
            
            <div className="app-control">
                <Carousel items={items} handler={onCarouselClick}></Carousel>
            </div>
        </div>
    )
}