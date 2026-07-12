import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Activity,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileHeart,
  FlaskConical,
  FolderHeart,
  Globe2,
  HeartPulse,
  LayoutGrid,
  Leaf,
  ListChecks,
  MessageSquareText,
  NotebookPen,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import { AstikanMark } from '../components/AstikanLogo';

const healthMoments = [
  [FolderHeart, 'Health records', 'Keep important health information organised and easy to revisit.', 'bg-blue-50 text-blue-600'],
  [FlaskConical, 'Lab reports', 'View reports, result history, and useful trends in one calm experience.', 'bg-emerald-50 text-emerald-600'],
  [Pill, 'Medications', 'See medicine schedules, reminders, and refill information clearly.', 'bg-violet-50 text-violet-600'],
  [CalendarDays, 'Appointments', 'Follow upcoming visits, details, and previous appointment history.', 'bg-sky-50 text-sky-600'],
  [HeartPulse, 'Vitals', 'Understand everyday measurements and how they change over time.', 'bg-rose-50 text-rose-500'],
  [UsersRound, 'Family profiles', 'Move between family members and their individual health journeys.', 'bg-cyan-50 text-cyan-600'],
  [Clock3, 'Health timeline', 'See a chronological view of meaningful health moments.', 'bg-orange-50 text-orange-500'],
  [ClipboardList, 'Daily check-ins', 'Capture symptoms, mood, routines, and everyday wellness updates.', 'bg-indigo-50 text-indigo-600'],
];

const experiencePoints = [
  [LayoutGrid, 'Simple status cards', 'Important information at a glance.'],
  [Activity, 'Readable trends', 'Clear patterns without visual noise.'],
  [Clock3, 'Calm timelines', 'A health journey that is easy to follow.'],
  [ListChecks, 'Organised modules', 'Everything has a clear place.'],
  [Sparkles, 'Quick understanding', 'Designed for normal everyday use.'],
];

const clarityItems = [
  [LayoutGrid, 'Clear layout', 'Information is easy to scan and understand.'],
  [Globe2, 'Connected experience', 'Health moments come together in one worldwide interface.'],
  [Leaf, 'Calm visual language', 'Soft colours and clean spacing reduce cognitive load.'],
  [CalendarDays, 'Everyday use', 'Built for daily interactions and long-term use.'],
  [Sparkles, 'Product simplicity', 'Powerful capabilities without a complicated experience.'],
];

const orbitLeft = [
  [FolderHeart, 'Records', 'Health history and documents'],
  [FlaskConical, 'Reports', 'Lab results and insights'],
  [Pill, 'Medications', 'Schedules and reminders'],
  [HeartPulse, 'Monitoring', 'Vitals and everyday trends'],
];

const orbitRight = [
  [CalendarDays, 'Appointments', 'Visits and follow-ups'],
  [UsersRound, 'Family', 'Connected family profiles'],
  [NotebookPen, 'Plans', 'Health goals and routines'],
  [MessageSquareText, 'Notes', 'Personal context and updates'],
];

