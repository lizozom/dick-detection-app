import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import { App } from "./src/app";
import { BrowserRouter, Route, Routes as DomRoutes } from "react-router-dom";
import { SplashScreen } from "./src/splash_screen";
import { useAnalytics } from "./src/hooks";

export function Routes() {
    useAnalytics();
    
    return (
        <div>
            <DomRoutes>
                
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="app" element={<App />}></Route>

            </DomRoutes>
        </div>
    )
}
