import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import AstikanLogo from './AstikanLogo';

const navItems = [
  { label: 'Care', to: '/#ecosystem', dropdown: true },
  { label: 'Technology', to: '/technology' },
  { label: 'Partners', to: '/partners' },
  { label: 'Trust', to: '/trust' },
  { label: 'Impact', to: '/#impact' },
  { label: 'Insights', to: '/#insights' },
  { label: 'Contact', to: '/#contact' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const currentPath = typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/+$/, '') || '/';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 lg:px-8">
        <span onClick={(event) => { event.preventDefault(); window.location.assign('/'); }} className="cursor-pointer"><AstikanLogo compact /></span>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.to.startsWith('/') && !item.to.startsWith('/#') && currentPath === item.to;
            return (
              <a
                key={item.label}
                href={item.to}
                className={`group relative inline-flex items-center gap-1 py-2 text-sm font-semibold transition ${
                  active ? 'text-navy-900' : 'text-navy-900/75 hover:text-navy-900'
                }`}
              >
                {item.label}
                {item.dropdown && <ChevronDown className="h-3.5 w-3.5" />}
                <span className={`absolute inset-x-0 -bottom-[18px] h-0.5 origin-left bg-navy-900 transition-transform ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </a>
            );
          })}
        </nav>

        <a
          href="/#contact"
          className="hidden items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-navy-900/10 transition hover:-translate-y-0.5 hover:bg-navy-800 lg:inline-flex"
        >
          Start Care Journey <ArrowRight size={15} />
        </a>

        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-navy-900 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-soft lg:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => {
              const active = item.to.startsWith('/') && !item.to.startsWith('/#') && currentPath === item.to;
              return (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 font-semibold transition ${
                    active ? 'bg-blue-50 text-navy-900' : 'text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white"
            >
              Start Care Journey <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
