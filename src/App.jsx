import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AOS from 'aos';
import { gsap } from 'gsap';
import {
  ArrowRight, BadgeDollarSign, BellRing, Building2, Check, ChevronDown, CircleDollarSign,
  Clock3, Database, FileHeart, FlaskConical, Globe2, HandHeart, HeartHandshake, HeartPulse,
  Hospital, LockKeyhole, Menu, Network, PhoneCall, Pill, ShieldCheck, Sparkles, Stethoscope,
  UserRound, UsersRound, WalletCards, X, Ambulance, BrainCircuit, ClipboardCheck, CreditCard,
  FileCheck2, Scale, Search, MessageSquareHeart, Microscope, Navigation
} from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import AstikanLogo, { AstikanMark } from './components/AstikanLogo';
import WorldNetwork from './components/WorldNetwork';
import DashboardMockup from './components/DashboardMockup';

const navItems = [
  ['Care', '#ecosystem'], ['Technology', '#technology'], ['Partners', '#partners'],
  ['Trust', '#trust'], ['Impact', '#impact'], ['Insights', '#insights'], ['Contact', '#contact']
];

const problems = [
  { icon: UsersRound, title: 'Unclear Guidance', text: "Patients don’t know where to go, what to do, or who to trust." },
  { icon: Network, title: 'Disconnected Care', text: 'Providers, labs, and hospitals work in silos with no coordination.' },
  { icon: CircleDollarSign, title: 'High & Unpredictable Costs', text: 'Lack of transparency and financial support leads to stress and delays.' },
  { icon: Clock3, title: 'Limited Access', text: 'Quality care is not easily accessible, especially in tier 2/3 cities and rural areas.' },
  { icon: UserRound, title: 'Patient Burden', text: 'Managing appointments, reports, payments, and follow-ups is exhausting.' }
];

const solutions = [
  { icon: UsersRound, title: 'Care Access', text: 'Find the right doctor or specialist, anytime, anywhere.', accent: 'text-blue-500' },
  { icon: FlaskConical, title: 'Diagnostics', text: 'Trusted labs and imaging with home sample collection.', accent: 'text-violet-500' },
  { icon: Hospital, title: 'Hospital & Surgery Support', text: 'Access top hospitals with coordinated care and support.', accent: 'text-sky-500' },
  { icon: HandHeart, title: 'Financial Assistance', text: 'Get help with treatment costs through our assistance programs.', accent: 'text-amber-500' },
  { icon: BellRing, title: 'Emergency Support', text: '24/7 ambulance and crisis support when you need it most.', accent: 'text-rose-500' },
  { icon: BrainCircuit, title: 'Technology Infrastructure', text: 'Secure, unified technology that connects every part of your care.', accent: 'text-indigo-500' }
];

const trustCards = [
  { icon: ShieldCheck, title: 'Verified Partners', text: 'Only verified hospitals, doctors, and labs across our network.' },
  { icon: ClipboardCheck, title: 'Medical Review Standards', text: 'Clinical protocols and quality checks at every step.' },
  { icon: LockKeyhole, title: 'Patient Privacy', text: 'Your data is encrypted and protected with global standards.' },
  { icon: CreditCard, title: 'Secure Payments', text: 'Safe, compliant, and transparent payment infrastructure.' },
  { icon: FileCheck2, title: 'Transparent Information', text: 'Clear costs, guidance, and outcomes.' },
  { icon: Scale, title: 'Responsible Guidance', text: 'AI-powered insights with human oversight.' }
];

const impactStats = [
  { value: '1.8M+', label: 'Lives Supported', icon: HeartHandshake },
  { value: '35%', label: 'Reduction in Out-of-Pocket Healthcare Costs', icon: WalletCards },
  { value: '40%', label: 'Faster Access to Specialist Care', icon: Navigation },
  { value: '90%', label: 'Patient Satisfaction Rate', icon: ShieldCheck },
  { value: '25+', label: 'Countries Across 5 Continents', icon: Globe2 }
];

