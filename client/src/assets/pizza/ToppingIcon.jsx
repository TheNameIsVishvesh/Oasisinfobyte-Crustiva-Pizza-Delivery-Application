import React from 'react';

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
  switch (name) {
    case 'Sliced Mushrooms':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
          <path d="M 6 11 C 6 6, 18 6, 18 11 C 18 13, 16 13, 15 11 C 14 9, 10 9, 9 11 C 8 13, 6 13, 6 11 Z" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1.5" />
          <path d="M 10 11 L 10 17 C 10 18.5, 14 18.5, 14 17 L 14 11 Z" fill="#BCAAA4" stroke="#5D4037" strokeWidth="1.5" />
        </svg>
      );
    case 'Sweet Corn':
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 drop-shadow-md">
          <path d="M 12 3 C 15 6, 17 12, 12 21 C 7 12, 9 6, 12 3 Z" fill="#FFC107" stroke="#FF8F00" strokeWidth="1.2" />
          <circle cx="11" cy="9" r="1.2" fill="#FFF" opacity="0.8" />
        </svg>
      );
    case 'Crisp Capsicum':
      return (
        <svg viewBox="0 0 24 24" className="w-5.5 h-3 drop-shadow-md">
          <path d="M 3 10 A 9 9 0 0 1 21 10 A 7 7 0 0 0 3 10" fill="#35C26B" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'Red Onions':
      return (
        <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 drop-shadow-md">
          <path d="M 4 12 A 8 8 0 0 1 20 12" fill="none" stroke="#BA68C8" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 6 12 A 6 6 0 0 1 18 12" fill="none" stroke="#E1BEE7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'Black Olives':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 drop-shadow-md">
          <circle cx="12" cy="12" r="8" fill="#1C1816" stroke="#000" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.2" fill="#0F0B0A" />
          <circle cx="9.5" cy="9.5" r="1.2" fill="#FFF" opacity="0.4" />
        </svg>
      );
    case 'Jalapenos':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-md">
          <circle cx="12" cy="12" r="8.5" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="6" fill="#4CAF50" />
          <circle cx="10" cy="10" r="1.2" fill="#FFF9C4" />
          <circle cx="14" cy="11" r="1" fill="#FFF9C4" />
          <circle cx="11" cy="14" r="1.1" fill="#FFF9C4" />
        </svg>
      );
    case 'Spicy Pepperoni':
      return (
        <svg viewBox="0 0 24 24" className="w-6.5 h-6.5 drop-shadow-lg">
          <circle cx="12" cy="12" r="10" fill="url(#pepperoniGrad)" stroke="#9E0D0D" strokeWidth="1.5" />
          <circle cx="8" cy="9" r="1" fill="#FFC107" opacity="0.8" />
          <circle cx="15" cy="13" r="1.5" fill="#FFC107" opacity="0.6" />
          <circle cx="11" cy="15" r="0.8" fill="#FFC107" opacity="0.7" />
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="#5A0000" strokeWidth="1" opacity="0.35" />
        </svg>
      );
    case 'Smoked Chicken Tikka':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-md">
          <rect x="5" y="5" width="13" height="13" rx="2.5" fill="#D84315" stroke="#3E2723" strokeWidth="1.5" transform="rotate(15, 12, 12)" />
          <line x1="8" y1="9.5" x2="15" y2="9.5" stroke="#3E2723" strokeWidth="1.2" />
          <line x1="8" y1="13.5" x2="15" y2="13.5" stroke="#3E2723" strokeWidth="1.2" />
        </svg>
      );
    case 'Italian Sausage':
      return (
        <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 drop-shadow-md">
          <path d="M 6 12 C 6 8, 12 6, 15 9 C 18 12, 15 15, 12 14 C 9 13, 6 16, 6 12 Z" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.5" />
          <circle cx="9" cy="11" r="0.6" fill="#81C784" />
          <circle cx="13" cy="12" r="0.5" fill="#3E2723" />
        </svg>
      );
    case 'BBQ Ham':
      return (
        <svg viewBox="0 0 24 24" className="w-5.5 h-5 drop-shadow-md">
          <rect x="5" y="7" width="14" height="10" rx="1.5" fill="#F48FB1" stroke="#C2185B" strokeWidth="1.5" />
          <line x1="8" y1="6" x2="16" y2="18" stroke="#AD1457" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      );
    default:
      return null;
  }
}
