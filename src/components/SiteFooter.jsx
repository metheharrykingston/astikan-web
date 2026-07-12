import React from 'react';
import { ArrowUpRight, Atom, Building2, CreditCard, FlaskConical, Grid3X3, Orbit } from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import AstikanLogo, { AstikanMark } from './AstikanLogo';

const worldCards = [
  {
    eyebrow: 'UNIFIED HEALTH INTERFACE',
    title: 'Astikan',
    text: 'A connected application bringing everyday health moments into one calm interface.',
    to: '/astikan',
    icon: Grid3X3,
    enabled: true,
  },
  {
    eyebrow: 'HEALTH-FIRST UPI',
    title: 'Astikan Pay',
    text: 'Everyday UPI and health payments organised in one familiar payment experience.',
    to: '/astikan-pay',
    icon: CreditCard,
    enabled: true,
  },
  {
    eyebrow: 'PHYSICAL HEALTH INTERFACE',
    title: 'The Kiosk',
    text: 'A connected physical health station bringing guided check-ups, consultation, diagnostics, and medicine access together.',
    to: '/the-kiosk',
    icon: Building2,
    enabled: true,
  },
];

const footerGroups = [
  {
    title: 'SYSTEMS',
    items: [
      { label: 'Astikan', to: '/astikan', enabled: true },
      { label: 'Astikan Pay', to: '/astikan-pay', enabled: true },
      { label: 'The Kiosk', to: '/the-kiosk', enabled: true },
    ],
  },
  {
    title: 'EXPLORATION',
    items: [
      { label: 'Research', enabled: false },
      { label: 'Mission', enabled: false },
      { label: 'Future Systems', enabled: false },
    ],
  },
  {
    title: 'COMPANY',
    items: [
      { label: 'Company', enabled: false },
      { label: 'Shop', enabled: false },
      { label: 'Astikan.com', to: '/', enabled: true },
    ],
  },
];

function FooterLink({ item }) {
  if (!item.enabled) {
    return (
      <span className="inline-flex cursor-default items-center gap-2 text-sm text-blue-100/35" aria-disabled="true">
        {item.label}
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-blue-100/30">Later</span>
      </span>
    );
  }

  return (
    <a href={item.to} className="group inline-flex items-center gap-2 text-sm text-blue-100/70 transition hover:text-white">
      {item.label}
      <ArrowUpRight size={13} className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
    </a>
  );
}

export default function SiteFooter() {
  return (
    <div data-universal-footer="true">
      <section className="border-t border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_100%)] px-5 py-20 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.72fr]">
            <div data-aos="fade-up">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">THE ASTIKAN WORLD</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-[-0.035em] text-navy-900 sm:text-5xl lg:text-6xl">
                A growing family of health technologies.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-slate-600 lg:justify-self-end" data-aos="fade-up" data-aos-delay="90">
              Astikan is building connected digital and physical systems that make health experiences clearer, calmer, and more useful across everyday life.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {worldCards.map(({ eyebrow, title, text, to, icon: Icon, enabled }, index) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <Icon size={26} strokeWidth={1.45} />
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] ${enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {enabled ? 'Explore' : 'In development'}
                    </span>
                  </div>
                  <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-500">{eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-navy-900">{title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">{text}</p>
                  {enabled && <ArrowUpRight className="mt-8 h-5 w-5 text-blue-600 transition group-hover:translate-x-1 group-hover:-translate-y-1" />}
                </>
              );

              const className = `group min-h-[320px] rounded-[2rem] border border-slate-200 bg-white p-7 shadow-card transition duration-300 ${enabled ? 'hover:-translate-y-1 hover:shadow-soft' : 'cursor-default opacity-75'}`;

              return enabled ? (
                <a key={title} href={to} className={className} data-aos="fade-up" data-aos-delay={index * 70}>
                  {content}
                </a>
              ) : (
                <article key={title} className={className} data-aos="fade-up" data-aos-delay={index * 70}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-[#031735] text-white">
        <div className="absolute -right-40 top-0 h-[520px] w-[520px] rounded-full border border-blue-300/10" />
        <div className="absolute -right-16 top-24 h-[310px] w-[310px] rounded-full border border-dashed border-cyan-200/10" />
        <div className="absolute bottom-0 right-0 h-72 w-1/2 opacity-15 [background-image:radial-gradient(circle,#79c5ff_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="relative mx-auto max-w-[1380px] px-5 pb-8 pt-16 lg:px-8 lg:pt-20">
          <div className="grid gap-14 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
            <div data-aos="fade-up">
              <span onClick={() => window.location.assign('/')} className="inline-block cursor-pointer" role="link" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') window.location.assign('/'); }}>
                <AstikanLogo light />
              </span>
              <p className="mt-6 max-w-md text-sm leading-7 text-blue-100/65">
                Astikan builds health technologies for a world where every life can understand, access, and navigate health with greater clarity.
              </p>
              <div className="mt-8 flex items-center gap-3">
                {[[FaLinkedinIn, 'LinkedIn'], [FaXTwitter, 'X'], [FaYoutube, 'YouTube'], [FaInstagram, 'Instagram']].map(([Icon, label]) => (
                  <span key={label} aria-label={`${label} coming later`} className="flex h-10 w-10 cursor-default items-center justify-center rounded-full border border-white/15 text-blue-100/45">
                    <Icon size={15} />
                  </span>
                ))}
              </div>
            </div>

            {footerGroups.map((group, groupIndex) => (
              <div key={group.title} data-aos="fade-up" data-aos-delay={(groupIndex + 1) * 65}>
                <h3 className="text-[11px] font-extrabold tracking-[0.2em] text-white">{group.title}</h3>
                <div className="mt-6 space-y-4">
                  {group.items.map((item) => <FooterLink key={item.label} item={item} />)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-5 border-y border-white/10 py-8 sm:grid-cols-3" data-aos="fade-up">
            {[
              [Orbit, 'Connected systems', 'Digital and physical health technologies designed as one growing world.'],
              [FlaskConical, 'Long-term research', 'Research-led exploration of what health technology can become next.'],
              [Atom, 'Built for life', 'A mission extending beyond individual products toward life wherever it exists.'],
            ].map(([Icon, title, text]) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[.06] text-cyan-300"><Icon size={20} strokeWidth={1.45} /></span>
                <div><div className="text-sm font-extrabold text-white">{title}</div><div className="mt-2 text-xs leading-5 text-blue-100/50">{text}</div></div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-7 text-[11px] text-blue-100/45 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Astikan. All rights reserved.</span>
            <span className="inline-flex items-center gap-2"><AstikanMark className="h-5 w-5" /> Building technologies for life.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
