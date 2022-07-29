
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useYolo } from './hooks/use_yolo';
import  { Navigate } from 'react-router-dom';
import { Header } from './components';
import Button from '@mui/material/Button';
import "./splash_screen.scss";

// @ts-ignore
import RubberDuck from '/public/duck-image.png';

const SPLASH_TIMEOUT = 2000;

export function SplashScreen() {
    const loaded = useYolo();
    const [redirect, setRedirect] = useState(false);

    const onNextClick = () => {
        setRedirect(true)
    }

    if (redirect) {
        return (
            <Navigate replace to="/app" />
        );
    } else {
        return (
            <div className="splash-screen">
                <Header />
                <div className="splash-duck">
                    <img alt="logo" src={RubberDuck} />
                </div>
                <div className="engage-section">
                    <div className="engage-wrap">
                        <div className="engage-1">Are you wearing pants?</div>
                        <div className="engage-2">Take them off</div>
                        <div className="engage-3">
                            <Button disabled={!loaded} onClick={onNextClick}> I'm ready &gt;</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}