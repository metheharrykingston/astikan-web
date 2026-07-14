import React from 'react';
import astikanLogo from '../assets/logo.png';
import astikanMark from '../assets/logo-mark.png';

interface AstikanMarkProps {
  className?: string;
}

interface AstikanLogoProps {
  compact?: boolean;
  light?: boolean;
}

export function AstikanMark({ className = 'h-11 w-11' }: AstikanMarkProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <img
        src={astikanMark}
        alt=""
        className="block h-full w-full object-contain"
        draggable="false"
      />
    </span>
  );
}

export default function AstikanLogo({ compact = false, light = false }: AstikanLogoProps) {
  return (
    <span
      className="inline-flex items-center overflow-hidden"
      aria-label="Astikan"
    >
      <img
        src={astikanLogo}
        alt="Astikan"
        className={`${compact ? 'h-9' : 'h-11'} block w-auto max-w-[220px] object-contain sm:max-w-none ${light ? 'brightness-0 invert' : ''}`}
        draggable="false"
      />
    </span>
  );
}
