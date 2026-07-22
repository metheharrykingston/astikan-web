import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Ambulance,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Beaker,
  Building2,
  CalendarCheck2,
  Check,
  CircleDollarSign,
  CloudCog,
  Code2,
  CreditCard,
  FileCheck2,
  FileHeart,
  FileOutput,
  FlaskConical,
  HandHeart,
  Handshake,
  Headphones,
  HeartHandshake,
  Hospital,
  Landmark,
  LifeBuoy,
  LockKeyhole,
  Microscope,
  Network,
  PanelsTopLeft,
  Pill,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Store,
  TestTube2,
  UsersRound,
  WalletCards,
  Workflow,
} from 'lucide-react';
import { AstikanMark } from '../components/AstikanLogo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const partnerPaths = [
  {
    Icon: Hospital,
    title: 'Hospitals & Clinics',
    text: 'Expand patient access, coordinate bookings, admissions, procedures, discharge journeys, and referrals.',
    accent: 'text-blue-600 bg-blue-50',
  },
  {
    Icon: Stethoscope,
    title: 'Doctors & Specialists',
    text: 'Manage consultations, availability, follow-ups, patient communication, and digital care relationships.',
    accent: 'text-indigo-600 bg-indigo-50',
  },
  {
    Icon: FlaskConical,
    title: 'Diagnostics & Labs',
    text: 'Receive test orders, coordinate collections, share reports, update status, and streamline fulfilment.',
    accent: 'text-violet-600 bg-violet-50',
  },
  {
    Icon: Pill,
    title: 'Pharmacy & Medicine',
    text: 'Fulfil prescriptions, manage recurring medicines, coordinate delivery, and support safer medication journeys.',
    accent: 'text-emerald-600 bg-emerald-50',
  },
  {
    Icon: ShieldCheck,
    title: 'Insurance & Finance',
    text: 'Support coverage discovery, claims assistance, medical financing, benefits, and affordability programmes.',
    accent: 'text-sky-600 bg-sky-50',
  },
  {
    Icon: Ambulance,
    title: 'Ambulance & Emergency',
    text: 'Coordinate emergency requests, availability, hospital routing, escalation, and response workflows.',
    accent: 'text-rose-600 bg-rose-50',
  },
  {
    Icon: UsersRound,
    title: 'Employers & Communities',
    text: 'Launch workplace health, public programmes, screenings, rural access, and community care initiatives.',
    accent: 'text-amber-600 bg-amber-50',
  },
  {
    Icon: Microscope,
    title: 'Technology & Research',
    text: 'Collaborate on devices, health kiosks, clinical research, infrastructure, and future-care technologies.',
    accent: 'text-cyan-600 bg-cyan-50',
  },
];

const partnerValue = [
  [UsersRound, 'Access to patients & care demand'],
  [CalendarCheck2, 'Digital booking & fulfilment workflows'],
  [PanelsTopLeft, 'Partner operations dashboard'],
  [WalletCards, 'Payments, settlements & reconciliation'],
  [HeartHandshake, 'Care-journey coordination'],
  [FileOutput, 'Reports & digital record exchange'],
  [BadgeCheck, 'Network visibility & verification'],
  [Headphones, 'Operational support & integrations'],
];

const integrationOptions = [
  [PanelsTopLeft, 'Partner Portal', 'A ready-to-use dashboard for bookings, orders, reports, staff, and settlements.'],
  [Headphones, 'Assisted Operations', 'Astikan teams can support workflows where partners do not yet have digital systems.'],
  [Code2, 'API Integration', 'Connect booking, status, report, inventory, and operational systems securely.'],
  [FileOutput, 'Report Exchange', 'Exchange reports and service files through secure, structured workflows.'],
  [RefreshCcw, 'Payments & Reconciliation', 'Coordinate collections, settlements, refunds, and reconciliation.'],
  [CloudCog, 'Custom Enterprise Integration', 'Design deeper integrations for large institutions and complex programmes.'],
];

