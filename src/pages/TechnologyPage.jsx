import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  ArrowRight,
  Atom,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Dna,
  FileHeart,
  Fingerprint,
  Globe2,
  HeartPulse,
  MapPin,
  Microscope,
  MonitorSmartphone,
  Network,
  Orbit,
  Pill,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  Syringe,
  TestTube2,
  WalletCards,
  WifiOff,
  Wrench,
} from 'lucide-react';
import { AstikanMark } from '../components/AstikanLogo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const orbitNodes = [
  { label: 'Health App', Icon: Smartphone, position: 'left-[5%] top-[11%]' },
  { label: 'Astikan Pay', Icon: WalletCards, position: 'left-[1%] top-[45%]' },
  { label: 'Health Kiosk', Icon: MonitorSmartphone, position: 'left-[12%] bottom-[5%]' },
  { label: 'Robotic Surgery', Icon: Syringe, position: 'right-[2%] top-[10%]' },
  { label: 'Medical Nanobots', Icon: Atom, position: 'right-[0%] top-[46%]' },
  { label: 'Sci-Fi Pills', Icon: Pill, position: 'right-[10%] bottom-[4%]' },
];

const roadmap = [
  {
    step: 'NOW',
    status: 'In active development',
    title: 'Astikan Health App',
    text: 'A unified everyday health companion for care access, records, bookings, plans, and continuous support.',
    Icon: Smartphone,
  },
  {
    step: 'NEXT',
    status: 'In development',
    title: 'Astikan Pay',
    text: 'A healthcare-focused payment layer designed for bills, benefits, care financing, and transparent transactions.',
    Icon: WalletCards,
  },
  {
    step: 'ACCESS',
    status: 'Research & prototyping',
    title: 'Health Kiosks',
    text: 'Physical care-access points for communities, workplaces, rural regions, and places where smartphones are not enough.',
    Icon: MonitorSmartphone,
  },
  {
    step: 'PRECISION',
    status: 'Future R&D',
    title: 'Robotic Surgery',
    text: 'Exploring systems that can improve precision, consistency, remote collaboration, and recovery outcomes.',
    Icon: Syringe,
  },
  {
    step: 'FRONTIER',
    status: 'Long-horizon research',
    title: 'Nanobots & Smart Pills',
    text: 'Speculative research into targeted treatment, responsive medicines, and entirely new ways to interact with the body.',
    Icon: Atom,
  },
];

const appCapabilities = [
  [CalendarDays, 'Book care and manage appointments'],
  [FileHeart, 'Keep reports and health records together'],
  [HeartPulse, 'Follow care plans and daily health journeys'],
  [Stethoscope, 'Connect with doctors, labs, and hospitals'],
];

const payCapabilities = [
  [CreditCard, 'Pay medical bills through one clear interface'],
  [ReceiptText, 'Track receipts, refunds, and payment history'],
  [CircleDollarSign, 'Support care financing and assistance journeys'],
  [ShieldCheck, 'Build for secure, transparent healthcare payments'],
];

const futureCards = [
  {
    title: 'Robotic Surgery',
    label: 'Precision systems',
    text: 'Future surgical systems designed around precision, clinician control, safer workflows, and wider access to expertise.',
    Icon: Syringe,
    visual: 'from-cyan-500/20 via-blue-700/20 to-transparent',
  },
  {
    title: 'Medical Nanobots',
    label: 'Targeted intervention',
    text: 'Long-horizon exploration of microscopic systems that could one day navigate, sense, deliver, or repair at tiny scales.',
    Icon: Atom,
    visual: 'from-violet-500/25 via-fuchsia-700/15 to-transparent',
  },
  {
    title: 'Sci-Fi Pills',
    label: 'Responsive therapeutics',
    text: 'A speculative direction for pills that can sense conditions, release treatment intelligently, and communicate outcomes.',
    Icon: Pill,
    visual: 'from-sky-400/20 via-indigo-700/20 to-transparent',
  },
  {
    title: 'Regenerative Systems',
    label: 'Repair and restoration',
    text: 'Research into technologies that may help restore tissues, rebuild function, and extend healthy human capability.',
    Icon: Dna,
    visual: 'from-emerald-400/20 via-cyan-700/15 to-transparent',
  },
];

