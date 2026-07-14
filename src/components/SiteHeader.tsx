import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AstikanLogo from './AstikanLogo';

const navItems = [
  { label: 'ASTIKAN', to: '/astikan', enabled: true },
  { label: 'ASTIKAN PAY', to: '/astikan-pay', enabled: true },
  { label: 'THE KIOSK', to: '/the-kiosk', enabled: true },
  { label: 'RESEARCH', to: '/research', enabled: true },
  { label: 'MISSION', to: '/mission', enabled: true },
  { label: 'COMPANY', to: '/company', enabled: true },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const currentPath = typeof window === 'undefined'
    ? '/'
    : window.location.pathname.replace(/\/+$/, '') || '/';

  const renderDesktopItem = (item) => {
    const active = currentPath === item.to;
    const className = `group relative py-2 text-[11px] font-extrabold tracking-[0.08em] text-navy-900/70 transition hover:text-navy-900 xl:text-xs ${active ? 'text-navy-900' : ''}`;

    return (
      <a key={item.label} href={item.to} className={className}>
        {item.label}
        <span className={`absolute inset-x-0 -bottom-[18px] h-0.5 origin-left bg-navy-900 transition-transform ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
      </a>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1380px] items-center px-5 lg:px-8">
        <span
          role="link"
          tabIndex={0}
          aria-label="Astikan home"
          onClick={() => window.location.assign('/')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') window.location.assign('/');
          }}
          className="shrink-0 cursor-pointer"
        >
          <AstikanLogo compact />
        </span>

        <nav className="ml-10 hidden items-center gap-5 lg:flex xl:ml-14 xl:gap-7" aria-label="Primary navigation">
          {navItems.map(renderDesktopItem)}
        </nav>

        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy-900 transition hover:bg-slate-100"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[76px] z-40 min-h-[calc(100vh-76px)] bg-navy-950/20 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <aside
            className="ml-auto min-h-[calc(100vh-76px)] w-full max-w-sm border-l border-slate-200 bg-white px-6 py-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <nav className="grid" aria-label="Expanded navigation">
              {navItems.map((item) => {
                const active = currentPath === item.to;
                const className = `border-b border-slate-100 py-4 text-sm font-extrabold tracking-[0.08em] transition ${active ? 'text-blue-700' : 'text-navy-900 hover:pl-1 hover:text-blue-700'}`;

                return (
                  <a key={item.label} href={item.to} onClick={() => setOpen(false)} className={className}>
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
