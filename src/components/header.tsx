import { Button } from '@mui/material';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import './header.scss';

// @ts-ignore
import Logo from '/public/duckpuc-logo.svg';

export interface HeaderProps {
  extraButton?: JSX.Element;
}

export function Header(props: HeaderProps) {
  const navigate = useNavigate(); 
  const navigateFn = () => navigate('/'); 
  return (
    <div className="header">
      <img alt='rubber duck' className='logo' src={Logo} onClick={navigateFn}/>
      <div onClick={navigateFn}>duckpuc</div>
      
      <div className="extra-buttons">{props.extraButton}</div>
    </div>
  );
}

