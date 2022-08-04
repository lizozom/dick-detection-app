/* eslint-disable react/no-danger */

import * as React from 'react';
import * as Modal from 'react-modal';

import { Header } from './header';

// @ts-ignore
import TermsHtml from './terms.html';
import './terms_privacy.scss';

export function TermsOfUse() {
  Modal.setAppElement('#root');

  return (
    <div className="terms">
      <Header />
      <div className="content" dangerouslySetInnerHTML={{ __html: TermsHtml }} />
    </div>
  );
}
