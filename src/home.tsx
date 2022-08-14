import * as React from 'react';
import ReactGA from 'react-ga4';
import { ReactNode, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import {
  Header, Footer,
} from './components';
import { useNavigate } from 'react-router-dom';

import './home.scss';


export function Home() {
  const navigate = useNavigate();
  const navigateToApp = () => navigate('/app');
  return (
    <div className="home">
      <Header/>
      <br/><br/>
      <br/><br/>
        <Button variant="outlined" onClick={navigateToApp} size="large">Go to app</Button>
      <Footer />
    </div>
  );
}
