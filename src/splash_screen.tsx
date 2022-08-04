import * as React from 'react';
import ReactGA from 'react-ga4';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useYolo } from './hooks/use_yolo';
import { AboutModal, Header, Footer } from './components';

import './splash_screen.scss';

// @ts-ignore
import RubberDuck from '../public/duck-image-trans.png';

export function SplashScreen() {
  const loaded = useYolo();
  const [redirect, setRedirect] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const onNextClick = (fromModal?: boolean) => {
    ReactGA.event({
      category: 'user',
      action: 'next_button',
      label: fromModal ? 'modal' : '',
    });
    setRedirect(true);
  };

  const onLearnMoreClick = () => {
    ReactGA.event({
      category: 'user',
      action: 'learn_more',
    });
    setAboutModalOpen(true);
  };

  if (redirect) {
    return (
      <Navigate replace to="/app" />
    );
  }
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
            <Button disabled={!loaded} variant="outlined" onClick={() => onNextClick()} size="large"> I&apos;m ready &gt;</Button>
            <br />
            <br />
            <Button color="secondary" onClick={onLearnMoreClick} size="small"> Tell me more &gt;</Button>
          </div>
        </div>
      </div>

      <Footer />
      <AboutModal
        modalIsOpen={aboutModalOpen}
        closeModal={() => setAboutModalOpen(false)}
        nextHandler={() => onNextClick(true)}
      />
    </div>
  );
}