const principles = [
  [Microscope, 'Research first', 'Every frontier idea begins as a question, not a promise.'],
  [TestTube2, 'Validate carefully', 'Concepts move forward only through evidence and measurable testing.'],
  [ShieldCheck, 'Safety before scale', 'Healthcare technology must earn trust before it earns reach.'],
  [Globe2, 'Build for access', 'Innovation matters most when it reaches people beyond privileged systems.'],
];

function SectionHeading({ eyebrow, title, text, center = true, light = false }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <p className={`text-xs font-extrabold uppercase tracking-[0.2em] ${light ? 'text-cyan-300' : 'text-gold-500'}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${light ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
      {text && <p className={`mt-5 text-base leading-8 ${light ? 'text-blue-100/75' : 'text-slate-600'}`}>{text}</p>}
    </div>
  );
}

function OrbitVisual() {
  return (
    <div className="tech-orbit relative mx-auto h-[500px] w-full max-w-[650px] sm:h-[610px]">
      <div className="absolute inset-[9%] rounded-full border border-cyan-300/20" />
      <div className="absolute inset-[18%] rounded-full border border-blue-300/25" />
      <div className="absolute inset-[28%] rounded-full border border-dashed border-cyan-300/30" />
      <div className="absolute inset-[17%] animate-[spin_28s_linear_infinite] rounded-full border-t border-blue-300/60 border-r-transparent" />
      <div className="absolute inset-[29%] animate-[spin_20s_linear_infinite_reverse] rounded-full border-b border-cyan-200/60 border-l-transparent" />

      <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(104,205,255,.95),rgba(18,91,178,.74)_28%,rgba(4,26,61,.95)_68%)] shadow-[0_0_100px_rgba(49,153,255,.35)]">
        <div className="absolute inset-[10%] rounded-full border border-white/15" />
        <div className="absolute left-[16%] top-[26%] h-[16%] w-[30%] rotate-12 rounded-[50%] border border-cyan-100/35" />
        <div className="absolute right-[10%] top-[45%] h-[18%] w-[28%] -rotate-12 rounded-[50%] border border-blue-100/30" />
        <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-cyan-200/40 bg-navy-950/85 shadow-[0_0_55px_rgba(74,190,255,.5)] backdrop-blur-xl sm:h-36 sm:w-36">
          <AstikanMark className="h-20 w-20 sm:h-24 sm:w-24" />
        </div>
      </div>

      {orbitNodes.map(({ label, Icon, position }, index) => (
        <div key={label} className={`tech-orbit-node absolute ${position} z-20 flex max-w-[150px] items-center gap-2 rounded-xl border border-cyan-200/20 bg-[#061d45]/85 px-3 py-2.5 text-white shadow-[0_15px_40px_rgba(0,0,0,.25)] backdrop-blur-md`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-200/30 bg-blue-500/10 text-cyan-200"><Icon size={18} strokeWidth={1.6} /></span>
          <span className="text-[11px] font-bold leading-4 sm:text-xs">{label}</span>
          <span className="absolute -z-10 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" style={{ left: index < 3 ? 'calc(100% + 12px)' : '-18px' }} />
        </div>
      ))}

      <div className="absolute inset-x-[15%] bottom-[4%] h-16 rounded-[50%] bg-blue-400/10 blur-2xl" />
    </div>
  );
}

