import * as React from 'react';
import { useNavigate } from "react-router-dom";
import './header.scss';

// @ts-ignore
import Logo from '/public/duckpuc-logo.svg';

export function Header() {
  let navigate = useNavigate(); 

  return (
    <div className="header" onClick={() => navigate('/')}>
      <img alt='rubber duck' className='logo' src={Logo}/>
      duckpuc
    </div>
  );
}

