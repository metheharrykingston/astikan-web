import React, { useId } from 'react';

function WordmarkSymbol({ className = 'h-9 w-7' }) {
  const gradientId = `astikan-wordmark-${useId().replace(/:/g, '')}`;

  return (
    <svg className={className} viewBox="0 0 34 52" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="3" y1="45" x2="29" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4167B1" />
          <stop offset="0.48" stopColor="#68358E" />
          <stop offset="1" stopColor="#8E1E77" />
        </linearGradient>
      </defs>
      <path
        d="M20.8 2.8C16.4 9.4 13.2 17 11.7 25.4L3.2 28.1C1.8 28.6 1.7 30.5 3.1 31L11 33.6C11.9 40.4 14.1 46 17.3 50C18.2 51.1 19.9 50.4 19.8 49C19.4 43 19.8 37.7 21 33.2L31.1 30.4C32.8 29.9 32.8 27.6 31.1 27.1L22.8 24.8C24.6 17.4 25.2 10.5 24.6 4.1C24.4 2.3 21.8 1.3 20.8 2.8Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

export function AstikanMark({ className = 'h-11 w-11' }) {
  const gradientId = `astikan-mark-${useId().replace(/:/g, '')}`;

  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="5" y1="8" x2="59" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E68B2" />
          <stop offset="0.46" stopColor="#67408F" />
          <stop offset="1" stopColor="#8D1D72" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" fill={`url(#${gradientId})`} />

      <path
        d="M4.2 48.5C13.6 47.4 23.7 41.5 33.6 31.2C40.6 23.9 46.6 16.8 51.6 13.4C54.3 11.5 57.3 11.2 58.7 13C60.5 15.2 58.9 19.5 55.1 24.2C49.8 30.8 43.1 37.5 35.8 43C25.2 51 14.4 56.9 5.4 58.4C3.3 58.7 2.1 57.2 2.2 54.7C2.3 52.4 2.8 50 4.2 48.5Z"
        fill="white"
      />

      <path
        d="M13.2 12.1C22.6 13 32.5 17.3 41.2 24.8L49.5 17.1C52.4 14.4 55.8 14.2 57.3 16.2C59 18.6 56.9 22.8 52.8 27.4L47.3 33.2C52.1 40.4 55.2 48.7 55.8 57.2C55.9 59.1 54.1 60.1 52.9 58.6C48.4 52.8 43.8 47.5 38.4 42.9C31.8 48 25.4 51.1 19.2 52.2C17.2 52.5 16.4 50.8 17.7 49.2C21.6 44.6 25.8 39.6 29.8 34.2C23.4 26.3 16.6 20.4 9.5 16.5C6.9 15.1 8.7 11.7 13.2 12.1Z"
        fill="white"
      />

      <path d="M2.2 54.3C8.8 53.2 14.4 50.9 20.2 47.2C17.5 52 14.1 56.2 10 61.5H2V55.4C2 55 2.1 54.6 2.2 54.3Z" fill="white" />
    </svg>
  );
}

export default function AstikanLogo({ light = false, compact = false }) {
  return (
    <span
      className={`inline-flex items-center ${light ? 'rounded-xl bg-white px-3 py-2 shadow-sm' : ''}`}
      aria-label="Astikan"
    >
      <AstikanMark className={compact ? 'h-10 w-10 shrink-0' : 'h-12 w-12 shrink-0'} />
      <span className={`ml-3 inline-flex items-center leading-none ${compact ? 'translate-y-[1px]' : ''}`}>
        <span className={`${compact ? 'text-[2rem]' : 'text-[2.35rem]'} font-light tracking-[-0.055em] text-[#242424]`}>as</span>
        <WordmarkSymbol className={compact ? 'mx-[1px] h-8 w-6' : 'mx-[2px] h-9 w-7'} />
        <span className={`${compact ? 'text-[2rem]' : 'text-[2.35rem]'} font-light tracking-[-0.055em] text-[#242424]`}>ikan</span>
      </span>
    </span>
  );
}
