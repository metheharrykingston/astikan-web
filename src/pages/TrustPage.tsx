import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Ambulance,
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpenCheck,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileCheck2,
  FlaskConical,
  HandHeart,
  Headphones,
  Heart,
  HeartHandshake,
  Hospital,
  LifeBuoy,
  ListChecks,
  MessageCircle,
  PhoneCall,
  Pill,
  RefreshCcw,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  ThumbsUp,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';
import { AstikanMark } from '../components/AstikanLogo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const principles = [
  [Heart, 'Patient first', 'Every decision begins with the patient’s needs, comfort, and well-being.'],
  [MessageCircle, 'Honest guidance', 'Clear choices without confusing language, hidden pressure, or unnecessary promises.'],
  [HandHeart, 'Respect and dignity', 'Every person deserves compassionate treatment and equal respect throughout care.'],
  [BadgeCheck, 'Accountability', 'Astikan and its partners take responsibility for the service experience they deliver.'],
  [UsersRound, 'Fair access', 'Quality healthcare should be easier to reach, understand, and afford.'],
  [Sparkles, 'Care with purpose', 'Technology and operations exist to improve care and make the journey simpler.'],
];

const careJourney = [
  [Search, 'Find care', 'Discover the right care and services for your needs.'],
  [ListChecks, 'Understand options', 'Compare choices and receive clear information.'],
  [CalendarCheck2, 'Book service', 'Schedule care with confidence in a few simple steps.'],
  [BellRing, 'Receive updates', 'Stay informed at every important stage.'],
  [CheckCircle2, 'Complete care', 'Receive the selected service through a trusted partner.'],
  [Headphones, 'Get follow-up support', 'Reach Astikan support when you need guidance next.'],
];

const qualityItems = [
  [BadgeCheck, 'Verified providers', 'We aim to work with reviewed healthcare professionals and organisations.'],
  [BookOpenCheck, 'Clear expectations', 'People should know what is included and what happens next.'],
  [Stethoscope, 'Clinical responsibility', 'Medical decisions remain with qualified healthcare professionals.'],
  [LifeBuoy, 'Escalation support', 'Problems and urgent concerns can be routed to the appropriate support team.'],
  [RefreshCcw, 'Continuous improvement', 'Feedback and outcomes help us improve future care experiences.'],
];

const supportItems = [
  [Compass, 'Care navigation'],
  [CalendarCheck2, 'Appointment assistance'],
  [Hospital, 'Hospital coordination'],
  [FlaskConical, 'Lab-test support'],
  [Pill, 'Medicine support'],
  [Ambulance, 'Emergency coordination'],
  [HeartHandshake, 'Treatment-cost guidance'],
  [LifeBuoy, 'Issue-resolution support'],
];

const transparencyItems = [
  'Clear service descriptions',
  'Clear pricing before confirmation',
  'Honest availability information',
  'No misleading promises',
  'Visible booking and fulfilment status',
  'Clear cancellation and refund communication',
  'Clear distinction between guidance and medical advice',
];

const resolutionSteps = [
  ['01', 'Report the concern', 'Share what happened and what went wrong.'],
  ['02', 'We review the journey', 'Astikan looks at the service experience and impact.'],
  ['03', 'The partner is contacted', 'The relevant care partner is asked to address the issue.'],
  ['04', 'Escalate when needed', 'The concern moves to the appropriate senior support path.'],
  ['05', 'Receive an update', 'You receive a clear resolution path and continued communication.'],
];

