import React from 'react';

export function AstikanMark({ className = 'h-11 w-11' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="astikan-mark-gradient" x1="6" y1="7" x2="59" y2="57" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6858B6" />
          <stop offset="0.5" stopColor="#8E2D91" />
          <stop offset="1" stopColor="#5A145F" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#astikan-mark-gradient)" />
      <path d="M13 45C22 37 30 27 38 15C41 10 47 9 50 13C52 16 51 20 48 23C40 31 30 40 19 48C16 50 12 49 10 47C9 46 10 46 13 45Z" fill="white" />
      <path d="M17 16C24 18 31 23 37 29C42 34 46 41 48 49C49 52 47 54 45 53C43 52 42 49 41 46C38 37 31 29 22 24C18 22 14 20 12 18C10 16 12 15 17 16Z" fill="white" />
      <path d="M13 46C22 45 31 40 40 32C46 27 50 22 53 18C55 16 57 16 58 18C59 20 58 22 56 24C49 33 39 42 27 49C20 53 14 55 10 53C8 52 9 48 13 46Z" fill="white" fillOpacity="0.96" />
    </svg>
  );
}

export default function AstikanLogo({ light = false, compact = false }) {
  return (
    <span className="inline-flex items-center gap-3" aria-label="Astikan Healthcare">
      <AstikanMark className={compact ? 'h-10 w-10' : 'h-12 w-12'} />
      <span className="leading-none">
        <span className={`block text-[1.42rem] font-extrabold tracking-[0.04em] ${light ? 'text-white' : 'text-[#25262b]'}`}>astikan</span>
        <span className={`mt-1 block text-[0.56rem] font-semibold tracking-[0.24em] ${light ? 'text-violet-200' : 'text-[#6f2f79]'}`}>HEALTHCARE</span>
      </span>
    </span>
  );
}
