import React from 'react';
import { Package, Shirt, Sparkles } from 'lucide-react';
import { AstikanMark } from '../components/AstikanLogo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const shopIdeas = [
  [Shirt, 'Astikan Logo T-shirts', 'Official Astikan identity pieces designed around the mark and mission.'],
  [Sparkles, 'Limited Editions', 'Small, carefully designed releases connected to Astikan milestones and research.'],
  [Package, 'Astikan Objects', 'Future physical objects, prints, and collectible pieces from the Astikan world.'],
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main className="pt-[76px]">
        <section className="relative overflow-hidden bg-[#051a3c] px-5 py-24 text-white sm:py-32 lg:px-8">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,#6db6ff_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -right-20 top-1/2 h-[430px] w-[430px] -translate-y-1/2 rounded-full border border-blue-300/15" />
          <div className="relative mx-auto grid max-w-[1380px] items-center gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-xs font-extrabold tracking-[0.24em] text-cyan-300">ASTIKAN SHOP</p>
              <h1 className="mt-5 text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl">Wear the mission.</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/75 sm:text-lg">
                The official Astikan Shop is being prepared as a home for logo T-shirts and a small collection of objects connected to the company’s identity.
              </p>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-white/55">Coming later</p>
            </div>
            <div className="relative mx-auto flex h-[420px] w-full max-w-[560px] items-center justify-center">
              <div className="absolute h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="relative flex h-72 w-72 items-center justify-center rounded-[3rem] border border-white/15 bg-white/[.06] shadow-dashboard backdrop-blur-xl sm:h-80 sm:w-80">
                <AstikanMark className="h-48 w-48 sm:h-56 sm:w-56" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-[1380px]">
            <p className="text-xs font-extrabold tracking-[0.2em] text-gold-500">THE FIRST COLLECTION</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">Astikan identity, translated into physical form.</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {shopIdeas.map(([Icon, title, text]) => (
                <article key={title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-card"><Icon size={28} strokeWidth={1.45} /></span>
                  <h3 className="mt-6 text-lg font-extrabold text-navy-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
