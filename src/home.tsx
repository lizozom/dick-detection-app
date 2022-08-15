import * as React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Header, Footer, Coffee,
} from './components';

import './home.scss';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  boxShadow: 'none',
}));

export function Home() {
  const navigate = useNavigate();
  const navigateToApp = () => navigate('/app');

  const tryButton = <Button variant="contained" onClick={navigateToApp} size="large">Try it now</Button>;
  return (
    <div className="home">
      <Header extraButton={tryButton} />
      <Grid
        container

      >
        <Grid className="title" item xs={12} md={6}>
          <Item>
            <h1>
              Pretty
              <br />
              Damn
              <br />
              Dicks
            </h1>
            <h2>All dicks are beautiful. </h2>
            <h3>
              Small, medium or large, black and white,
              <br />
              hairy or shaved, freckled or veiny,
              <br />
              all dicks deserve to be appreciated.
            </h3>
            <div>
              {tryButton}
            </div>
          </Item>
        </Grid>
        <Grid className="mobile-preview" item xs={12} md={6}>
          <Item>
            <div className="phone" />
          </Item>
        </Grid>
        <Grid className="privacy" item xs={12} md={12}>
          <Item>
            <h3>
              We are HOT... for privacy.
            </h3>
            <p>
              We believe that your duckpucs should only be shared consensually,
              and only if you choose to do so. Seriously.
              <br />
              That’s why your photos never leave your phone.
              {' '}
              <b>Your photos are yours.</b>
            </p>

          </Item>
        </Grid>
        <Grid item xs={12} md={12} className="about-us">
          <Item>
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
              This project is entirely non-profit. If you like it -
            </p>
            <div className="coffee-wrapper">
              <Coffee />
            </div>

          </Item>
        </Grid>
        <Grid item xs={12} md={12} className="coffee">
          <Item />
        </Grid>

      </Grid>
      <Footer />

    </div>
  );
}
