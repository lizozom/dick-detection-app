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
import Hearts from '/public/filters/hearts.png';
// @ts-ignore
import Retry from '/public/retry-icon.svg';


import "./snap_editor.scss";
import { Carousel, CarouselItem } from './components';
import { Detection, getDetection, DICK, DICK_HEAD } from './helpers';

export interface OverlayItem extends CarouselItem {
    left?: string;
    top?: string;
    bottom?: string;
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
            const dickHead = getDetection(props.detections, DICK_HEAD);
            const top = (dickHead?.bbox_y || 0) + (dickHead?.bbox_h || 0) * 0.5;
            setItem({
                ...item,
                top: top > 0 ? top + 'px' : '50%',
                left: dickHead?.bbox_x + 'px' || 'auto',
                width: dickHead?.bbox_w ? dickHead?.bbox_w + 'px' : '80%',
            });
        }
    }, {
        id: 'glasses',
        src: Glasses,
        handler: (item: CarouselItem) => {
            const dickHead = getDetection(props.detections, DICK_HEAD);
            const top = (dickHead?.bbox_y || 0) + (dickHead?.bbox_h || 0) * 0.3;
            setItem({
                ...item,
                top: top > 0 ? top + 'px' : '50%',
                left: dickHead?.bbox_x + 'px' || 'auto',
                width: dickHead?.bbox_w ? dickHead?.bbox_w + 'px' : '80%',
            });
        }
    }, {
        id: 'frame',
        src: Frame,
        handler: (item: CarouselItem) => {
            const dick = getDetection(props.detections, DICK);
            const aspectRatio = 568/654;

            // Leave room for frame
            const top = (dick?.bbox_y || 0) * 0.9;;
            const height = dick?.bbox_h;
            const width = (dick?.bbox_h || 0) * aspectRatio;
            setItem({
                ...item,
                top: top ? top + 'px' : '0',
                height: height ? height + 'px' : '100%',
                width: width ? width + 'px' : 'auto',
            });
        }
    }, {
        id: 'rain',
        src: Rain,
    }, {
        id: 'hearts',
        src: Hearts,
    },{
        id: 'grass',
        src: Grass,
        handler: (item: CarouselItem) => {
            const dick = getDetection(props.detections, DICK);
            const top = dick?.bbox_y || 0 + (dick?.bbox_y || 0);
            setItem({
                ...item,
                top: 'auto',
                width: '100%',
                bottom: '0px',
            });
        }
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
                        bottom: item.bottom,
                        width: item.width || '100%',
                        height: item.height
                    }}
                />}
            
            <div className="app-control">
                <Carousel items={items} handler={onCarouselClick}></Carousel>
            </div>
        </div>
    )
}