import * as React from 'react';
import { useRef, useState } from 'react';
import type { ScreenSize } from './types';
import { Header } from './components';

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
import { Detection, getDetection, DICK_HEAD } from './helpers';

export interface OverlayItem extends CarouselItem {
    left?: string;
    top?: string;
    width?: string;
    height?: string;
}
export interface SnapEditorProps {
    snap: string;
    detections: Array<Detection>;
    screenSize: ScreenSize;
    onClear: () => void;
}

export function SnapEditor(props: SnapEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [item, setItem] = useState<OverlayItem | null>(null);

    const renderOnCanvas = () => {
        if (!imgRef.current || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d")!;
        ctx.drawImage(imgRef.current, 0, 0);
    };

    const items: Array<CarouselItem> = [
    {
        id: 'retake',
        src: Retry,
        handler: () => {
            props.onClear();
        }
    }, {
        id: 'mustache',
        src: Mustache,
        handler: (item: CarouselItem) => {
            debugger;
            const dickHead = getDetection(props.detections, DICK_HEAD);
            const top = dickHead?.bbox_y || 0 + (dickHead?.bbox_y || 0);
            setItem({
                ...item,
                top: top > 0 ? top + 'px' : '50%',
                width: dickHead?.bbox_w ? dickHead?.bbox_w + 'px' : '80%',
            });
            
        }
    }, {
        id: 'glasses',
        src: Glasses,
    }, {
        id: 'frame',
        src: Frame,
    }, {
        id: 'rain',
        src: Rain,
    }, {
        id: 'grass',
        src: Grass,
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
                    src={item.src}
                    style={{
                        left: item.left,
                        top: item.top,
                        width: item.width,
                        height: item.height
                    }}
                />}
            
            <div className="app-control">
                <Carousel items={items} handler={onCarouselClick}></Carousel>
            </div>
        </div>
    )
}