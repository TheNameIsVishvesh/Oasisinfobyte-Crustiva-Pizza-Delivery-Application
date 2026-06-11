import React from 'react';
import { motion } from 'framer-motion';

// Imported realistic cheese assets
import mozzarellaImg from './cheese/mozzarella-cheese.png';
import cheddarImg from './cheese/cheddar-cheese.png';
import parmesanImg from './cheese/parmesan-cheese.png';
import fetaImg from './cheese/feta-cheese.png';
import veganAlmondImg from './cheese/vegan-almond-cheese.png';

export default function CheeseLayer({ cheese, opacity }) {
  if (!cheese) return null;

  let src = mozzarellaImg;

  switch (cheese) {
    case 'Mozzarella Cheese':
      src = mozzarellaImg;
      break;
    case 'Cheddar Cheese':
      src = cheddarImg;
      break;
    case 'Parmesan Cheese':
      src = parmesanImg;
      break;
    case 'Feta Cheese':
      src = fetaImg;
      break;
    case 'Vegan Almond Cheese':
      src = veganAlmondImg;
      break;
    default:
      src = mozzarellaImg;
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: opacity !== undefined ? opacity : 0.9, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.65 }}
      className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
    >
      <img 
        src={src} 
        alt={cheese} 
        className="w-[88%] h-[88%] object-contain drop-shadow-md select-none pointer-events-none" 
      />
    </motion.div>
  );
}
