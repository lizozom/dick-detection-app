import * as React from 'react';
import * as Modal from 'react-modal';
import CloseIcon from '@mui/icons-material/Close';
import './modals.scss';
import { Button, IconButton } from '@mui/material';

export interface AboutModalProps {
    modalIsOpen: boolean;
    closeModal: () => void;
    nextHandler: () => void;
}

export function AboutModal(props: AboutModalProps) {
  Modal.setAppElement('#root');

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      style={{
        content: {
          inset: '10vh 5vh auto 5vh',
        },
      }}
      contentLabel="About Duckpuc"
    >

      <IconButton className="close-button" aria-label="close-modal" size="small" onClick={props.closeModal}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <h3>Welcome to Duckpuc</h3>

      <p>
        An app that celebrates sexuality.
      </p>
      <p>
        We believe that anything you and your partner(s) choose to do
        {' '}
        <b>is awesome</b>
        .
      </p>
      <p>
        We encourage you to explore your body. Celebrate it. Share it.
        We&apos;re here to have fun.
      </p>
      <p>
        So lets create some thoughtful and amusing photos of your `duck`!
      </p>
      <p>
        Feel free to share them with
        {' '}
        <b>consenting</b>
        {' '}
        friends and loved ones.
      </p>
      <h4>Privacy</h4>
      <p>
        We never send any images out of your device or store them on our servers.
        Any processing is done on your device. Your content is
        {' '}
        <b>yours</b>
        .
      </p>

      <Button variant="outlined" onClick={props.nextHandler}>I&apos;m ready</Button>
    </Modal>
  );
}
