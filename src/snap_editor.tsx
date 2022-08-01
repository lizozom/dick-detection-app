import * as React from 'react';
import { useRef, useState } from 'react';
import type { ScreenSize } from './types';
import { Header } from './components';
import { items } from './filters';
import DownloadIcon from '@mui/icons-material/Download';
import { Carousel, CarouselItem } from './components';
import { Detection } from './helpers';
import html2canvas from 'html2canvas';
import { Button, Fab } from '@mui/material';

// @ts-ignore
import RetrySrc from '/public/retry-icon.svg';


import "./snap_editor.scss";

export interface SnapEditorProps {
    snap: string;
    detections: Array<Detection>;
    screenSize: ScreenSize;
    onClear: () => void;
}

export function SnapEditor(props: SnapEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null)
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

    const onDownloadClick = () => {
        if (!contentRef.current) return;

        html2canvas(contentRef.current).then(function(canvas) {
            const image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
            const link = document.createElement('a');
            link.download = `duckpuc-${new Date().getTime()}.png`;
            link.href = image;
            link.click();
        });
    }

    return (
        <div className='snap-editor'>
            <img className="loader" ref={imgRef} alt="tmp" src={props.snap} width={props.screenSize.width} height={props.screenSize.height} onLoad={renderOnCanvas}/>

            <div className="content" ref={contentRef}>            
                <Header/>
                <canvas width={props.screenSize.width} height={props.screenSize.height} ref={canvasRef} />
                {filterEl}
            </div>
            
            <div className="download-button">
                <Button variant="contained" aria-label="download" onClick={onDownloadClick}>
                Download
                </Button>
            </div>
            <div className="app-control">
                <Carousel items={carouselItems} onClick={onCarouselClick}></Carousel>
            </div>
        </div>
    )
}