import * as React from 'react';
import './coffee.scss';

import CoffeeSrc from '../../public/bmc-new-btn-logo.svg';

export function Coffee() {
    return (
    <a
      className="buyButton"
      target="_blank"
      href="https://www.buymeacoffee.com/theduckpuc"
    >
      <img
        className="coffeeImage"
        src={CoffeeSrc}
        alt="Buy me a coffee"
      />
      <span className="coffeeButtonText">Buy me a coffee</span>
    </a>
     );
    }