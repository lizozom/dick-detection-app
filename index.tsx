import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes';
import './index.scss';

const element = document.getElementById('root');
const root = ReactDOM.createRoot(element!);

root.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
);
