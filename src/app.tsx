import * as React from 'react';
import { useState } from 'react';
import { CameraDetector } from './camera_detector';
import { SnapEditor } from './snap_editor';
import { Detection } from './types';

export function App() {
    const [snap, setSnap] = useState<string | null>(null);
    const [detections, setDetections] = useState<Array<Detection>>([]);
    const { clientHeight, clientWidth } = document.documentElement;
    const screenSize = {
        width: clientWidth,
        height: clientHeight,
    };

    const onSnap = (imgData: string, d: Array<Detection>) => {
        setSnap(imgData);
        setDetections(d);
    };

    const onClear = () => {
        setSnap(null);
    };


    if (snap) {
        return (
            <SnapEditor snap={snap} detections={detections} onClear={onClear} screenSize={screenSize}/>
        )
    } else {
        return (
            <CameraDetector onSnap={onSnap} screenSize={screenSize}/>
        )

    }
}