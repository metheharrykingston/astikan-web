import React from 'react';

export function AstikanMark({ className = 'h-11 w-11' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 3 39 15 52 12 49 25 61 32 49 39 52 52 39 49 32 61 25 49 12 52 15 39 3 32 15 25 12 12 25 15 32 3Z" fill="#FFF8E7" stroke="#0B3974" strokeWidth="3"/>
      <path d="M32 11 37 20 47 18 44 28 53 32 44 37 47 47 37 44 32 53 27 44 17 47 20 37 11 32 20 28 17 18 27 20 32 11Z" fill="#E8B34D" stroke="#0B3974" strokeWidth="2"/>
      <circle cx="32" cy="32" r="10" fill="#0B3974"/>
      <path d="M32 25v14M25 32h14" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function AstikanLogo({ light = false, compact = false }) {
  return (
    <a href="#top" className="group inline-flex items-center gap-2.5" aria-label="Astikan Healthcare Trust home">
      <AstikanMark className={compact ? 'h-9 w-9' : 'h-11 w-11'} />
      <span className="leading-none">
        <span className={`block text-[1.35rem] font-extrabold tracking-[0.12em] ${light ? 'text-white' : 'text-navy-900'}`}>ASTIKAN</span>
        <span className={`mt-1 block text-[0.55rem] font-bold tracking-[0.24em] ${light ? 'text-blue-200' : 'text-navy-700'}`}>HEALTHCARE TRUST</span>
      </span>
    </a>
  );
}
