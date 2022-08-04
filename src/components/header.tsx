import * as React from 'react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import './header.scss';

// @ts-ignore
import Logo from '../../public/duckpuc-logo.svg';

export interface HeaderProps {
  extraButton?: ReactNode;
}

export function Header(props: HeaderProps) {
  const navigate = useNavigate();
  const navigateFn = () => navigate('/');
  return (
    <div className="header">
      <img alt="rubber duck" aria-hidden="true" className="logo" src={Logo} onClick={navigateFn} />
      <div onClick={navigateFn}>duckpuc</div>

      <div className="extra-buttons">{props.extraButton}</div>
    </div>
  );
}
