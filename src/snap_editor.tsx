import * as React from 'react';
import { useRef, useState } from 'react';
import type { ScreenSize } from './types';
import { Header } from './components';
import { items } from './filters';
// @ts-ignore
import RetrySrc from '/public/retry-icon.svg';


import "./snap_editor.scss";
import { Carousel, CarouselItem } from './components';
import { Detection } from './helpers';
export interface SnapEditorProps {
    snap: string;
    detections: Array<Detection>;
    screenSize: ScreenSize;
    onClear: () => void;
}

export function SnapEditor(props: SnapEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [filterEl, setFilterEl] = useState<JSX.Element | null>(null);

    const carouselItems: CarouselItem[] = [
        { 
            id: 'retake',
            src: RetrySrc,
            onClick: () => {
                props.onClear();
            }
        },
        ...items.map((item) => {
            return {
                id: item.id,
                src: item.src,
                onClick: () => {
                    const el = item.render(props.detections);
                    setFilterEl(el);
                }
            }
        })
    ]

    const renderOnCanvas = () => {
        if (!imgRef.current || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d")!;
        ctx.drawImage(imgRef.current, 0, 0);
    };


    const onCarouselClick = (item: CarouselItem) => {
        if (item.onClick) {
            item.onClick(item);
        } else {
            // item.render()
            // setItem(item);
        }
    }

    return (
        <div className='snap-editor'>
            <Header/>
            <img className="loader" ref={imgRef} alt="tmp" src={props.snap} width={props.screenSize.width} height={props.screenSize.height} onLoad={renderOnCanvas}/>
            <canvas width={props.screenSize.width} height={props.screenSize.height} ref={canvasRef} />
            {filterEl}
            
            <div className="app-control">
                <Carousel items={carouselItems} onClick={onCarouselClick}></Carousel>
            </div>
        </div>
    )
}