const ecosystemTop = [
  { icon: Stethoscope, label: 'Doctors' }, { icon: Hospital, label: 'Hospitals' },
  { icon: FlaskConical, label: 'Labs' }, { icon: Pill, label: 'Pharmacy' }, { icon: Ambulance, label: 'Ambulance' }
];
const ecosystemBottom = [
  { icon: ShieldCheck, label: 'Insurance' }, { icon: BadgeDollarSign, label: 'Medical Finance' },
  { icon: FileHeart, label: 'Digital Records' }, { icon: BrainCircuit, label: 'AI Guidance' }, { icon: Navigation, label: 'Care Navigation' }
];

function SectionTitle({ kicker, title, center = true, light = false, id }) {
  return (
    <div id={id} className={center ? 'text-center' : ''}>
      <p className={`mb-2 text-xs font-extrabold uppercase tracking-[0.18em] ${light ? 'text-gold-400' : 'text-gold-500'}`}>{kicker}</p>
      <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
    </div>
  );
}

function Card({ children, className = '', ...props }) {
  return <div {...props} className={`rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft ${className}`}>{children}</div>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 lg:px-8">
        <AstikanLogo compact />
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map(([label, href], i) => <a key={label} href={href} className="group inline-flex items-center gap-1 text-sm font-semibold text-navy-900/80 hover:text-navy-700">{label}{i === 0 && <ChevronDown className="h-3.5 w-3.5"/>}</a>)}
        </nav>
        <a href="#contact" className="hidden items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-navy-900/10 transition hover:-translate-y-0.5 hover:bg-navy-800 lg:inline-flex">Start Care Journey <ArrowRight size={15}/></a>
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-navy-900 lg:hidden" aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <div className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden"><div className="grid gap-1">{navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-semibold text-navy-900 hover:bg-slate-50">{label}</a>)}</div></div>}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[760px] overflow-hidden bg-hero-radial pt-[76px]">
      <div className="mx-auto grid min-h-[680px] max-w-[1380px] items-center gap-10 px-5 py-16 lg:grid-cols-[.92fr_1.08fr] lg:px-8 lg:py-20">
        <div className="hero-copy relative z-20 max-w-2xl">
          <span className="inline-flex rounded-full border border-gold-400 bg-white/90 px-4 py-2 text-[11px] font-extrabold tracking-[0.13em] text-gold-500">A GLOBAL HEALTHCARE TRUST</span>
          <h1 className="mt-6 text-[2.65rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-navy-900 sm:text-6xl lg:text-[4.45rem]">Building the future of trusted healthcare access.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Astikan unifies care, technology, diagnostics, hospitals, doctors, emergency services, and financial support into one integrated healthcare ecosystem—so every person, everywhere, can access the right care with clarity, confidence, and compassion.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-navy-900/15 transition hover:-translate-y-0.5 hover:bg-navy-800">Start Care Journey <ArrowRight size={16}/></a>
            <a href="#ecosystem" className="inline-flex items-center gap-2 rounded-md border border-navy-700 bg-white px-6 py-3.5 text-sm font-bold text-navy-900 transition hover:bg-slate-50">Explore Our Ecosystem <ArrowRight size={16}/></a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-5 border-t border-slate-200 pt-7 sm:grid-cols-4">
            {[[Globe2,'25+','Countries'],[Hospital,'10,000+','Partner Facilities'],[UsersRound,'1.8M+','Lives Supported'],[ShieldCheck,'99.6%','Trust & Safety Rating']].map(([Icon, value, label]) => <div key={label} className="flex items-center gap-3"><div className="text-blue-500"><Icon size={25} strokeWidth={1.6}/></div><div><div className="text-lg font-extrabold text-navy-900">{value}</div><div className="text-[11px] text-slate-500">{label}</div></div></div>)}
          </div>
        </div>
        <div className="hero-visual relative min-h-[520px] lg:min-h-[610px]">
          <WorldNetwork />
          <DashboardMockup />
          <div className="pointer-events-none absolute inset-y-[8%] right-[8%] w-px bg-gradient-to-b from-transparent via-white to-transparent"/>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="border-t border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
        <SectionTitle kicker="The Problem" title="Healthcare today is complex and fragmented." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {problems.map(({ icon: Icon, title, text }, i) => <Card key={title} className="p-6" data-aos="fade-up" data-aos-delay={i*70}><Icon className="h-10 w-10 text-blue-500" strokeWidth={1.4}/><h3 className="mt-5 font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></Card>)}
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  return (
    <section className="bg-slate-50/70 py-16 sm:py-20">
      <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
        <SectionTitle kicker="Astikan’s Answer" title="One ecosystem. Built around you." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {solutions.map(({ icon: Icon, title, text, accent }, i) => <Card key={title} className="group flex min-h-[260px] flex-col p-6" data-aos="fade-up" data-aos-delay={i*60}><Icon className={`h-12 w-12 ${accent}`} strokeWidth={1.35}/><h3 className="mt-5 text-sm font-extrabold leading-5 text-navy-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p><ArrowRight className="mt-auto h-4 w-4 text-blue-500 transition group-hover:translate-x-1"/></Card>)}
        </div>
      </div>
    </section>
  );
}

function Node({ icon: Icon, label }) {
  return <div className="relative z-10 flex min-w-[112px] flex-col items-center rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-card"><Icon className="h-7 w-7 text-navy-700" strokeWidth={1.5}/><span className="mt-2 text-xs font-bold text-navy-900">{label}</span></div>;
}

function EcosystemSection() {
  return (
    <section id="ecosystem" className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1380px] gap-12 px-5 lg:grid-cols-[.56fr_1.44fr] lg:px-8">
        <div data-aos="fade-right">
          <SectionTitle kicker="Integrated Healthcare Ecosystem" title="All parts of healthcare. Working as one." center={false} />
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600">Astikan connects the entire healthcare value chain so you experience a seamless, coordinated, and compassionate journey.</p>
          <a href="#technology" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-navy-700">See how it works <ArrowRight size={15}/></a>
        </div>
        <div className="relative py-4" data-aos="fade-left">
          <div className="absolute left-[8%] right-[8%] top-[27%] border-t border-dashed border-blue-200"/>
          <div className="absolute left-[8%] right-[8%] bottom-[27%] border-t border-dashed border-blue-200"/>
          <div className="absolute left-1/2 top-[28%] h-[44%] border-l border-dashed border-blue-200"/>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-between">{ecosystemTop.map(n => <Node key={n.label} {...n}/>)}</div>
          <div className="relative z-20 mx-auto my-7 flex h-20 w-20 items-center justify-center rounded-full border-[8px] border-blue-50 bg-navy-900 shadow-soft"><AstikanMark className="h-12 w-12"/></div>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-between">{ecosystemBottom.map(n => <Node key={n.label} {...n}/>)}</div>
        </div>
      </div>
    </section>
  );
}

function TechDashboard() {
  const metrics = [['12,842','Active Journeys'],['3,421','Appointments Today'],['1,82,765','Patients Supported'],['10,253','Partner Facilities']];
  return (
    <div className="rounded-3xl border border-white/10 bg-[#061c3d] p-3 shadow-dashboard" data-aos="zoom-in-up">
      <div className="flex min-h-[430px] overflow-hidden rounded-2xl bg-[#09264c]">
        <aside className="hidden w-[155px] border-r border-white/10 p-4 sm:block">
          <div className="flex items-center gap-2 text-xs font-bold text-white"><AstikanMark className="h-7 w-7"/> Astikan Platform</div>
          <div className="mt-6 space-y-2">{['Overview','Care Journeys','Appointments','Records','Communications','Payments','Partners','Analytics'].map((x,i)=><div key={x} className={`rounded-md px-3 py-2 text-[10px] ${i===0?'bg-blue-500/20 text-white':'text-blue-200'}`}>{x}</div>)}</div>
        </aside>
        <main className="flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between"><div><div className="text-[10px] text-blue-200">Care Overview</div><div className="mt-1 text-sm font-bold text-white">Global healthcare operations</div></div><div className="flex items-center gap-3 text-blue-200"><Search size={15}/><BellRing size={15}/></div></div>
          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">{metrics.map(([v,l])=><div key={l} className="rounded-xl border border-white/10 bg-white/[.035] p-3"><div className="text-xl font-extrabold text-white">{v}</div><div className="mt-1 text-[9px] text-blue-200">{l}</div><div className="mt-2 text-[9px] text-emerald-300">↗ 18%</div></div>)}</div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.5fr_.7fr]">
            <div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><div className="text-xs font-bold text-white">Care Journey Flow</div><div className="mt-8 flex items-center justify-between">{[['Consultation','3,421'],['Diagnostics','2,851'],['Treatment','1,964'],['Follow-up','2,106'],['Closed','2,500']].map(([a,b],i)=><React.Fragment key={a}><div className="text-center"><div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/20 ${['bg-cyan-400/30','bg-amber-400/30','bg-emerald-400/30','bg-violet-400/30','bg-slate-400/20'][i]}`}><HeartPulse size={17} className="text-white"/></div><div className="mt-3 text-[8px] text-blue-200">{a}</div><div className="text-[10px] font-bold text-white">{b}</div></div>{i<4&&<div className="h-px flex-1 bg-gradient-to-r from-blue-300/60 to-white/10"/>}</React.Fragment>)}</div></div>
            <div className="rounded-xl border border-white/10 bg-white/[.035] p-4"><div className="text-xs font-bold text-white">Top Specialties</div><div className="mt-4 space-y-3">{[['Cardiology','84%'],['Oncology','72%'],['Orthopedics','65%'],['Neurology','55%']].map(([a,b])=><div key={a}><div className="mb-1 flex justify-between text-[9px] text-blue-200"><span>{a}</span><span>{b}</span></div><div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-blue-400" style={{width:b}}/></div></div>)}</div></div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TechnologySection() {
  return (
    <section id="technology" className="relative overflow-hidden bg-dark-grid py-16 sm:py-24">
      <div className="absolute -right-24 top-0 h-80 w-80 rounded-full border border-blue-300/20"/><div className="absolute -right-12 top-12 h-60 w-60 rounded-full border border-blue-300/10"/>
      <div className="mx-auto grid max-w-[1380px] items-center gap-12 px-5 lg:grid-cols-[.55fr_1.45fr] lg:px-8">
        <div data-aos="fade-right"><SectionTitle kicker="Technology Layer" title="Intelligent technology. Human-centered care." center={false} light/><p className="mt-5 text-base leading-7 text-blue-100/80">Our proprietary platform orchestrates care, data, communication, and payments securely across our partner network.</p><div className="mt-7 space-y-3">{['Real-time care coordination','Unified patient records','Smart recommendations','Seamless payments & claims','Partner & network integration'].map(x=><div key={x} className="flex items-center gap-3 text-sm text-white"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10"><Check size={12}/></span>{x}</div>)}</div></div>
        <TechDashboard />
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="trust" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.33fr_1.67fr]">
          <SectionTitle kicker="Trust & Safety" title="Your trust is our foundation." center={false}/>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{trustCards.map(({icon:Icon,title,text},i)=><Card key={title} className="min-h-[210px] p-5" data-aos="fade-up" data-aos-delay={i*50}><Icon className={`h-9 w-9 ${['text-blue-500','text-mint','text-violet','text-emerald-500','text-amber-500','text-indigo-500'][i]}`} strokeWidth={1.5}/><h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-xs leading-5 text-slate-500">{text}</p></Card>)}</div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section id="impact" className="border-t border-slate-100 bg-slate-50/60 py-10 sm:py-14">
      <div className="mx-auto grid max-w-[1380px] gap-8 px-5 lg:grid-cols-[.35fr_1.65fr] lg:px-8">
        <div><SectionTitle kicker="Our Impact" title="Creating meaningful impact at scale." center={false}/><a href="#insights" className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-navy-700">View Impact Report 2024 <ArrowRight size={14}/></a></div>
        <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">{impactStats.map(({value,label,icon:Icon},i)=><div key={label} className="border-l border-slate-200 px-5 text-center" data-aos="fade-up" data-aos-delay={i*60}><Icon className={`mx-auto h-8 w-8 ${['text-sky-500','text-emerald-500','text-blue-500','text-mint','text-indigo-500'][i]}`} strokeWidth={1.5}/><div className="mt-3 text-2xl font-extrabold text-navy-900">{value}</div><div className="mt-1 text-xs leading-5 text-slate-500">{label}</div></div>)}</div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-r from-navy-800 via-navy-900 to-[#08305f] py-8">
      <div className="absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border border-white/10"/><div className="absolute -right-12 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-blue-300/20"/>
      <div className="relative mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:text-left"><div><h3 className="text-xl font-extrabold text-white">Your health journey deserves clarity and support.</h3><p className="mt-1 text-sm text-blue-100/80">Let Astikan be with you—every step of the way.</p></div><div className="flex flex-wrap justify-center gap-4"><a href="mailto:care@astikan.health" className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-sm font-extrabold text-navy-900">Start Care Journey <ArrowRight size={16}/></a><a href="tel:+910000000000" className="inline-flex items-center gap-2 rounded-md border border-white/70 px-7 py-3.5 text-sm font-extrabold text-white">Talk to Our Care Team <ArrowRight size={16}/></a></div></div>
    </section>
  );
}

const footerCols = [
  ['CARE',['Find a Doctor','Hospitals','Diagnostics','Emergency Support','Care Programs']],
  ['TECHNOLOGY',['Our Platform','AI & Innovation','Security','Data & Privacy','Integrations']],
  ['PARTNERS',['For Hospitals','For Doctors','For Labs','For Corporates','Partner Portal']],
  ['TRUST',['Our Standards','Safety & Quality','Compliance','Privacy Policy','Terms of Use']],
  ['INSIGHTS',['Health Library','News & Stories','Research','Reports','Events']],
  ['CONTACT',['Help Center','Care Team','Feedback','Media Inquiries','Contact Us']]
];

function Footer() {
  return (
    <footer id="insights" className="bg-[#031a3b] pt-12 text-white">
      <div className="mx-auto grid max-w-[1380px] gap-10 px-5 lg:grid-cols-[1.25fr_3.75fr] lg:px-8">
        <div><AstikanLogo light/><p className="mt-5 max-w-xs text-sm leading-6 text-blue-100/70">Astikan is a global healthcare trust building an integrated ecosystem that combines care, technology, and compassion to improve lives around the world.</p><div className="mt-6 flex gap-3">{[[FaLinkedinIn,'LinkedIn'],[FaXTwitter,'X'],[FaYoutube,'YouTube'],[FaInstagram,'Instagram']].map(([Icon,label])=><a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-blue-100 transition hover:bg-white hover:text-navy-900"><Icon size={15}/></a>)}</div></div>
        <div className="grid grid-cols-2 gap-7 sm:grid-cols-3 lg:grid-cols-6">{footerCols.map(([title,items])=><div key={title}><h4 className="text-xs font-extrabold tracking-wider text-white">{title}</h4><ul className="mt-4 space-y-3">{items.map(x=><li key={x}><a href="#" className="text-xs text-blue-100/70 hover:text-white">{x}</a></li>)}</ul></div>)}</div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1380px] flex-col gap-3 border-t border-white/10 px-5 py-5 text-[11px] text-blue-100/55 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2026 Astikan Healthcare Trust. All rights reserved.</span><span>Proudly building a healthier world. 💙</span></div>
    </footer>
  );
}

export default function App() {
  const appRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 720, once: true, easing: 'ease-out-cubic', offset: 70 });
  }, []);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-copy > *', { y: 30, opacity: 0, duration: .7, stagger: .09 })
        .from('.hero-visual', { x: 50, opacity: 0, duration: .9 }, '-=.7')
        .from('.hero-dashboard', { y: 25, scale: .97, opacity: 0, duration: .8 }, '-=.55');
      gsap.to('.hero-dashboard', { y: -10, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }, appRef);
    return () => ctx.revert();
  }, []);

  return <div ref={appRef} className="min-h-screen bg-white text-slate-700"><Navbar/><main><Hero/><ProblemSection/><SolutionsSection/><EcosystemSection/><TechnologySection/><TrustSection/><ImpactSection/><CTA/></main><Footer/></div>;
}
