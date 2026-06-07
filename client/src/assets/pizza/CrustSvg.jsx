import React from 'react';

export default function CrustSvg({ base }) {
  const getCrustColors = (b) => {
    switch (b) {
      case 'Whole Wheat Crust':
        return { stroke: '#5D4037', fill: '#8D6E63', accent: '#4E342E' };
      case 'Gluten-Free Crust':
        return { stroke: '#8D6E63', fill: '#A1887F', accent: '#795548' };
      case 'Cheese Burst Crust':
        return { stroke: '#FF8F00', fill: '#FFB627', accent: '#FFD54F', glow: true };
      default: // Hand Tossed / standard
        return { stroke: '#E65100', fill: '#FFB74D', accent: '#FFE082' };
    }
  };

  const colors = getCrustColors(base);

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      <defs>
        {colors.glow && (
          <filter id="crust-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
        <radialGradient id="crust-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A120F" stopOpacity="0" />
          <stop offset="82%" stopColor={colors.fill} stopOpacity="0.4" />
          <stop offset="90%" stopColor={colors.fill} />
          <stop offset="100%" stopColor={colors.stroke} />
        </radialGradient>
      </defs>

      {/* Main Crust base circle */}
      <circle
        cx="100"
        cy="100"
        r="94"
        fill="url(#crust-grad)"
        stroke={colors.stroke}
        strokeWidth="6.5"
        filter={colors.glow ? 'url(#crust-glow)' : undefined}
        style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />

      {/* Specialty overlay details */}
      {base === 'Whole Wheat Crust' && (
        <>
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i * 12 * Math.PI) / 180;
            const r = 90 + Math.sin(i * 7) * 2;
            const x = 100 + Math.cos(angle) * r;
            const y = 100 + Math.sin(angle) * r;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="0.9"
                fill={colors.accent}
                opacity="0.65"
              />
            );
          })}
        </>
      )}

      {base === 'Cheese Burst Crust' && (
        <>
          {/* Glowing bubbling cheese edge */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = 100 + Math.cos(angle) * 89;
            const y = 100 + Math.sin(angle) * 89;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={colors.accent}
                stroke="#FF6B35"
                strokeWidth="0.8"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.8s',
                }}
              />
            );
          })}
        </>
      )}

      {/* Roasted Scorch Marks */}
      {base !== 'Cheese Burst Crust' && base !== 'Whole Wheat Crust' && (
        <>
          {[
            { cx: 78, cy: 11, rx: 7, ry: 2, rot: 12 },
            { cx: 178, cy: 78, rx: 6, ry: 2.5, rot: -35 },
            { cx: 112, cy: 186, rx: 8, ry: 2, rot: 15 },
            { cx: 16, cy: 118, rx: 7, ry: 2.5, rot: 55 },
          ].map((mark, i) => (
            <ellipse
              key={i}
              cx={mark.cx}
              cy={mark.cy}
              rx={mark.rx}
              ry={mark.ry}
              fill="#2E1A16"
              opacity="0.4"
              transform={`rotate(${mark.rot}, ${mark.cx}, ${mark.cy})`}
            />
          ))}
        </>
      )}

      {/* Inner dough indentation line */}
      <circle
        cx="100"
        cy="100"
        r="84"
        fill="none"
        stroke={colors.stroke}
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.2"
      />
    </svg>
  );
}
