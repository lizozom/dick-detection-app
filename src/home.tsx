import * as React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Footer, Coffee, SvgLogo,
} from './components';

import './home.scss';

import OpraSrc from '../public/images/opra.png';
import DuckInCircleSrc from '../public/images/duck-in-circle.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  boxShadow: 'none',
}));

export function Home() {
  const navigate = useNavigate();
  const navigateToApp = () => navigate('/app');

  return (
    <div className="home">
      <Grid
        container

      >
        <Grid className="logo-section" item xs={12} md={12}>
          <Item className="container">
            <div className="logo">
              <SvgLogo color="white" />
            </div>
            <span>duckpuc</span>
          </Item>
        </Grid>
        <Grid className="title-section" item xs={12} md={12}>
          <Item>
            <h1 className="main-title">
              <div>Pretty</div>
              <div>Damn</div>
              <div>Dicks</div>
            </h1>
            <h2 className="subtitle">All dicks are beautiful. </h2>
            <h3 className="content">
              Small, medium or large, black and white,
              <br />
              hairy or shaved, freckled or veiny,
              <br />
              all dicks deserve to be appreciated.
            </h3>
            <Button variant="contained" className="call-to-action" onClick={navigateToApp} size="large">Show it to me</Button>
          </Item>
        </Grid>
        <Grid className="meme-section" item xs={12} md={6}>
          <Item>
            <img src={OpraSrc} alt="meme" />
          </Item>
        </Grid>
        <Grid className="mobile-preview" item xs={12} md={6}>
          <Item>
            <div className="phone" />
          </Item>
        </Grid>
        <Grid className="privacy" item xs={12} md={12}>
          <Item>
            <h3 className="title">
              <div>We are HOT</div>
              <div>... for privacy.</div>
            </h3>
            <p className="content">
              We believe that your duckpucs should only be shared consensually,
              and only if you choose to do so. Seriously.
            </p>
            <p className="content color">
              That’s why your photos never leave your phone.
              Your photos are yours.
            </p>

          </Item>
        </Grid>
        <Grid item xs={12} md={12} className="about-us">
          <Item>
            {/* <img src={DuckInCircleSrc}/> */}
            <div className="content">
              <div className="content-inner">
                <h3>About me</h3>
                <p>
                  I’m a software engineer, entrepreneur and I also happen to be a chick that appreciates dicks.
                </p>
                <p>
                  I believe that men should be free to enjoy the same benefits of the body positivity movement:
                  {' '}
                  <br />
                  honesty, openness, vulnerability and learning to accept you and your only one eyed snake,
                  knowing it is perfect the way it is.
                </p>
                <p>
                  This project is entirely non-profit.
                  {' '}
                  <br />
                  <b>If you like it -</b>
                </p>
                <div className="coffee-wrapper">
                  <Coffee />
                </div>
              </div>
            </div>

          </Item>
        </Grid>
      </Grid>
      <Footer />

    </div>
  );
}
