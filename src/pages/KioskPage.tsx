import React, { Suspense, lazy } from 'react';
import {
  Activity,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardPlus,
  Cloud,
  HeartPulse,
  Hospital,
  LockKeyhole,
  MapPin,
  Network,
  Pill,
  ScanLine,
  School,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  TrainFront,
  UsersRound,
  Video,
  Wifi,
  Workflow,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';

const Kiosk3DViewer = lazy(() => import('../components/Kiosk3DViewer'));
import TechnologyHighlights from '../components/TechnologyHighlights';
import kioskVideo from '../assets/kiosk.mp4';
import kioskOne from '../assets/kiosk_one.png';

const capabilities = [
  {
    icon: HeartPulse,
    title: 'Health check-up',
    text: 'A guided space for capturing everyday vitals, symptoms, and health observations.',
  },
  {
    icon: Video,
    title: 'Consultation',
    text: 'A private booth designed to connect people with verified health professionals.',
  },
  {
    icon: Activity,
    title: 'Diagnostics',
    text: 'Integrated instruments bring multiple health measurements into one clear session.',
  },
  {
    icon: ClipboardPlus,
    title: 'Prescriptions',
    text: 'Consultation notes and digital prescriptions can stay connected to the health journey.',
  },
  {
    icon: Pill,
    title: 'Medicine access',
    text: 'A built-in medicine area designed around safer, guided access to essential products.',
  },
  {
    icon: Network,
    title: 'Connected care',
    text: 'Each kiosk session can become part of the person’s wider Astikan health experience.',
  },
];

const modules = [
  {
    number: '01',
    icon: Sparkles,
    title: 'AI health guide',
    text: 'A clear on-screen guide helps people understand the session and move between each step.',
  },
  {
    number: '02',
    icon: HeartPulse,
    title: 'Health check and diagnostics',
    text: 'Integrated tools are arranged for vitals, physical measurements, and guided screening.',
  },
  {
    number: '03',
    icon: Video,
    title: 'Private consultation booth',
    text: 'The seated booth creates a focused environment for remote consultation and guidance.',
  },
  {
    number: '04',
    icon: ScanLine,
    title: 'Digital health interface',
    text: 'Large displays present instructions, measurements, results, and the next recommended step.',
  },
  {
    number: '05',
    icon: Pill,
    title: 'Medicine cabinet',
    text: 'The visible medicine module keeps supported health products organised and easy to identify.',
  },
  {
    number: '06',
    icon: CheckCircle2,
    title: 'Guided dispensing',
    text: 'A dedicated dispensing area is designed to verify and release the selected product safely.',
  },
];

const locations = [
  {
    icon: Hospital,
    title: 'Hospitals and clinics',
    text: 'Extend routine health access beyond consultation rooms.',
    detail: 'CLINICAL ACCESS',
  },
  {
    icon: Store,
    title: 'Malls and public spaces',
    text: 'Place everyday health access where people already spend time.',
    detail: 'EVERYDAY ACCESS',
  },
  {
    icon: School,
    title: 'Campuses',
    text: 'Make guided health support easier to reach across institutions.',
    detail: 'CAMPUS HEALTH',
  },
  {
    icon: TrainFront,
    title: 'Transport hubs',
    text: 'Support travellers with a visible and connected health point.',
    detail: 'HEALTH ON THE MOVE',
  },
  {
    icon: Building2,
    title: 'Workplaces',
    text: 'Bring preventive and guided health experiences closer to teams.',
    detail: 'WORKPLACE WELLNESS',
  },
  {
    icon: MapPin,
    title: 'Rural communities',
    text: 'Create a physical bridge to connected health where access is limited.',
    detail: 'COMMUNITY ACCESS',
  },
];

const principles = [
  {
    icon: UsersRound,
    title: 'Accessible',
    text: 'A visible physical interface that can bring health technology closer to more people.',
  },
  {
    icon: LockKeyhole,
    title: 'Private',
    text: 'An enclosed consultation environment designed around personal comfort and confidentiality.',
  },
  {
    icon: Cloud,
    title: 'Connected',
    text: 'Session information can move into a wider digital health journey instead of staying isolated.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable',
    text: 'A structured hardware and software environment built for repeated everyday use.',
  },
];

function VideoFrame({ className = '', compact = false }) {
  return (
    <div
      className={`relative overflow-hidden border border-white/70 bg-slate-950 shadow-[0_35px_100px_rgba(13,48,105,.24)] ${compact ? 'rounded-[1.8rem]' : 'rounded-[2.4rem]'} ${className}`}
      data-animate-widget="true"
    >
      <video
        className="h-full w-full object-cover"
        src={kioskVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Astikan Health Kiosk product video"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031735]/30 via-transparent to-white/5" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/30 bg-[#031735]/75 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-xl sm:bottom-5 sm:left-5">
        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.9)]" />
        Product visual
      </div>
    </div>
  );
}

function CapabilityCard({ icon: Icon, title, text, index }) {
  return (
    <article
      className="group rounded-[1.65rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(17,54,105,.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_55px_rgba(17,75,170,.12)]"
      data-aos="fade-up"
      data-aos-delay={index * 55}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
        <Icon size={23} strokeWidth={1.6} />
      </span>
      <h3 className="mt-6 text-lg font-extrabold tracking-tight text-navy-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
    </article>
  );
}

export default function KioskPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-navy-900">
      <SiteHeader />

      <main>
        <section className="relative isolate min-h-[760px] overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_50%,#edf5ff_100%)] px-5 pb-20 pt-[126px] lg:px-8 lg:pb-28 lg:pt-[150px]">
          <div className="absolute -left-48 top-14 h-[520px] w-[520px] rounded-full border border-blue-100" />
          <div className="absolute -left-24 top-40 h-[300px] w-[300px] rounded-full border border-dashed border-blue-200" />
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-50 [background-image:radial-gradient(circle,#c9dcff_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white to-transparent" />

          <div className="relative mx-auto grid max-w-[1380px] items-center gap-14 lg:grid-cols-[.8fr_1.35fr] xl:gap-20">
            <div className="max-w-2xl" data-aos="fade-right">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-blue-600">PHYSICAL HEALTH INTERFACE</p>
              <h1 className="mt-6 text-6xl font-extrabold tracking-[-0.06em] text-navy-900 sm:text-7xl lg:text-[6.5rem] lg:leading-[.9]">
                The Kiosk
              </h1>
              <h2 className="mt-7 max-w-xl text-2xl font-extrabold leading-tight tracking-[-0.03em] text-blue-700 sm:text-3xl">
                Advanced health access, right where people are.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                A connected, self-guided health station designed to bring check-ups, diagnostics, consultation, prescriptions, and medicine access into one physical Astikan experience.
              </p>

              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [ShieldCheck, 'Private'],
                  [LockKeyhole, 'Secure'],
                  [Sparkles, 'Guided'],
                  [Wifi, 'Connected'],
                ].map(([Icon, label], index) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white bg-white/75 p-4 shadow-sm backdrop-blur-xl"
                    data-aos="fade-up"
                    data-aos-delay={100 + index * 55}
                  >
                    <Icon size={19} className="text-blue-600" strokeWidth={1.7} />
                    <div className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-navy-900">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative" data-aos="fade-left" data-aos-delay="120">
              <div className="absolute -inset-8 rounded-[4rem] bg-blue-400/10 blur-3xl" />
              <VideoFrame className="relative aspect-video w-full lg:aspect-[16/10]" />
              <div className="absolute -bottom-5 right-5 hidden rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-xl sm:flex sm:items-center sm:gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><BadgeCheck size={21} /></span>
                <div><div className="text-xs font-extrabold text-navy-900">One connected station</div><div className="mt-1 text-[10px] text-slate-500">Digital guidance + physical access</div></div>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<section className="min-h-[520px] bg-[#020d22]" aria-label="Loading interactive kiosk viewer" />}>
          <Kiosk3DViewer />
        </Suspense>

        <section className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1380px]">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">ONE STATION, MANY HEALTH MOMENTS</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-navy-900 sm:text-5xl">Comprehensive health access in one kiosk.</h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600">The kiosk brings digital health experiences and physical health tools together without making the person navigate separate systems.</p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {capabilities.map((item, index) => <CapabilityCard key={item.title} {...item} index={index} />)}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f8ff] px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[2.6rem] border border-blue-100 bg-white shadow-[0_35px_100px_rgba(20,62,125,.09)]">
            <div className="grid lg:grid-cols-[.8fr_1.2fr]">
              <div className="p-7 sm:p-10 lg:p-14">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600" data-aos="fade-up">INSIDE THE KIOSK</p>
                <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-navy-900 sm:text-5xl" data-aos="fade-up" data-aos-delay="60">A complete health session, organised module by module.</h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600" data-aos="fade-up" data-aos-delay="100">The real kiosk combines a consultation chair, digital displays, diagnostic instruments, guided controls, and medicine storage inside one structured booth.</p>

                <div className="mt-10 grid gap-4">
                  {modules.map(({ number, icon: Icon, title, text }, index) => (
                    <article key={number} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4" data-aos="fade-up" data-aos-delay={index * 45}>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white"><Icon size={19} strokeWidth={1.6} /></span>
                      <div>
                        <div className="flex items-center gap-3"><span className="text-[9px] font-black tracking-[0.16em] text-blue-500">{number}</span><h3 className="text-sm font-extrabold text-navy-900">{title}</h3></div>
                        <p className="mt-2 text-xs leading-6 text-slate-500">{text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[520px] bg-[linear-gradient(145deg,#eaf3ff,#f9fcff)] p-5 sm:p-8 lg:p-10">
                <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle,#b8d0f6_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative h-full min-h-[480px] w-full overflow-hidden rounded-[1.8rem] border border-white/70 bg-slate-950 shadow-[0_35px_100px_rgba(13,48,105,.24)]" data-animate-widget="true">
                  <img src={kioskOne} alt="Inside the Astikan Health Kiosk" className="h-full min-h-[480px] w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031735]/25 via-transparent to-white/5" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/30 bg-[#031735]/75 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-xl sm:bottom-5 sm:left-5">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.9)]" />
                    Inside the kiosk
                  </div>
                </div>
              </div>
            </div>

            <div className="grid border-t border-slate-100 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Sparkles, 'Guided experience'],
                [ShieldCheck, 'Privacy-minded design'],
                [Workflow, 'Connected health flow'],
                [Cloud, 'Digital continuity'],
              ].map(([Icon, label], index) => (
                <div key={label} className="flex items-center gap-3 border-slate-100 p-5 sm:border-r" data-aos="fade-up" data-aos-delay={index * 55}>
                  <Icon size={20} className="text-blue-600" strokeWidth={1.6} />
                  <span className="text-xs font-extrabold text-navy-900">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TechnologyHighlights variant="kiosk" />

        <section className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1380px]">
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_.72fr]">
              <div data-aos="fade-up">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">BUILT FOR EVERY COMMUNITY</p>
                <h2 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-[-0.04em] text-navy-900 sm:text-5xl lg:text-6xl">Health technology can meet people where life already happens.</h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-slate-600 lg:justify-self-end" data-aos="fade-up" data-aos-delay="80">The kiosk is designed as a physical access point that can adapt to different environments while staying connected to the same Astikan health world.</p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map(({ icon: Icon, title, text, detail }, index) => (
                <article key={title} className="group relative min-h-[300px] overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,#f8fbff,#eef5ff)] p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft" data-aos="fade-up" data-aos-delay={index * 55}>
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-blue-200/70 transition duration-500 group-hover:scale-110" />
                  <div className="absolute -right-4 top-10 h-20 w-20 rounded-full border border-dashed border-blue-300/70" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm"><Icon size={27} strokeWidth={1.5} /></span>
                  <p className="relative mt-10 text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-600">{detail}</p>
                  <h3 className="relative mt-3 text-2xl font-extrabold tracking-tight text-navy-900">{title}</h3>
                  <p className="relative mt-4 max-w-sm text-sm leading-7 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#031735] px-5 py-20 text-white lg:px-8 lg:py-28">
          <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[2.7rem] border border-white/10 bg-[linear-gradient(135deg,#06234d_0%,#031735_58%,#0a3b70_100%)] p-7 sm:p-12 lg:p-16">
            <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-cyan-200/10" />
            <div className="absolute -right-20 top-2 h-[300px] w-[300px] rounded-full border border-dashed border-blue-200/15" />

            <div className="relative mx-auto max-w-3xl text-center" data-aos="fade-up">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-300">WHY THE KIOSK MATTERS</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">Technology becomes useful when it is reachable.</h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100/70">The kiosk brings Astikan into the physical world, placing guidance, tools, consultation, and continued care in one welcoming space.</p>
            </div>

            <div className="relative mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {principles.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="rounded-[1.8rem] border border-white/10 bg-white/[.06] p-6 backdrop-blur-xl" data-aos="fade-up" data-aos-delay={index * 65}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300"><Icon size={23} strokeWidth={1.55} /></span>
                  <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-blue-100/60">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 overflow-hidden rounded-[2.7rem] border border-blue-100 bg-[linear-gradient(135deg,#f8fbff,#eaf3ff)] p-7 sm:p-12 lg:grid-cols-[.78fr_1.22fr] lg:p-16">
            <div data-aos="fade-right">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">A PHYSICAL PART OF ASTIKAN</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-navy-900 sm:text-5xl">One booth. One guided session. One connected health journey.</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">The Kiosk is designed to connect physical health access with the wider Astikan interface, so each interaction can feel like part of one continuous experience.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Check-up', 'Consultation', 'Diagnostics', 'Prescription', 'Medicine', 'Continuity'].map((label) => <span key={label} className="rounded-full border border-blue-200 bg-white px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-700">{label}</span>)}
              </div>
            </div>
            <VideoFrame compact className="aspect-video w-full" />
          </div>
        </section>
      </main>
    </div>
  );
}
