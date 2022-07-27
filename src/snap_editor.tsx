import * as React from 'react';
import { useRef, useEffect } from 'react';
import type { ScreenSize } from './types';
import { Header } from './components';
import { Fab } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import "./snap_editor.scss";

export interface SnapEditorProps {
    snap: string;
    screenSize: ScreenSize;
    onClear: () => void;
}

export function SnapEditor(props: SnapEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const renderOnCanvas = () => {
        if (!imgRef.current || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d")!;
        ctx.drawImage(imgRef.current, 0, 0);
    };

    return (
        <div className='snap-editor'>
            <Header/>
            <img className="loader" ref={imgRef} alt="tmp" src={props.snap}  width={props.screenSize.width} height={props.screenSize.height} onLoad={renderOnCanvas}/>
            <canvas width={props.screenSize.width} height={props.screenSize.height} ref={canvasRef} />

            <div className="app-control">
            <Fab color="primary" aria-label="add" onClick={props.onClear}>
                <RestartAltIcon />
            </Fab>
            </div>
        </div>
    )
}