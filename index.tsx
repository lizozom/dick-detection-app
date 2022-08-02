import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import { Routes } from './routes';
import { BrowserRouter } from "react-router-dom";
import "./index.scss";

const element = document.getElementById("root");
const root = ReactDOM.createRoot(element!);

root.render(
        <BrowserRouter>
                <Routes />
        </BrowserRouter>);