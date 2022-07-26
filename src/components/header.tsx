import * as React from 'react';
import './header.scss';

// @ts-ignore
import Logo from '/public/duckpuc-logo.svg';

export function Header() {
  return (
    <div className="header">
      <img alt='rubber duck' className='logo' src={Logo}/>
      duckpuc
    </div>
  );
}