const standards = [
  'Licence and credential verification',
  'Facility and professional validation',
  'Transparent service and pricing standards',
  'Data privacy and secure information exchange',
  'Clinical escalation and safety protocols',
  'Continuous quality and complaint monitoring',
  'Review, governance, and suspension mechanisms',
  'Clear operational accountability',
];

const innovations = [
  [Store, 'Health Kiosks'],
  [Workflow, 'Robotic Care'],
  [Microscope, 'Nanotechnology'],
  [Pill, 'Smart Therapeutics'],
  [TestTube2, 'Advanced Devices'],
  [HandHeart, 'Future Care'],
];

const heroNodes = [
  { Icon: Hospital, label: 'Hospitals', className: 'left-[43%] top-[0%]' },
  { Icon: FlaskConical, label: 'Labs', className: 'left-[10%] top-[10%]' },
  { Icon: Stethoscope, label: 'Doctors', className: 'right-[5%] top-[11%]' },
  { Icon: Ambulance, label: 'Emergency', className: 'left-[0%] top-[42%]' },
  { Icon: Pill, label: 'Pharmacy', className: 'right-[0%] top-[43%]' },
  { Icon: UsersRound, label: 'Employers', className: 'left-[8%] bottom-[4%]' },
  { Icon: ShieldCheck, label: 'Insurance', className: 'right-[7%] bottom-[6%]' },
  { Icon: Microscope, label: 'Research', className: 'left-[42%] bottom-[-2%]' },
];

function SectionHeading({ eyebrow, title, text, center = true }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-slate-600">{text}</p>}
    </div>
  );
}

