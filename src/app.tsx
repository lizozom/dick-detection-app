import * as React from 'react';
import { useState } from 'react';
import { CameraDetector } from './camera_detector';
import { SnapEditor } from './snap_editor';

export function App() {
    const [snap, setSnap] = useState<string | null>(null);
    const { clientHeight, clientWidth } = document.documentElement;
    const screenSize = {
        width: clientWidth,
        height: clientHeight,
    };

    const onSnap = (imgData: string) => {
        setSnap(imgData);
    };

    const onClear = () => {
        setSnap(null);
    };


    if (snap) {
        return (
            <SnapEditor snap={snap} onClear={onClear} screenSize={screenSize}/>
        )
    } else {
        return (
            <CameraDetector onSnap={onSnap} screenSize={screenSize}/>
        )

    }
}