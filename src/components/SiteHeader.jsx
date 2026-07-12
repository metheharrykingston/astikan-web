import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AstikanLogo from './AstikanLogo';

const navItems = [
  { label: 'ASTIKAN', to: '/astikan', enabled: true },
  { label: 'ASTIKAN PAY', enabled: false },
  { label: 'THE KIOSK', enabled: false },
  { label: 'RESEARCH', enabled: false },
  { label: 'MISSION', enabled: false },
  { label: 'COMPANY', enabled: false },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const currentPath = typeof window === 'undefined'
    ? '/'
    : window.location.pathname.replace(/\/+$/, '') || '/';

  const renderDesktopItem = (item) => {
    const active = item.enabled && currentPath === item.to;
    const className = `group relative py-2 text-[11px] font-extrabold tracking-[0.08em] transition xl:text-xs ${
      active ? 'text-navy-900' : item.enabled ? 'text-navy-900/70 hover:text-navy-900' : 'cursor-default text-navy-900/45'
    }`;

    if (!item.enabled) {
      return <span key={item.label} aria-disabled="true" className={className}>{item.label}</span>;
    }

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
        <a href="/" aria-label="Astikan home" className="shrink-0">
          <AstikanLogo compact />
        </a>

        <nav className="ml-10 hidden items-center gap-5 lg:flex xl:ml-14 xl:gap-7" aria-label="Primary navigation">
          {navItems.map(renderDesktopItem)}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <span aria-disabled="true" className="hidden cursor-default py-2 text-[11px] font-extrabold tracking-[0.1em] text-navy-900/45 sm:inline-flex xl:text-xs">
            SHOP
          </span>
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
              {[...navItems, { label: 'SHOP', enabled: false }].map((item) => {
                const active = item.enabled && currentPath === item.to;
                const className = `border-b border-slate-100 py-4 text-sm font-extrabold tracking-[0.08em] transition ${
                  active ? 'text-blue-700' : item.enabled ? 'text-navy-900 hover:pl-1 hover:text-blue-700' : 'cursor-default text-navy-900/40'
                }`;

                if (!item.enabled) {
                  return <span key={item.label} aria-disabled="true" className={className}>{item.label}</span>;
                }

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
