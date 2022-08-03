import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import { App } from "./src/app";
import { Route, Routes as DomRoutes } from "react-router-dom";
import { SplashScreen } from "./src/splash_screen";
import { useAnalytics } from "./src/hooks";
import { PrivacyPolicy, TermsOfUse } from "./src/components";

export function Routes() {
    useAnalytics();
    
    return (
        <div>
            <DomRoutes>
                
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="app" element={<App />}></Route>
                    <Route path="privacy_policy" element={<PrivacyPolicy />}></Route>
                    <Route path="terms" element={<TermsOfUse />}></Route>

            </DomRoutes>
        </div>
    )
}
