import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import { App } from "./src/app";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SplashScreen } from "./src/splash_screen";

import "./index.scss";

const element = document.getElementById("root");
const root = ReactDOM.createRoot(element!);

root.render(
        <BrowserRouter>
                <div>
                        <Routes>
                                <Route path="/" element={<SplashScreen />}/>
                                <Route path="app" element={<App />}></Route>
                                        
                        </Routes>
                </div>
        </BrowserRouter>
);