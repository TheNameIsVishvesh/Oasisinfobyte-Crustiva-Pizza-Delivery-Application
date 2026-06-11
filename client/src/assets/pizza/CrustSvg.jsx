import React from 'react';

// Imported realistic crust base assets
import thinCrustImg from './bases/thin-crust.png';
import thickCrustImg from './bases/thick-crust.png';
import cheeseBurstCrustImg from './bases/cheese-burst-crust.png';
import glutenFreeCrustImg from './bases/gluten-free-crust.png';
import wholeWheatCrustImg from './bases/whole-wheat-crust.png';

export default function CrustSvg({ base }) {
  let src = thinCrustImg;

  switch (base) {
    case 'Thin Crust':
      src = thinCrustImg;
      break;
    case 'Thick Crust':
      src = thickCrustImg;
      break;
    case 'Cheese Burst Crust':
      src = cheeseBurstCrustImg;
      break;
    case 'Gluten-Free Crust':
      src = glutenFreeCrustImg;
      break;
    case 'Whole Wheat Crust':
      src = wholeWheatCrustImg;
      break;
    default:
      src = thinCrustImg;
      break;
  }

  return (
    <div 
      className="w-full h-full filter drop-shadow-2xl"
      style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <img 
        src={src} 
        alt={base || 'Crust Base'} 
        className="w-full h-full object-contain select-none pointer-events-none"
        style={{ 
          clipPath: base === 'Thin Crust' ? 'circle(48.5% at 50% 50%)' : 'none'
        }}
      />
    </div>
  );
}
