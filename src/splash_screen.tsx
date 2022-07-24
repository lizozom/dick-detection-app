
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useYolo } from './hooks/use_yolo';
import  { Navigate } from 'react-router-dom';

// @ts-ignore
import Logo from '/public/duckpuc-logo.png';

const SPLASH_TIMEOUT = 2000;

export function SplashScreen() {
    const loaded = useYolo();
    const [delayedDone, setDelayedDone] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setDelayedDone(true);
        }, SPLASH_TIMEOUT);
    }, []);

    if (loaded && delayedDone) {
        return (
            <Navigate replace to="/app" />
        );
    } else {
        return (
            <img alt="logo" src={Logo} />
        );
    }

}