function PartnerNetworkVisual() {
  return (
    <div className="partner-orbit relative mx-auto h-[500px] w-full max-w-[620px] sm:h-[580px]">
      <div className="absolute inset-[13%] rounded-full bg-[radial-gradient(circle_at_45%_38%,rgba(142,209,255,.95),rgba(43,114,214,.38)_35%,rgba(255,255,255,.15)_62%,transparent_72%)] blur-[1px]" />
      <div className="absolute inset-[12%] rounded-full border border-blue-300/35" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-blue-300/45" />
      <div className="absolute inset-[31%] rounded-full border border-blue-300/35" />
      <div className="absolute inset-[15%] animate-[spin_32s_linear_infinite] rounded-full border-t border-blue-500/50 border-r-transparent" />
      <div className="absolute inset-[25%] animate-[spin_24s_linear_infinite_reverse] rounded-full border-b border-cyan-500/45 border-l-transparent" />

      <div className="absolute left-1/2 top-1/2 z-10 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/80 shadow-[0_30px_80px_rgba(25,92,172,.28)] backdrop-blur-xl sm:h-56 sm:w-56">
        <div className="absolute inset-5 rounded-full bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <Handshake className="relative h-24 w-24 text-navy-800 sm:h-28 sm:w-28" strokeWidth={1.15} />
        <div className="absolute -bottom-6 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-3xl border-[7px] border-white bg-navy-900 shadow-soft">
          <AstikanMark className="h-12 w-12" />
        </div>
      </div>

      {heroNodes.map(({ Icon, label, className }, index) => (
        <div key={label} className={`partner-node absolute ${className} z-20 flex min-w-[96px] flex-col items-center rounded-2xl border border-blue-100 bg-white/92 px-3 py-3 text-center shadow-card backdrop-blur-sm sm:min-w-[112px]`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={20} strokeWidth={1.55} /></span>
          <span className="mt-2 text-[10px] font-extrabold text-navy-900 sm:text-xs">{label}</span>
          <span className="absolute left-1/2 top-full h-5 border-l border-dashed border-blue-300" />
          <span className="absolute -bottom-7 left-[calc(50%-3px)] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: `${index * 120}ms` }} />
        </div>
      ))}
    </div>
  );
}

function PortalMockup() {
  const orders = [
    ['Ananya Sharma', 'Consultation', 'Confirmed', '2h ago'],
    ['Rohit Verma', 'Lab test', 'Sample collected', '4h ago'],
    ['Priya Nair', 'Medicine delivery', 'Out for delivery', '5h ago'],
    ['Amit Patel', 'Consultation', 'Pending', '6h ago'],
  ];

  return (
    <div className="relative mx-auto w-full max-w-[820px]">
      <div className="overflow-hidden rounded-[1.6rem] border-[7px] border-[#071d43] bg-white shadow-dashboard">
        <div className="grid min-h-[470px] grid-cols-[116px_1fr] sm:grid-cols-[160px_1fr]">
          <aside className="bg-[#082b60] p-4 text-white sm:p-5">
            <div className="flex items-center gap-2"><AstikanMark className="h-8 w-8" /><span className="hidden text-[10px] font-extrabold sm:block">PARTNER PORTAL</span></div>
            <div className="mt-8 space-y-2">
              {[[BarChart3, 'Overview'], [CalendarCheck2, 'Bookings'], [UsersRound, 'Patients'], [FileHeart, 'Services'], [FileOutput, 'Reports'], [CreditCard, 'Payments'], [LifeBuoy, 'Support']].map(([Icon, label], index) => (
                <div key={label} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[9px] font-bold sm:text-[10px] ${index === 0 ? 'bg-white/14 text-white' : 'text-blue-100/70'}`}><Icon size={14} /> <span className="hidden sm:inline">{label}</span></div>
              ))}
            </div>
          </aside>

          <div className="bg-[#f7faff] p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[9px] text-slate-400">Welcome, CareLife Hospital</p><div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700"><BadgeCheck size={10} /> Verified Partner</div></div>
              <div className="flex gap-2"><span className="h-7 w-7 rounded-full bg-blue-50" /><span className="h-7 w-7 rounded-full bg-navy-900" /></div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[[CalendarCheck2, 'Today’s bookings', '124', '+12%'], [FileCheck2, 'Reports pending', '28', '-8%'], [CircleDollarSign, 'Payments due', '₹12,450', ''], [UsersRound, 'Active patients', '1,284', '+9%']].map(([Icon, label, value, delta]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"><div className="flex items-center justify-between"><Icon size={14} className="text-blue-600" /><span className="text-[7px] font-bold text-emerald-600">{delta}</span></div><div className="mt-3 text-[8px] text-slate-400">{label}</div><div className="mt-1 text-lg font-extrabold text-navy-900">{value}</div></div>
              ))}
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><span className="text-[10px] font-extrabold text-navy-900">Recent partner operations</span><span className="text-[8px] font-bold text-blue-600">View all</span></div>
              <div className="hidden grid-cols-[1.2fr_1fr_.9fr_.55fr] gap-2 bg-slate-50 px-4 py-2 text-[7px] font-bold uppercase tracking-wider text-slate-400 sm:grid"><span>Patient / Service</span><span>Type</span><span>Status</span><span>Created</span></div>
              {orders.map(([name, type, status, time], index) => (
                <div key={name} className="grid grid-cols-[1.2fr_.8fr] gap-2 border-t border-slate-50 px-4 py-3 text-[8px] sm:grid-cols-[1.2fr_1fr_.9fr_.55fr]">
                  <span className="font-bold text-navy-900">{name}</span>
                  <span className="text-slate-500">{type}</span>
                  <span className={`hidden rounded-full px-2 py-1 text-center font-bold sm:block ${index === 0 ? 'bg-emerald-50 text-emerald-700' : index === 1 ? 'bg-cyan-50 text-cyan-700' : index === 2 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{status}</span>
                  <span className="hidden text-slate-400 sm:block">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -right-3 hidden w-[150px] rounded-[2rem] border-[6px] border-[#071d43] bg-white p-3 shadow-dashboard md:block">
        <div className="mx-auto h-2.5 w-12 rounded-full bg-[#071d43]" />
        <div className="mt-4 rounded-xl bg-blue-50 p-3"><div className="text-[8px] text-slate-400">Today</div><div className="mt-1 text-2xl font-extrabold text-navy-900">124</div><div className="text-[8px] font-bold text-blue-600">Bookings</div></div>
        <div className="mt-3 space-y-2">{['Orders', 'Reports', 'Payments'].map((item) => <div key={item} className="rounded-lg border border-slate-100 px-3 py-2 text-[8px] font-bold text-navy-900">{item}</div>)}</div>
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.partners-hero-copy > *', { y: 30, opacity: 0, duration: 0.72, stagger: 0.08 })
        .from('.partner-orbit', { scale: 0.93, opacity: 0, duration: 1 }, '-=.6')
        .from('.partner-node', { y: 16, scale: 0.82, opacity: 0, duration: 0.45, stagger: 0.07 }, '-=.58');
      gsap.to('.partner-node', { y: -7, repeat: -1, yoyo: true, duration: 2.7, stagger: 0.2, ease: 'sine.inOut' });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-hero-radial pt-[76px]">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(104,167,230,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(104,167,230,.08)_1px,transparent_1px)] [background-size:46px_46px]" />
          <div className="relative mx-auto grid min-h-[700px] max-w-[1380px] items-center gap-10 px-5 py-16 lg:grid-cols-[.86fr_1.14fr] lg:px-8 lg:py-20">
            <div className="partners-hero-copy relative z-10 max-w-2xl">
              <span className="inline-flex rounded-full border border-gold-400 bg-white/85 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold-500">PARTNER WITH ASTIKAN</span>
              <h1 className="mt-6 text-[2.7rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-navy-900 sm:text-6xl lg:text-[4.5rem]">Build the future of healthcare with Astikan.</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Join a forward looking healthcare ecosystem where patients, providers, institutions, and innovators can reach more people and deliver better care.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#partner-contact" className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-navy-900/15 transition hover:-translate-y-0.5 hover:bg-navy-800">Become an Astikan Partner <ArrowRight size={16} /></a>
                <a href="#partner-portal" className="inline-flex items-center gap-2 rounded-md border border-navy-700 bg-white px-6 py-3.5 text-sm font-extrabold text-navy-900 transition hover:bg-slate-50">Partner Portal Login <ArrowRight size={16} /></a>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
                {[[BadgeCheck, 'Trusted Network', 'Verified partners and standards'], [Workflow, 'Seamless Operations', 'Connected partner workflows'], [HeartHandshake, 'Shared Growth', 'More reach and impact']].map(([Icon, title, text]) => (
                  <div key={title} className="flex items-start gap-3"><span className="mt-1 text-blue-600"><Icon size={23} strokeWidth={1.5} /></span><div><div className="text-sm font-extrabold text-navy-900">{title}</div><div className="mt-1 text-[11px] leading-5 text-slate-500">{text}</div></div></div>
                ))}
              </div>
            </div>
            <PartnerNetworkVisual />
          </div>
        </section>

        <section id="partner-paths" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="CHOOSE YOUR PARTNERSHIP PATH" title="Partner with us in the way you create the most impact." />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {partnerPaths.map(({ Icon, title, text, accent }, index) => (
                <article key={title} className="group flex min-h-[285px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft" data-aos="fade-up" data-aos-delay={index * 55}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}><Icon size={25} strokeWidth={1.45} /></span>
                  <h3 className="mt-5 text-lg font-extrabold leading-6 text-navy-900">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
                  <a href="#partner-contact" className="mt-auto inline-flex w-fit items-center gap-2 rounded-md border border-blue-200 px-3.5 py-2 text-xs font-extrabold text-navy-900 transition group-hover:border-blue-500 group-hover:bg-blue-50">Partner <ArrowRight size={13} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-blue-100 bg-[#f3f9ff] py-14 sm:py-18">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="WHAT ASTIKAN GIVES PARTNERS" title="More than a listing. A connected growth engine." />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
              {partnerValue.map(([Icon, title], index) => (
                <div key={title} className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-card" data-aos="fade-up" data-aos-delay={index * 45}>
                  <Icon className="mx-auto h-8 w-8 text-blue-600" strokeWidth={1.45} />
                  <div className="mt-4 text-xs font-extrabold leading-5 text-navy-900">{title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="partner-portal" className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1380px] items-center gap-12 px-5 lg:grid-cols-[.52fr_1.48fr] lg:px-8">
            <div data-aos="fade-right">
              <SectionHeading eyebrow="PARTNER PORTAL" title="Everything you need. In one place." text="A powerful operating space to manage services, bookings, fulfilment, reports, payments, teams, and support across Astikan." center={false} />
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {['Orders, bookings, and appointments', 'Test and medicine fulfilment', 'Patient and report status', 'Payment settlements and refunds', 'Analytics and performance insights', 'Branch and staff management', 'Escalations and partner support', 'Secure and compliant operations'].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-navy-900"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.4} />{item}</div>
                ))}
              </div>
              <a href="#partner-contact" className="mt-8 inline-flex items-center gap-2 rounded-md bg-navy-900 px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-navy-800">See Partner Portal <ArrowRight size={16} /></a>
            </div>
            <div data-aos="fade-left"><PortalMockup /></div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionHeading eyebrow="INTEGRATION OPTIONS" title="Work with Astikan, the way you prefer." text="Partners can start with a ready portal, use assisted operations, or connect deeper systems as the relationship grows." />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {integrationOptions.map(([Icon, title, text], index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card" data-aos="fade-up" data-aos-delay={index * 60}>
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={24} strokeWidth={1.45} /></span>
                  <h3 className="mt-4 text-sm font-extrabold text-navy-900">{title}</h3>
                  <p className="mt-3 text-xs leading-5 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1380px] gap-6 px-5 lg:grid-cols-2 lg:px-8">
            <article className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-[#eef7ff] to-white p-7 sm:p-9" data-aos="fade-right">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gold-500">TRUST & PARTNER STANDARDS</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900">A trusted network is built through standards, not logos.</h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {standards.map((item) => <div key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-navy-900"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{item}</div>)}
              </div>
            </article>

            <article className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-[#effbf6] via-white to-[#eef9ff] p-7 sm:p-9" data-aos="fade-left">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">INNOVATION COLLABORATION</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900">Let’s build what healthcare needs next.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">Astikan works with research, technology, infrastructure, and healthcare partners to develop the next generation of access and care experiences.</p>
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {innovations.map(([Icon, label]) => <div key={label} className="rounded-xl border border-emerald-100 bg-white/80 p-4 text-center"><Icon className="mx-auto h-7 w-7 text-navy-800" strokeWidth={1.45} /><div className="mt-2 text-xs font-extrabold text-navy-900">{label}</div></div>)}
              </div>
            </article>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-white py-10">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">TOGETHER FOR GREATER IMPACT</p>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {[[Network, '25+', 'Countries in our vision'], [Building2, '10,000+', 'Partner facilities'], [UsersRound, '1.8M+', 'Lives supported'], [ShieldCheck, '99.6%', 'Trust and safety focus'], [HeartHandshake, 'Better care', 'For every life']].map(([Icon, value, label]) => (
                <div key={label} className="flex items-center justify-center gap-3 border-r border-slate-100 last:border-0"><Icon className="h-8 w-8 text-blue-600" strokeWidth={1.45} /><div><div className="text-xl font-extrabold text-navy-900">{value}</div><div className="text-[10px] leading-4 text-slate-500">{label}</div></div></div>
              ))}
            </div>
          </div>
        </section>

        <section id="partner-contact" className="bg-slate-50 px-5 py-10 lg:px-8">
          <div className="relative mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-7 overflow-hidden rounded-[2rem] bg-gradient-to-r from-navy-900 via-[#0a3b78] to-[#0d55a1] px-8 py-10 text-white shadow-dashboard md:flex-row md:items-center sm:px-12">
            <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-cyan-200/20" />
            <div className="relative"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">BE A PART OF THE ASTIKAN NETWORK</p><h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Let’s work together for a healthier world.</h2></div>
            <div className="relative flex flex-wrap gap-3"><a href="mailto:care@astikan.com" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-extrabold text-navy-900 transition hover:-translate-y-0.5">Become an Astikan Partner <ArrowRight size={16} /></a><a href="#partner-portal" className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10">Partner Portal Login <ArrowRight size={16} /></a></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
