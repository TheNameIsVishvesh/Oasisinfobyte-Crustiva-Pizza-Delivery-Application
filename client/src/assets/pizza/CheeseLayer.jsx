import React from 'react';
import { motion } from 'framer-motion';

export default function CheeseLayer({ cheese }) {
  if (!cheese) return null;

  const getCheeseConfig = (c) => {
    switch (c) {
      case 'Mozzarella Cheese':
        return { main: '#FFFDE7', highlight: '#FFF9C4', shadow: '#FBC02D', opacity: 0.85 };
      case 'Cheddar Cheese':
        return { main: '#FFE082', highlight: '#FFB74D', shadow: '#E65100', opacity: 0.9 };
      case 'Parmesan Cheese':
        return { main: '#FFFDE7', highlight: '#FFF59D', isDust: true };
      case 'Feta Cheese':
        return { main: '#FFFFFF', shadow: '#E0E0E0', isBlocks: true };
      default: // Vegan / Default
        return { main: '#FFF9C4', highlight: '#F0F4C3', shadow: '#D4E157', opacity: 0.82 };
    }
  };

  const config = getCheeseConfig(cheese);

  if (config.isDust) {
    const particles = Array.from({ length: 90 });
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.95 }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <svg className="w-full h-full">
          {particles.map((_, i) => {
            const angle = (i * 4 * Math.PI) / 180;
            const seed = Math.sin(i * 17) * 0.5 + 0.5;
            const r = 5 + seed * 68; // disperse outward
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r={1.0 + (i % 3) * 0.4}
                fill={config.main}
                opacity="0.85"
              />
            );
          })}
        </svg>
      </motion.div>
    );
  }

  if (config.isBlocks) {
    const blocks = Array.from({ length: 20 });
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.95, scale: 1 }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <svg className="w-full h-full">
          {blocks.map((_, i) => {
            const angle = (i * (360 / 20) * Math.PI) / 180;
            const r = 15 + ((i * 7) % 50);
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            const size = 5.5 + (i % 3) * 1.5;
            const rot = (i * 23) % 360;
            return (
              <rect
                key={i}
                x={`${x}%`}
                y={`${y}%`}
                width={size}
                height={size}
                rx={1}
                fill={config.main}
                stroke={config.shadow}
                strokeWidth={0.8}
                transform={`rotate(${rot}, ${x}, ${y})`}
              />
            );
          })}
        </svg>
      </motion.div>
    );
  }

  // Blended stretch layer with glowing baked cheese bubbles
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: config.opacity, scale: 1 }}
      transition={{ duration: 0.65 }}
      className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
    >
      <div className="w-[84%] h-[84%] rounded-full relative flex items-center justify-center overflow-hidden">
        {/* Main base cheese pool */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${config.highlight} 20%, ${config.main} 68%, ${config.shadow} 95%)`,
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.25)',
          }}
        />

        {/* Pulsing hot cheese bubbles */}
        <div className="absolute inset-3 rounded-full opacity-70">
          <svg className="w-full h-full animate-pulse-slow">
            {[
              { cx: 32, cy: 28, r: 7.5 },
              { cx: 72, cy: 38, r: 6.2 },
              { cx: 48, cy: 68, r: 8.5 },
              { cx: 66, cy: 64, r: 5.0 },
              { cx: 28, cy: 54, r: 6.8 },
              { cx: 58, cy: 26, r: 8.0 },
            ].map((bubble, i) => (
              <circle
                key={i}
                cx={`${bubble.cx}%`}
                cy={`${bubble.cy}%`}
                r={bubble.r}
                fill="#FFB627"
                stroke="#E65100"
                strokeWidth="1.2"
                opacity="0.8"
              />
            ))}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