function AppCard({ icon: Icon, label, value, detail, accent = 'text-blue-600', children }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 ${accent}`}><Icon size={18} strokeWidth={1.7} /></span>
        {children}
      </div>
      <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-navy-900">{value}</div>
      <div className="mt-1 text-[10px] leading-4 text-slate-500">{detail}</div>
    </div>
  );
}

function MiniTrend({ tone = 'blue' }) {
  const stroke = tone === 'rose' ? '#ec4899' : tone === 'emerald' ? '#10b981' : '#3b82f6';
  return (
    <svg viewBox="0 0 150 42" className="h-10 w-full" aria-hidden="true">
      <path d="M2 29 C18 29, 23 14, 39 18 S62 35, 78 25 S98 9, 116 17 S137 27, 148 10" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M2 36H148" stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

function HealthPhone({ variant = 'home', className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-[2.4rem] border-[8px] border-[#081a3d] bg-white shadow-[0_28px_70px_rgba(20,50,105,.25)] ${className}`}>
      <div className="absolute left-1/2 top-1 h-5 w-20 -translate-x-1/2 rounded-full bg-[#081a3d]" />
      <div className="min-h-[470px] bg-[#f7f9fd] px-4 pb-5 pt-10">
        <div className="flex items-center justify-between">
          <div><div className="text-[9px] font-bold text-slate-400">ASTIKAN</div><div className="mt-1 text-sm font-extrabold text-navy-900">{variant === 'reports' ? 'Reports' : variant === 'timeline' ? 'Health timeline' : 'Good morning'}</div></div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy-900 shadow-sm"><BellRing size={13} /></span>
        </div>

        {variant === 'home' && (
          <>
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#102f6b] to-[#1e56aa] p-4 text-white shadow-lg shadow-blue-900/15">
              <div className="text-[9px] text-blue-100">Health overview</div>
              <div className="mt-2 flex items-end justify-between"><div><div className="text-4xl font-extrabold">85</div><div className="mt-1 flex items-center gap-1 text-[9px] text-emerald-200"><CheckCircle2 size={11} /> Looking good</div></div><Activity size={48} className="text-cyan-200" strokeWidth={1.1} /></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <AppCard icon={HeartPulse} label="Heart rate" value="72" detail="bpm" accent="text-rose-500" />
              <AppCard icon={Activity} label="Daily movement" value="6,245" detail="steps today" accent="text-emerald-600" />
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><span className="text-xs font-extrabold text-navy-900">Today’s plan</span><span className="text-[9px] text-blue-600">View all</span></div>
              <div className="mt-4 space-y-3">
                {[['Walk', '6,245 / 8,000', '78%'], ['Water', '5 / 8 glasses', '62%']].map(([name, text, width]) => <div key={name}><div className="flex justify-between text-[9px] text-slate-500"><span>{name}</span><span>{text}</span></div><div className="mt-1.5 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width }} /></div></div>)}
              </div>
            </div>
          </>
        )}

        {variant === 'reports' && (
          <div className="mt-5 space-y-3">
            {[
              ['Complete blood count', 'Normal', 'Apr 20, 2026'],
              ['Lipid profile', 'Normal', 'Apr 18, 2026'],
              ['Vitamin D', 'Review', 'Apr 12, 2026'],
              ['Thyroid profile', 'Normal', 'Apr 05, 2026'],
            ].map(([title, status, date]) => (
              <div key={title} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3"><div><div className="text-[11px] font-extrabold text-navy-900">{title}</div><div className="mt-1 text-[9px] text-slate-400">{date}</div></div><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${status === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{status}</span></div>
              </div>
            ))}
          </div>
        )}

        {variant === 'timeline' && (
          <div className="mt-5 space-y-2">
            {[
              [CalendarDays, 'Appointment completed', 'General consultation · Today'],
              [FlaskConical, 'New report available', 'Complete blood count · Yesterday'],
              [Pill, 'Medication reminder', 'Vitamin D · 8:00 PM'],
              [HeartPulse, 'Weekly health summary', 'Vitals and activity · Monday'],
            ].map(([Icon, title, text], index) => (
              <div key={title} className="relative flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                {index < 3 && <span className="absolute left-[31px] top-[52px] h-5 border-l border-dashed border-blue-200" />}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={17} /></span>
                <div><div className="text-[10px] font-extrabold text-navy-900">{title}</div><div className="mt-1 text-[9px] leading-4 text-slate-400">{text}</div></div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-around rounded-2xl border border-slate-200/70 bg-white px-2 py-3 shadow-lg">
          {[LayoutGrid, FolderHeart, Activity, UsersRound].map((Icon, index) => <Icon key={index} size={15} className={index === 0 ? 'text-blue-600' : 'text-slate-300'} />)}
        </div>
      </div>
    </div>
  );
}

function GlobalProductVisual() {
  return (
    <div className="astikan-device-stage relative mx-auto h-[600px] w-full max-w-[720px] lg:h-[650px]">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(191,219,254,.72)_0%,rgba(224,231,255,.5)_38%,transparent_68%)]" />
      <div className="absolute inset-[5%] rounded-full border border-blue-200/35" />
      <div className="absolute inset-[16%] rounded-full border border-dashed border-blue-300/35" />
      <div className="absolute left-[12%] top-[10%] h-3 w-3 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,.8)]" />
      <div className="absolute right-[7%] top-[34%] h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
      <div className="absolute bottom-[14%] left-[20%] h-2 w-2 animate-pulse rounded-full bg-violet-500" />
      <Globe2 className="absolute right-[5%] top-[5%] h-[72%] w-[72%] text-blue-300/20" strokeWidth={0.55} />

      <div className="absolute left-[2%] top-[15%] hidden h-[380px] w-[300px] overflow-hidden rounded-[2.2rem] border-[9px] border-[#081a3d] bg-[#f7f9fd] shadow-[0_35px_80px_rgba(20,50,105,.22)] sm:block">
        <div className="flex items-center justify-between bg-white px-5 py-4"><div className="flex items-center gap-2"><AstikanMark className="h-7 w-7" /><span className="text-xs font-extrabold tracking-[.12em] text-navy-900">ASTIKAN</span></div><BellRing size={14} className="text-slate-400" /></div>
        <div className="p-5">
          <div className="text-sm font-extrabold text-navy-900">Your health today</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <AppCard icon={Activity} label="Health score" value="85" detail="Looking good" accent="text-emerald-600" />
            <AppCard icon={HeartPulse} label="Vitals" value="Normal" detail="Latest readings" accent="text-rose-500" />
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between text-[10px] font-bold text-navy-900"><span>Last 7 days</span><span className="text-slate-400">Overview</span></div><div className="mt-2"><MiniTrend /></div><MiniTrend tone="emerald" /><MiniTrend tone="rose" /></div>
        </div>
      </div>

      <HealthPhone variant="home" className="absolute bottom-[2%] right-[18%] z-20 w-[245px] rotate-[-2deg] sm:w-[260px]" />
      <HealthPhone variant="reports" className="absolute bottom-[8%] right-[0%] z-10 hidden w-[220px] rotate-[3deg] md:block" />
    </div>
  );
}

function PersonalHealthCanvas() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f7f9fd] shadow-[0_24px_70px_rgba(30,64,120,.12)]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3"><AstikanMark className="h-8 w-8" /><div><div className="text-xs font-extrabold tracking-[.12em] text-navy-900">ASTIKAN</div><div className="text-[9px] text-slate-400">Unified Health Interface</div></div></div>
        <div className="flex items-center gap-2"><span className="h-8 w-8 rounded-full bg-blue-50" /><span className="h-8 w-8 rounded-full bg-violet-50" /></div>
      </div>
      <div className="p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="text-xs text-slate-400">Good morning, Alex</div><div className="mt-1 text-xl font-extrabold text-navy-900">Here is your health overview.</div></div><span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500">Today</span></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AppCard icon={Activity} label="Health score" value="85" detail="Looking good" accent="text-emerald-600" />
          <AppCard icon={HeartPulse} label="Vitals" value="Normal" detail="All current readings" accent="text-rose-500" />
          <AppCard icon={Pill} label="Medications" value="2" detail="Scheduled today" accent="text-violet-600" />
          <AppCard icon={CalendarDays} label="Appointments" value="1" detail="Upcoming visit" accent="text-blue-600" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex justify-between"><span className="text-sm font-extrabold text-navy-900">Your recent trends</span><span className="text-[10px] text-blue-600">7 days</span></div><div className="mt-5 space-y-2"><MiniTrend /><MiniTrend tone="emerald" /><MiniTrend tone="rose" /></div><div className="mt-3 flex gap-5 text-[9px] text-slate-400"><span>● Heart rate</span><span>● Activity</span><span>● Sleep</span></div></div>
          <div className="space-y-3">
            {[[FlaskConical, 'Lab report ready', 'Lipid profile · Normal'], [Pill, 'Medication reminder', 'Vitamin D · 8:00 PM'], [UsersRound, 'Family profile', '3 profiles connected']].map(([Icon, title, text]) => <div key={title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={18} /></span><div><div className="text-[11px] font-extrabold text-navy-900">{title}</div><div className="mt-1 text-[9px] text-slate-400">{text}</div></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrbitItem({ item, side }) {
  const [Icon, title, text] = item;
  return (
    <div className={`relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card ${side === 'left' ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={20} strokeWidth={1.5} /></span>
      <div><div className="text-xs font-extrabold text-navy-900">{title}</div><div className="mt-1 text-[10px] leading-4 text-slate-400">{text}</div></div>
      <span className={`absolute top-1/2 hidden w-20 border-t border-dashed border-blue-200 lg:block ${side === 'left' ? '-right-20' : '-left-20'}`} />
    </div>
  );
}

export default function AstikanPage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.astikan-hero-copy > *', { y: 26, opacity: 0, duration: 0.72, stagger: 0.08 })
        .from('.astikan-device-stage', { x: 40, opacity: 0, scale: 0.96, duration: 1 }, '-=.65');

      gsap.to('.astikan-device-stage', { y: -8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_24%,rgba(199,220,255,.72),transparent_36%),linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] pt-[76px]">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(75,110,190,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(75,110,190,.055)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="relative mx-auto grid min-h-[760px] max-w-[1380px] items-center gap-8 px-5 py-14 lg:grid-cols-[.78fr_1.22fr] lg:px-8 lg:py-16">
            <div className="astikan-hero-copy relative z-10 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">UNIFIED HEALTH INTERFACE</p>
              <h1 className="mt-5 text-[3.4rem] font-extrabold leading-[.98] tracking-[-0.045em] text-navy-900 sm:text-7xl lg:text-[5.4rem]">Astikan</h1>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-navy-700 sm:text-3xl">One connected health interface for everyday life.</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Astikan brings health records, reports, medications, appointments, vitals, family profiles, timelines, reminders, and everyday health moments into one application designed to connect people across the world.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[[Globe2, 'Worldwide health interface'], [LayoutGrid, 'One connected application'], [HeartPulse, 'Built for everyday health']].map(([Icon, label]) => <div key={label} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-4 py-2.5 text-xs font-extrabold text-navy-900 shadow-sm"><Icon size={15} className="text-blue-600" />{label}</div>)}
              </div>
            </div>
            <GlobalProductVisual />
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">THE ASTIKAN EXPERIENCE</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">One application, many health moments.</h2><p className="mt-5 text-base leading-8 text-slate-600">Every part of everyday health should feel connected, understandable, and easy to return to.</p></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {healthMoments.map(([Icon, title, text, accent], index) => <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft" data-aos="fade-up" data-aos-delay={index * 45}><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}><Icon size={24} strokeWidth={1.5} /></span><h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 px-5 lg:grid-cols-[.42fr_1.58fr] lg:px-8">
            <div data-aos="fade-right"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">A CALM HEALTH EXPERIENCE</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">Everything important, without the noise.</h2><p className="mt-5 text-base leading-8 text-slate-600">Astikan turns different health moments into a clear personal interface rather than an operational dashboard.</p><div className="mt-8 space-y-5">{experiencePoints.map(([Icon, title, text]) => <div key={title} className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><Icon size={20} /></span><div><h3 className="text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div>)}</div></div>
            <div data-aos="fade-left"><PersonalHealthCanvas /></div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/70 blur-3xl" />
          <div className="relative mx-auto max-w-[1180px] px-5 lg:px-8">
            <div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">BUILT AROUND ASTIKAN</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">One interface connecting the health journey.</h2></div>
            <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_240px_1fr]">
              <div className="space-y-4">{orbitLeft.map((item) => <OrbitItem key={item[1]} item={item} side="left" />)}</div>
              <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-blue-200 bg-white shadow-[0_30px_80px_rgba(44,86,170,.18)]"><div className="absolute inset-4 rounded-full border border-dashed border-blue-200" /><div className="absolute inset-9 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50" /><div className="relative text-center"><AstikanMark className="mx-auto h-20 w-20" /><div className="mt-2 text-lg font-extrabold text-navy-900">Astikan</div><div className="text-[10px] font-bold uppercase tracking-[.12em] text-blue-600">Unified Health Interface</div></div></div>
              <div className="space-y-4">{orbitRight.map((item) => <OrbitItem key={item[1]} item={item} side="right" />)}</div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">DESIGNED FOR CLARITY</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">A health interface people can understand.</h2></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{clarityItems.map(([Icon, title, text], index) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card" data-aos="fade-up" data-aos-delay={index * 65}><Icon className="h-9 w-9 text-blue-600" strokeWidth={1.45} /><h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{text}</p></article>)}</div>
          </div>
        </section>

        <section className="bg-white px-5 py-10 lg:px-8">
          <div className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-7 overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-r from-[#f1f7ff] via-white to-[#f3efff] px-8 py-9 md:flex-row md:items-center sm:px-12">
            <div className="flex items-center gap-5"><AstikanMark className="h-16 w-16" /><div><div className="text-2xl font-extrabold tracking-[.12em] text-navy-900">ASTIKAN</div><div className="mt-1 text-xs font-bold uppercase tracking-[.15em] text-blue-600">Unified Health Interface</div></div></div>
            <div className="max-w-xl text-sm leading-7 text-slate-600">Astikan connects modern health experiences in one calm application built for people everywhere.</div>
            <div className="flex gap-3 text-blue-600">{[Activity, Globe2, ShieldCheck, UsersRound].map((Icon, index) => <span key={index} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"><Icon size={19} /></span>)}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
