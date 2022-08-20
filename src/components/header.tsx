import * as React from 'react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import './header.scss';
import { SvgLogo } from './logo';


export interface HeaderProps {
  extraButton?: ReactNode;
  extraClass?: string;
}

export function Header(props: HeaderProps) {
  const navigate = useNavigate();
  const navigateFn = () => navigate('/');
  return (
    <div className={`header ${props.extraClass}`}>
      <SvgLogo onClick={navigateFn}/>
      <div onClick={navigateFn}>duckpuc</div>

      <div className="extra-buttons">{props.extraButton}</div>
    </div>
  );
}
