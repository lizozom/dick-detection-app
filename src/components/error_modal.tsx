import * as React from 'react';
import * as Modal from 'react-modal';
import { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './modals.scss';
import { Button, IconButton } from '@mui/material';

export interface ErrorModalProps {
    closeModal: () => void;
    message?: string | ReactNode;
}

export function ErrorModal(props: ErrorModalProps) {
  Modal.setAppElement('#root');

  return (
    <Modal
      isOpen={props.message !== undefined}
      onRequestClose={props.closeModal}
      style={{
        content: {
          inset: '10vh 5vh auto 5vh',
        },
      }}
      contentLabel="Error"
    >

      <IconButton className="close-button" aria-label="close-modal" size="small" onClick={props.closeModal}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <h3>There might have been a problem...</h3>

      <div>
        {props.message}
      </div>
      {/* <Button variant="outlined" onClick={props.nextHandler}>I&apos;m ready</Button> */}
    </Modal>
  );
}
