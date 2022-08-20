/* eslint-disable react/no-danger */

import * as React from 'react';
import * as Modal from 'react-modal';

import { Header } from './header';

// @ts-ignore
import PolicyHtml from './privacy_policy.html';
import './terms_privacy.scss';

export function PrivacyPolicy() {
  Modal.setAppElement('#root');

  return (
    <div className="privacy-policy">
      <Header />
      <div className="content" dangerouslySetInnerHTML={{ __html: PolicyHtml }} />
    </div>
  );
}
