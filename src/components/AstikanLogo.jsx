import React from 'react';
import astikanLogo from '../assets/logo.png';

export function AstikanMark({ className = 'h-11 w-11' }) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <img
        src={astikanLogo}
        alt=""
        className="absolute inset-y-0 left-0 h-full w-auto max-w-none"
        draggable="false"
      />
    </span>
  );
}

export default function AstikanLogo({ light = false, compact = false }) {
  return (
    <span
      className={`inline-flex items-center ${light ? 'rounded-xl bg-white px-3 py-2 shadow-sm' : ''}`}
      aria-label="Astikan"
    >
      <img
        src={astikanLogo}
        alt="Astikan"
        className={`${compact ? 'h-11' : 'h-14'} w-auto max-w-[220px] object-contain sm:max-w-none`}
        draggable="false"
      />
    </span>
  );
}
