import React from 'react';

// Imported realistic topping assets
import slicedMushroomsImg from './veggies/sliced-mushrooms.png';
import sweetCornImg from './veggies/sweet-corn.png';
import crispCapsicumImg from './veggies/crisp-capsicum.png';
import redOnionsImg from './veggies/red-onions.png';
import blackOlivesImg from './veggies/black-olives.png';
import jalapenosImg from './veggies/jalapenos.png';

import spicyPepperoniImg from './meat/spicy-pepperoni.png';
import smokedChickenTikkaImg from './meat/smoked-chicken-tikka.png';
import italianSausageImg from './meat/italian-sausage.png';
import bbqHamImg from './meat/bbq-ham.png';

// Defined random scatter positions for topping visual representations
export const veggieScatter = {
  'Sliced Mushrooms': [
    { x: -45, y: -30, rotate: 15 },
    { x: 35, y: -45, rotate: -25 },
    { x: -20, y: 40, rotate: 45 },
    { x: 45, y: 30, rotate: 90 },
    { x: 0, y: -10, rotate: 110 }
  ],
  'Sweet Corn': [
    { x: -30, y: -20, rotate: 0 },
    { x: 25, y: -35, rotate: 0 },
    { x: -35, y: 25, rotate: 0 },
    { x: 35, y: 35, rotate: 0 },
    { x: -10, y: 45, rotate: 0 },
    { x: 15, y: -10, rotate: 0 },
    { x: 40, y: -5, rotate: 0 }
  ],
  'Crisp Capsicum': [
    { x: -25, y: -45, rotate: 45 },
    { x: 45, y: -20, rotate: 135 },
    { x: -40, y: 15, rotate: 225 },
    { x: 20, y: 40, rotate: -45 },
    { x: -10, y: -25, rotate: 10 }
  ],
  'Red Onions': [
    { x: -50, y: -10, rotate: -15 },
    { x: 10, y: -50, rotate: 35 },
    { x: -15, y: 35, rotate: 95 },
    { x: 40, y: 10, rotate: 165 },
    { x: 25, y: -25, rotate: 75 }
  ],
  'Black Olives': [
    { x: -35, y: -35, rotate: 0 },
    { x: 35, y: -30, rotate: 12 },
    { x: -30, y: 30, rotate: -55 },
    { x: 30, y: 25, rotate: 88 },
    { x: 5, y: 20, rotate: 45 }
  ],
  'Jalapenos': [
    { x: -20, y: -35, rotate: 20 },
    { x: 40, y: -40, rotate: -30 },
    { x: -45, y: 5, rotate: 90 },
    { x: 15, y: 30, rotate: 120 },
    { x: -5, y: -5, rotate: -60 }
  ]
};

export const meatScatter = {
  'Spicy Pepperoni': [
    { x: -40, y: -25, rotate: 12 },
    { x: 30, y: -40, rotate: -35 },
    { x: -30, y: 30, rotate: 45 },
    { x: 35, y: 20, rotate: 90 },
    { x: 0, y: -35, rotate: -15 },
    { x: -5, y: 15, rotate: 85 },
    { x: 45, y: -5, rotate: 60 }
  ],
  'Smoked Chicken Tikka': [
    { x: -30, y: -35, rotate: 10 },
    { x: 35, y: -25, rotate: 45 },
    { x: -40, y: 15, rotate: -25 },
    { x: 25, y: 35, rotate: 110 },
    { x: -15, y: 45, rotate: 75 },
    { x: 5, y: -15, rotate: -60 }
  ],
  'Italian Sausage': [
    { x: -45, y: -15, rotate: 30 },
    { x: 20, y: -45, rotate: -10 },
    { x: -20, y: 25, rotate: 95 },
    { x: 40, y: 30, rotate: 145 },
    { x: -10, y: -40, rotate: -80 }
  ],
  'BBQ Ham': [
    { x: -35, y: -30, rotate: 0 },
    { x: 30, y: -35, rotate: 45 },
    { x: -25, y: 35, rotate: 90 },
    { x: 35, y: 15, rotate: 15 },
    { x: 5, y: 5, rotate: -30 }
  ]
};

export default function ToppingIcon({ name }) {
  let src = null;
  let sizeClass = "w-6 h-6";

  switch (name) {
    case 'Sliced Mushrooms':
      src = slicedMushroomsImg;
      sizeClass = "w-7 h-7";
      break;
    case 'Sweet Corn':
      src = sweetCornImg;
      sizeClass = "w-3.5 h-3.5";
      break;
    case 'Crisp Capsicum':
      src = crispCapsicumImg;
      sizeClass = "w-6 h-6";
      break;
    case 'Red Onions':
      src = redOnionsImg;
      sizeClass = "w-6 h-6";
      break;
    case 'Black Olives':
      src = blackOlivesImg;
      sizeClass = "w-4.5 h-4.5";
      break;
    case 'Jalapenos':
      src = jalapenosImg;
      sizeClass = "w-6 h-6";
      break;
    case 'Spicy Pepperoni':
      src = spicyPepperoniImg;
      sizeClass = "w-9 h-9";
      break;
    case 'Smoked Chicken Tikka':
      src = smokedChickenTikkaImg;
      sizeClass = "w-7 h-7";
      break;
    case 'BBQ Ham':
      src = bbqHamImg;
      sizeClass = "w-7 h-7";
      break;
    case 'Italian Sausage':
      src = italianSausageImg;
      sizeClass = "w-6 h-6";
      break;
    default:
      return null;
  }

  return (
    <img 
      src={src} 
      alt={name} 
      className={`${sizeClass} object-contain drop-shadow-md select-none pointer-events-none`} 
    />
  );
}
