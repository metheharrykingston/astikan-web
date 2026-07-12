import React from 'react';
import astikanLogo from '../assets/logo.png';

export function AstikanMark({ className = 'h-11 w-11' }) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden bg-white ${className}`}
      aria-hidden="true"
    >
      <img
        src={astikanLogo}
        alt=""
        className="absolute inset-y-0 left-0 h-full w-auto max-w-none object-contain"
        draggable="false"
      />
    </span>
  );
}

export default function AstikanLogo({ compact = false }) {
  return (
    <span
      className="inline-flex items-center overflow-hidden bg-white"
      aria-label="Astikan"
    >
      <img
        src={astikanLogo}
        alt="Astikan"
        className={`${compact ? 'h-11' : 'h-14'} block w-auto max-w-[220px] object-contain sm:max-w-none`}
        draggable="false"
      />
    </span>
  );
}