const feedbackItems = [
  [MessageCircle, 'Patient feedback'],
  [Star, 'Provider performance review'],
  [Search, 'Service-quality monitoring'],
  [BellRing, 'Repeated-issue identification'],
  [ClipboardCheck, 'Partner improvement plans'],
  [UserRoundCheck, 'Removal of poor performers'],
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

function TrustHeroVisual() {
  const orbitItems = [
    [BadgeCheck, 'Verified network', 'left-[2%] top-[18%]'],
    [MessageCircle, 'Honest guidance', 'right-[2%] top-[18%]'],
    [HeartHandshake, 'Care support', 'left-[1%] bottom-[12%]'],
    [UsersRound, 'Fair access', 'right-[3%] bottom-[12%]'],
  ];

  return (
    <div className="trust-visual relative mx-auto h-[500px] w-full max-w-[650px] sm:h-[610px]">
      <div className="absolute inset-[7%] rounded-full border border-blue-300/20" />
      <div className="absolute inset-[17%] rounded-full border border-dashed border-blue-300/30" />
      <div className="absolute inset-[28%] rounded-full border border-blue-300/30" />
      <div className="absolute inset-[10%] animate-[spin_36s_linear_infinite] rounded-full border-t border-blue-400/50 border-r-transparent" />
      <div className="absolute inset-[22%] animate-[spin_25s_linear_infinite_reverse] rounded-full border-b border-violet-400/45 border-l-transparent" />

      <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.97),rgba(229,237,255,.9)_46%,rgba(201,211,255,.52)_66%,transparent_72%)] blur-[1px]" />
      <div className="absolute left-1/2 top-[58%] h-28 w-[52%] -translate-x-1/2 rounded-[50%] bg-blue-400/15 blur-2xl" />

      <div className="absolute left-1/2 top-1/2 flex h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[42%] border border-white/80 bg-gradient-to-br from-white via-[#eef2ff] to-[#d8ddff] shadow-[0_45px_100px_rgba(55,77,180,.28)] sm:h-[320px] sm:w-[320px]">
        <div className="absolute inset-7 rounded-[38%] border border-blue-200/60 bg-white/60 shadow-inner" />
        <div className="absolute inset-14 rounded-[35%] border border-violet-200/60 bg-gradient-to-br from-[#fdfdff] to-[#e9ebff]" />
        <div className="relative flex h-36 w-36 items-center justify-center rounded-[2.3rem] border border-blue-200 bg-white shadow-[0_25px_55px_rgba(42,77,177,.22)] sm:h-44 sm:w-44">
          <AstikanMark className="h-24 w-24 sm:h-32 sm:w-32" />
        </div>
      </div>

      {orbitItems.map(([Icon, label, position], index) => (
        <div key={label} className={`trust-node absolute ${position} z-20 flex min-w-[130px] items-center gap-3 rounded-2xl border border-blue-100 bg-white/90 p-3 shadow-card backdrop-blur-md`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={20} strokeWidth={1.55} /></span>
          <span className="text-[11px] font-extrabold leading-4 text-navy-900 sm:text-xs">{label}</span>
          <span className="absolute h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" style={{ left: index % 2 === 0 ? 'calc(100% + 12px)' : '-18px' }} />
        </div>
      ))}
    </div>
  );
}

function JourneyArrow() {
  return <ArrowRight className="mx-auto hidden h-5 w-5 shrink-0 text-blue-300 lg:block" />;
}

