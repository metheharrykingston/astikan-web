import React from 'react';

const points = [
  [14, 38], [24, 28], [34, 25], [44, 36], [53, 20], [63, 29], [75, 22], [86, 34],
  [21, 55], [34, 50], [50, 52], [63, 47], [78, 55], [44, 66], [60, 68], [74, 72]
];

export default function WorldNetwork() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="globeFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54 45) rotate(90) scale(40)">
          <stop stopColor="#CFE7FF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#EAF5FF" stopOpacity="0.1" />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="1.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="55" cy="48" r="38" fill="url(#globeFill)" stroke="#C5E0FA" strokeWidth="0.45"/>
      <ellipse cx="55" cy="48" rx="38" ry="13" stroke="#BCD9F5" strokeWidth="0.35"/>
      <ellipse cx="55" cy="48" rx="38" ry="25" stroke="#BCD9F5" strokeWidth="0.3"/>
      <ellipse cx="55" cy="48" rx="18" ry="38" stroke="#BCD9F5" strokeWidth="0.35"/>
      <ellipse cx="55" cy="48" rx="30" ry="38" stroke="#BCD9F5" strokeWidth="0.28"/>
      <path d="M29 39c5-8 13-14 25-17l9 5 9-1 8 8-2 7-10 3-5 8-9-2-8 4-6-5-9-1-2-9Z" fill="#B8D8F6" fillOpacity=".5"/>
      <path d="M39 59 50 56l7 7-2 11-8 4-7-7-1-12ZM67 58l12-4 7 5-5 11-10-2-4-10Z" fill="#B8D8F6" fillOpacity=".45"/>
      {points.map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r="1.4" fill="white" filter="url(#glow)" />
          <circle cx={x} cy={y} r="3" fill="#D9ECFF" opacity=".4" />
        </g>
      ))}
      {points.slice(0, -1).map(([x, y], index) => {
        const [x2, y2] = points[(index + 3) % points.length];
        return <path key={`l-${index}`} d={`M${x} ${y} Q ${(x+x2)/2} ${(y+y2)/2-5} ${x2} ${y2}`} stroke="#A7CEF1" strokeWidth=".35" opacity=".9"/>;
      })}
    </svg>
  );
}
