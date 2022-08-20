import * as React from 'react';
import ReactGA from 'react-ga4';
import { ReactNode, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useYolo, YoloModel } from './hooks/useYolo';
import {
  AboutModal, Header, Footer, ErrorModal,
} from './components';

import './splashScreen.scss';

import RubberDuck from '../public/images/duck-image-trans.png';

export interface SpashProps {
  yolo?: YoloModel;
  loadError?: string;
  onStartClick: () => void;
}

export function SplashScreen(props: SpashProps) {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [error, setError] = useState<string | ReactNode | undefined>();

  useEffect(() => {
    if (props.loadError) {
      setError(
        <div>
          <p>Failed to load our full detection capabilities.</p>
          <p> Please try from a different device.</p>
        </div>,
      );
    }
  }, [props.loadError]);

  const onNextClick = (fromModal?: boolean) => {
    ReactGA.event({
      category: 'user',
      action: 'next_button',
      label: fromModal ? 'modal' : '',
    });
    props.onStartClick();
  };

  const onLearnMoreClick = () => {
    ReactGA.event({
      category: 'user',
      action: 'learn_more',
    });
    setAboutModalOpen(true);
  };

  return (
    <div className="splash-screen">
      <Header extraClass="floating" />
      <div className="splash-duck">
        <img alt="logo" src={RubberDuck} />
      </div>
      <div className="engage-section">
        <div className="engage-wrap">
          <div className="engage-1">Are you wearing pants?</div>
          <div className="engage-2">Take them off</div>
          <div className="engage-3">
            <Button disabled={props.yolo === undefined} variant="outlined" onClick={() => onNextClick()} size="large"> I&apos;m ready &gt;</Button>
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
      <ErrorModal closeModal={() => setError(undefined)} message={error} />
    </div>
  );
}