export default function TrustPage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.trust-hero-copy > *', { y: 28, opacity: 0, duration: 0.72, stagger: 0.08 })
        .from('.trust-visual', { scale: 0.93, opacity: 0, duration: 1 }, '-=.64')
        .from('.trust-node', { scale: 0.72, opacity: 0, duration: 0.48, stagger: 0.09 }, '-=.55');

      gsap.to('.trust-node', {
        y: -8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.22,
        ease: 'sine.inOut',
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-slate-700">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_35%,rgba(217,220,255,.85),transparent_36%),linear-gradient(180deg,#ffffff_0%,#f5f8ff_100%)] pt-[76px]">
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(75,110,190,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(75,110,190,.06)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative mx-auto grid min-h-[720px] max-w-[1380px] items-center gap-10 px-5 py-16 lg:grid-cols-[.86fr_1.14fr] lg:px-8 lg:py-20">
            <div className="trust-hero-copy relative z-10 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">OUR PROMISE</p>
              <h1 className="mt-5 text-[2.75rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-navy-900 sm:text-6xl lg:text-[4.6rem]">
                Trust is earned through every <span className="text-indigo-600">care experience.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Astikan brings care providers, support teams, and services together around one clear promise: dependable guidance, respectful treatment, reliable support, and honest communication throughout the care journey.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/#contact" className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-navy-900/15 transition hover:-translate-y-0.5 hover:bg-navy-800">Start Care Journey <ArrowRight size={16} /></a>
                <a href="#care-standards" className="inline-flex items-center gap-2 rounded-md border border-navy-700 bg-white px-6 py-3.5 text-sm font-extrabold text-navy-900 transition hover:bg-blue-50">Read Our Care Standards <ArrowRight size={16} /></a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[[BadgeCheck, 'Verified care network'], [MessageCircle, 'Clear and honest guidance'], [HeartHandshake, 'Support throughout the journey']].map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-3 border-l border-blue-200 pl-4"><Icon className="h-7 w-7 shrink-0 text-blue-600" strokeWidth={1.5} /><span className="text-xs font-extrabold leading-5 text-navy-900">{label}</span></div>
                ))}
              </div>
            </div>
            <TrustHeroVisual />
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="OUR TRUST PRINCIPLES" title="Built on values. Driven by responsibility." />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {principles.map(([Icon, title, text], index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card" data-aos="fade-up" data-aos-delay={index * 60}>
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icon size={28} strokeWidth={1.45} /></span>
                  <h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="CLEAR CARE JOURNEYS" title="No confusion. No disappearing after the booking." text="Trust grows when people know what is happening, what comes next, and where to get help." />
            <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between">
                {careJourney.map(([Icon, title, text], index) => (
                  <React.Fragment key={title}>
                    <div className="flex flex-1 flex-col items-center text-center" data-aos="fade-up" data-aos-delay={index * 70}>
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700"><Icon size={25} strokeWidth={1.5} /></span>
                      <h3 className="mt-4 text-sm font-extrabold text-navy-900">{title}</h3>
                      <p className="mt-2 max-w-[180px] text-xs leading-5 text-slate-500">{text}</p>
                    </div>
                    {index < careJourney.length - 1 && <JourneyArrow />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="care-standards" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="QUALITY & SAFETY" title="Every care journey should meet a consistent standard." />
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {qualityItems.map(([Icon, title, text], index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card" data-aos="fade-up" data-aos-delay={index * 65}>
                  <Icon className="h-10 w-10 text-blue-600" strokeWidth={1.45} />
                  <h3 className="mt-5 text-base font-extrabold text-navy-900">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1380px] gap-6 px-5 lg:grid-cols-2 lg:px-8">
            <article className="relative overflow-hidden rounded-[2rem] bg-[#061b3f] p-8 text-white shadow-dashboard sm:p-10" data-aos="fade-right">
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-cyan-300/15" />
              <div className="absolute bottom-0 right-0 h-44 w-1/2 opacity-30 [background-image:radial-gradient(circle,#68b8ff_1px,transparent_1px)] [background-size:14px_14px]" />
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">CARE SUPPORT</p>
              <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">Technology connects the journey. Support stays available.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100/70">Astikan is designed to help coordinate the practical parts of care while keeping a clear route to assistance when a service needs attention.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {supportItems.map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.05] p-3"><Icon size={18} className="text-cyan-300" /><span className="text-xs font-bold text-white">{label}</span></div>
                ))}
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card sm:p-10" data-aos="fade-left">
              <div className="absolute right-8 top-8 grid grid-cols-3 gap-2 opacity-50">
                {Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-7 w-7 rotate-45 rounded-md border border-indigo-100 bg-gradient-to-br from-white to-indigo-100" />)}
              </div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">TRANSPARENCY</p>
              <h2 className="relative mt-3 max-w-lg text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">People should always know what is happening.</h2>
              <p className="relative mt-5 max-w-xl text-sm leading-7 text-slate-600">The care journey should be understandable before, during, and after a service, with every step made clear.</p>
              <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
                {transparencyItems.map((item) => <div key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-navy-900"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.3} />{item}</div>)}
              </div>
            </article>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1380px] gap-6 px-5 lg:grid-cols-2 lg:px-8">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-card sm:p-9" data-aos="fade-right">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">WHEN THINGS GO WRONG</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900">Trust is tested most when something does not go as planned.</h2>
              <div className="mt-8 space-y-4">
                {resolutionSteps.map(([number, title, text], index) => (
                  <div key={title} className="relative flex gap-4">
                    {index < resolutionSteps.length - 1 && <span className="absolute left-[19px] top-10 h-[calc(100%+8px)] border-l border-dashed border-blue-200" />}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-extrabold text-blue-700">{number}</span>
                    <div className="pb-3"><h3 className="text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eef5ff] p-7 shadow-card sm:p-9" data-aos="fade-left">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">TRUST THROUGH FEEDBACK</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900">Every experience helps improve the network.</h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">Feedback should lead to action. Astikan uses recurring service signals to improve partners and care journeys.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {feedbackItems.map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={18} /></span><span className="text-xs font-extrabold leading-5 text-navy-900">{label}</span></div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-navy-900 p-5 text-white"><div className="flex items-start gap-4"><ThumbsUp className="mt-1 shrink-0 text-cyan-300" /><div><div className="font-extrabold">Better feedback. Better care. Better outcomes.</div><div className="mt-2 text-xs leading-5 text-blue-100/70">The network improves when experiences are reviewed honestly and acted on consistently.</div></div></div></div>
            </article>
          </div>
        </section>

        <section className="bg-slate-50 px-5 py-10 lg:px-8">
          <div className="relative mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-navy-900 via-[#0a3670] to-[#193fb2] px-8 py-10 text-white shadow-dashboard md:flex-row md:items-center sm:px-12">
            <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-cyan-200/20" />
            <div className="absolute right-[12%] top-1/2 h-40 w-40 -translate-y-1/2 opacity-15"><AstikanMark className="h-full w-full" /></div>
            <div className="relative flex items-center gap-5"><span className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-white/10 sm:flex"><AstikanMark className="h-12 w-12" /></span><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">CARE YOU CAN RELY ON</p><h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Your care deserves clarity, respect, and support.</h2></div></div>
            <div className="relative flex shrink-0 flex-wrap gap-3"><a href="/#contact" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-extrabold text-navy-900 transition hover:-translate-y-0.5">Start Your Care Journey <ArrowRight size={16} /></a><a href="/#contact" className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10">Talk to the Care Team <PhoneCall size={16} /></a></div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