function PhoneMockup({ type }) {
  const isPay = type === 'pay';
  return (
    <div className="relative mx-auto w-[230px] rounded-[2.4rem] border-[7px] border-[#061a3b] bg-white p-3 shadow-[0_30px_60px_rgba(4,26,61,.28)] sm:w-[255px]">
      <div className="mx-auto mb-4 h-4 w-20 rounded-full bg-[#061a3b]" />
      <div className={`rounded-[1.6rem] p-4 ${isPay ? 'bg-gradient-to-b from-[#eff6ff] to-white' : 'bg-gradient-to-b from-[#f5f9ff] to-white'}`}>
        <div className="flex items-center justify-between">
          <AstikanMark className="h-8 w-8" />
          <span className="text-[9px] font-bold text-slate-400">ASTIKAN</span>
        </div>
        {isPay ? (
          <>
            <div className="mt-5 rounded-2xl bg-navy-900 p-4 text-white">
              <div className="text-[9px] text-blue-200">Healthcare balance</div>
              <div className="mt-2 text-2xl font-extrabold">₹24,850</div>
              <div className="mt-4 flex justify-between text-[8px] text-blue-100"><span>Pay bill</span><span>Benefits</span><span>History</span></div>
            </div>
            <div className="mt-4 space-y-2">
              {['Hospital payment', 'Lab test', 'Care plan'].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ReceiptText size={13} /></span><span className="text-[9px] font-bold text-navy-900">{item}</span></div>
                  <span className="text-[9px] font-extrabold text-navy-700">₹{[3200, 980, 1499][index]}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-navy-900 p-4 text-white">
              <div className="text-[9px] text-blue-100">Good morning</div>
              <div className="mt-1 text-base font-extrabold">Your care, in one place.</div>
              <div className="mt-4 h-1.5 rounded-full bg-white/20"><div className="h-full w-[68%] rounded-full bg-cyan-300" /></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[[CalendarDays, 'Appointments'], [FileHeart, 'Records'], [HeartPulse, 'Care plan'], [Stethoscope, 'Doctors']].map(([Icon, label]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"><Icon size={16} className="text-blue-600" /><div className="mt-2 text-[9px] font-bold text-navy-900">{label}</div></div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ eyebrow, title, text, capabilities, visual, reverse = false }) {
  return (
    <article className={`grid items-center gap-10 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-soft sm:p-10 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`} data-aos="fade-up">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
        <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">{title}</h3>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">{text}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {capabilities.map(([Icon, label]) => (
            <div key={label} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><Icon size={16} /></span>
              <span className="text-sm font-semibold leading-6 text-navy-900">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative min-h-[470px] overflow-hidden rounded-[1.6rem] bg-[radial-gradient(circle_at_50%_20%,rgba(121,195,255,.5),transparent_35%),linear-gradient(145deg,#edf7ff,#dcecff)] p-8">
        <div className="absolute inset-x-[10%] bottom-5 h-16 rounded-[50%] bg-navy-900/15 blur-xl" />
        {visual}
      </div>
    </article>
  );
}

function KioskVisual() {
  return (
    <div className="relative mx-auto h-[480px] w-[290px]">
      <div className="absolute left-1/2 top-4 h-[365px] w-[210px] -translate-x-1/2 rounded-[2.4rem] border-[8px] border-[#0a2e65] bg-gradient-to-b from-[#eaf6ff] to-white shadow-[0_35px_80px_rgba(6,38,84,.35)]">
        <div className="mx-auto mt-5 h-2 w-16 rounded-full bg-navy-900/20" />
        <div className="mx-5 mt-5 rounded-2xl bg-navy-900 p-4 text-white">
          <div className="flex items-center gap-3"><AstikanMark className="h-9 w-9" /><div><div className="text-[8px] text-blue-200">ASTIKAN ACCESS</div><div className="text-xs font-extrabold">Community Health Kiosk</div></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[[HeartPulse, 'Vitals'], [Stethoscope, 'Care'], [FileHeart, 'Records'], [ScanLine, 'Scan']].map(([Icon, label]) => <div key={label} className="rounded-lg bg-white/10 p-2 text-center"><Icon size={15} className="mx-auto text-cyan-200" /><div className="mt-1 text-[8px]">{label}</div></div>)}
          </div>
        </div>
        <div className="mx-8 mt-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-3"><Fingerprint className="text-blue-600" /><div className="text-[9px] font-bold text-navy-900">Secure identity & consent</div></div>
        <div className="mx-auto mt-5 h-10 w-10 rounded-full border-4 border-blue-100 bg-white shadow-inner" />
      </div>
      <div className="absolute bottom-16 left-1/2 h-32 w-24 -translate-x-1/2 rounded-b-[1.4rem] bg-gradient-to-b from-[#0d4388] to-[#061a3b]" />
      <div className="absolute bottom-6 left-1/2 h-10 w-64 -translate-x-1/2 rounded-[50%] bg-[#071f46] shadow-[0_18px_25px_rgba(4,26,61,.35)]" />
    </div>
  );
}

export default function TechnologyPage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.tech-hero-copy > *', { y: 28, opacity: 0, duration: 0.72, stagger: 0.08 })
        .from('.tech-orbit', { scale: 0.92, opacity: 0, duration: 1 }, '-=.65')
        .from('.tech-orbit-node', { scale: 0.7, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=.55');
      gsap.to('.tech-orbit-node', { y: -8, duration: 2.7, repeat: -1, yoyo: true, stagger: 0.25, ease: 'sine.inOut' });
    }, pageRef);
    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section id="top" className="relative overflow-hidden bg-[#031a3b] pt-[76px] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(41,141,255,.34),transparent_34%),radial-gradient(circle_at_20%_10%,rgba(16,101,200,.16),transparent_27%)]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(120,190,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(120,190,255,.08)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative mx-auto grid min-h-[760px] max-w-[1380px] items-center gap-10 px-5 py-16 lg:grid-cols-[.83fr_1.17fr] lg:px-8 lg:py-20">
            <div className="tech-hero-copy relative z-10 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-300">ASTIKAN TECHNOLOGY</p>
              <h1 className="mt-5 text-[2.7rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[4.5rem]">Engineering the next era of healthcare.</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/80 sm:text-lg">We are not building a generic software layer. We are building practical healthcare products today—and exploring technologies that could reshape care tomorrow.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#building-now" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-extrabold text-navy-900 transition hover:-translate-y-0.5">See what we are building <ArrowRight size={16} /></a>
                <a href="#future" className="inline-flex items-center gap-2 rounded-md border border-cyan-100/50 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10">Explore future research <Orbit size={16} /></a>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[[Wrench, 'Build first', 'Working products'], [ShieldCheck, 'Safety-led', 'Responsible progress'], [Network, 'Connected', 'One care layer'], [Sparkles, 'Long horizon', 'Beyond today']].map(([Icon, title, label]) => (
                  <div key={title} className="border-l border-white/15 pl-4"><Icon size={22} className="text-cyan-300" /><div className="mt-3 text-sm font-extrabold text-white">{title}</div><div className="mt-1 text-[11px] leading-4 text-blue-100/60">{label}</div></div>
                ))}
              </div>
            </div>
            <OrbitVisual />
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="OUR TECHNOLOGY VISION" title="From working products to technologies that do not exist yet." text="Astikan’s technology journey is intentionally staged: solve real problems now, widen access next, and investigate frontier healthcare responsibly over time." />
            <div className="relative mt-14 grid gap-4 lg:grid-cols-5">
              <div className="absolute left-[8%] right-[8%] top-[34px] hidden border-t border-dashed border-blue-300 lg:block" />
              {roadmap.map(({ step, status, title, text, Icon }, index) => (
                <article key={title} className="relative z-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-card" data-aos="fade-up" data-aos-delay={index * 70}>
                  <div className="flex items-start justify-between gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700"><Icon size={23} /></span><span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-extrabold tracking-wider text-slate-500">{step}</span></div>
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-blue-600">{status}</p>
                  <h3 className="mt-2 text-lg font-extrabold text-navy-900">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="building-now" className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <SectionHeading eyebrow="BUILDING NOW" title="Two products becoming the foundation." text="The first layer is practical: one application for health, and one application for healthcare payments. Both are being developed as parts of the same Astikan ecosystem." />
            <div className="mt-14 space-y-8">
              <ProductCard
                eyebrow="PRODUCT 01 · IN ACTIVE DEVELOPMENT"
                title="Astikan Health App"
                text="A unified health application designed to make the patient journey less fragmented—from finding care to maintaining records and following a health plan."
                capabilities={appCapabilities}
                visual={<PhoneMockup type="health" />}
              />
              <ProductCard
                eyebrow="PRODUCT 02 · IN DEVELOPMENT"
                title="Astikan Pay"
                text="A healthcare-specific payment application designed around treatment expenses, medical bills, benefits, financing, refunds, and transparent care transactions."
                capabilities={payCapabilities}
                visual={<PhoneMockup type="pay" />}
                reverse
              />
            </div>
          </div>
        </section>

        <section id="health-kiosk" className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
            <div data-aos="fade-right">
              <SectionHeading eyebrow="THE ACCESS LAYER" title="Health Kiosks for care beyond the smartphone." text="The next challenge is physical access. Astikan Health Kiosks are envisioned as secure, assisted care points for communities, workplaces, transport hubs, and underserved regions." center={false} />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[[ScanLine, 'Basic screening', 'Simple connected health measurements and guided checks.'], [Stethoscope, 'Care connection', 'Connect people to doctors, diagnostics, and support.'], [WifiOff, 'Low-connectivity ready', 'Designed for environments where internet access is unreliable.'], [MapPin, 'Community deployment', 'Built for rural access, workplaces, and public locations.']].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><Icon className="text-blue-600" /><h3 className="mt-4 font-extrabold text-navy-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>
                ))}
              </div>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800"><Clock3 size={15} /> Research and prototyping direction</div>
            </div>
            <div className="rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_28%,rgba(125,202,255,.75),transparent_33%),linear-gradient(145deg,#eaf6ff,#d6ebff)] p-8" data-aos="fade-left"><KioskVisual /></div>
          </div>
        </section>

        <section id="future" className="relative overflow-hidden bg-[#041a3d] py-16 text-white sm:py-24">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(53,173,255,.3),transparent_25%),radial-gradient(circle_at_82%_60%,rgba(105,74,255,.25),transparent_28%)]" />
          <div className="relative mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="FUTURE INNOVATIONS" title="Tomorrow, beyond the current product roadmap." text="These are research directions—not released products or medical promises. They represent the kinds of difficult healthcare problems Astikan wants to investigate over the long term." light />
            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {futureCards.map(({ title, label, text, Icon, visual }, index) => (
                <article key={title} className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[.04] shadow-[0_25px_70px_rgba(0,0,0,.22)] backdrop-blur-sm" data-aos="fade-up" data-aos-delay={index * 80}>
                  <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${visual}`}>
                    <div className="absolute inset-[18%] rounded-full border border-cyan-200/20" />
                    <div className="absolute inset-[30%] rounded-full border border-dashed border-blue-200/25" />
                    <Icon className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-cyan-100 transition duration-500 group-hover:scale-110" strokeWidth={1.05} />
                    <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan-100">{label}</div>
                  </div>
                  <div className="p-6"><h3 className="text-xl font-extrabold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-blue-100/65">{text}</p><div className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-cyan-300">Research horizon <ArrowRight size={14} /></div></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
              <SectionHeading eyebrow="HOW WE INNOVATE" title="Imagination, with discipline." text="Healthcare cannot be built on excitement alone. Astikan’s long-term technology work follows a simple ladder from exploration to responsible deployment." center={false} />
              <div className="grid gap-4 sm:grid-cols-2">
                {principles.map(([Icon, title, text], index) => (
                  <article key={title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card" data-aos="fade-up" data-aos-delay={index * 60}>
                    <div className="absolute right-5 top-4 text-4xl font-black text-slate-100">0{index + 1}</div>
                    <Icon className="h-10 w-10 text-blue-600" strokeWidth={1.45} />
                    <h3 className="mt-5 text-lg font-extrabold text-navy-900">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-5 py-10 lg:px-8">
          <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-navy-900 to-[#0b4b91] px-7 py-10 text-white shadow-dashboard md:flex-row md:items-center sm:px-12">
            <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-cyan-200/20" />
            <div className="relative"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">BUILD THE FUTURE WITH ASTIKAN</p><h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">The future of healthcare is being built today. We are just getting started.</h2></div>
            <a href="/#contact" className="relative inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-extrabold text-navy-900 transition hover:-translate-y-0.5">Partner with us <ArrowRight size={16} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
