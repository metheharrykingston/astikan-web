import React from 'react';
import {
  Activity,
  Brain,
  Building2,
  CalendarDays,
  Cpu,
  CreditCard,
  Database,
  Dna,
  Eye,
  FileText,
  FlaskConical,
  Globe2,
  HandHeart,
  HeartPulse,
  Leaf,
  Lightbulb,
  LockKeyhole,
  MapPin,
  Microscope,
  Network,
  Pill,
  Plus,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  UsersRound,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import { AstikanMark } from '../components/AstikanLogo';

const cardClass = 'rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(31,70,130,.08)]';

function SectionTitle({ eyebrow, title, text, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} data-aos="fade-up">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-600">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-navy-900 sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-slate-600">{text}</p>}
    </div>
  );
}

function StatStrip({ items }) {
  return (
    <div className={`${cardClass} grid gap-0 overflow-hidden sm:grid-cols-2 lg:grid-cols-5`} data-aos="fade-up">
      {items.map(([Icon, value, label, detail], index) => (
        <div key={label} className={`p-6 ${index ? 'border-t border-slate-100 sm:border-l sm:border-t-0' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon size={21} /></span>
            <div className="text-3xl font-extrabold tracking-tight text-navy-900">{value}</div>
          </div>
          <div className="mt-4 text-sm font-extrabold text-navy-900">{label}</div>
          <div className="mt-2 text-xs leading-5 text-slate-500">{detail}</div>
        </div>
      ))}
    </div>
  );
}

function ResearchVisual() {
  return (
    <div className="relative mx-auto min-h-[520px] w-full max-w-[760px]" data-aos="fade-left">
      <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_65%_35%,rgba(75,155,255,.35),transparent_34%),linear-gradient(145deg,#eff6ff,#d8eaff)]" />
      <div className="absolute right-[4%] top-[6%] h-[82%] w-[62%] rounded-[2rem] border border-white/70 bg-white/20 shadow-[0_30px_90px_rgba(28,83,164,.18)] backdrop-blur-xl">
        <div className="grid h-full grid-cols-2 gap-3 p-6 opacity-75">
          {[Activity, Dna, Globe2, HeartPulse, Database, Brain].map((Icon, index) => <div key={index} className="rounded-2xl border border-white/60 bg-white/20 p-4"><Icon className="h-10 w-10 text-white" strokeWidth={1.25} /><div className="mt-5 h-2 rounded-full bg-white/45" /><div className="mt-3 h-2 w-2/3 rounded-full bg-white/25" /></div>)}
        </div>
      </div>
      <div className="absolute bottom-[8%] left-[17%] flex h-[310px] w-[260px] items-center justify-center rounded-[2.3rem] border border-white/80 bg-white shadow-[0_35px_80px_rgba(10,45,100,.28)]">
        <Microscope className="h-52 w-52 text-[#102c66]" strokeWidth={1.1} />
      </div>
      <div className="absolute bottom-[4%] right-[6%] flex items-end gap-3">
        {[92, 125, 108, 140, 115].map((height, index) => <div key={index} className="relative w-9 rounded-b-xl border border-blue-300 bg-white/70" style={{ height }}><div className="absolute inset-x-1 bottom-1 h-[62%] rounded-b-lg bg-blue-400/45" /></div>)}
      </div>
      <div className="absolute bottom-[6%] left-[1%] flex items-end gap-3">
        {[88, 126, 102].map((height, index) => <div key={index} className="w-12 rounded-b-2xl border border-blue-200 bg-white/70" style={{ height }}><div className="mt-auto h-1/2 rounded-b-xl bg-blue-400/35" /></div>)}
      </div>
    </div>
  );
}

const researchFocus = [
  [HeartPulse, 'Preventive Health', 'Understanding risks and building preventive strategies.', 'bg-rose-50 text-rose-500'],
  [Brain, 'Chronic Disease Management', 'Researching better outcomes for long-term conditions.', 'bg-blue-50 text-blue-600'],
  [Dna, 'Genomics & Precision Health', 'Personalized insights through genetic research.', 'bg-emerald-50 text-emerald-600'],
  [Cpu, 'AI & Data Science', 'Using data and AI to drive health innovation.', 'bg-violet-50 text-violet-600'],
  [Leaf, 'Mental Wellbeing', 'Advancing research in mental health and behaviour.', 'bg-cyan-50 text-cyan-600'],
  [Plus, 'Healthcare Access', 'Improving access and equity in healthcare.', 'bg-orange-50 text-orange-500'],
];

export function ResearchPage() {
  const stats = [
    [FlaskConical, '48+', 'Research projects', 'Across health domains'],
    [UsersRound, '120+', 'Research partners', 'Hospitals, labs and institutions'],
    [FileText, '250+', 'Publications', 'Research and scientific outputs'],
    [UsersRound, '15K+', 'Participants', 'Across active studies'],
    [Globe2, '12+', 'Countries', 'A growing global footprint'],
  ];

  const studies = [
    [HeartPulse, 'AI-based Early Detection of Hypertension', 'Using machine learning to identify early patterns and enable timely intervention.', '2,340', '18', 'Active'],
    [Activity, 'Gut Microbiome & Metabolic Health', 'Studying how gut health influences metabolism and chronic-disease risk.', '1,870', '12', 'Active'],
    [Brain, 'Digital Therapeutics for Anxiety & Stress', 'Evaluating digital interventions for improving mental wellbeing at scale.', '1,120', '10', 'Recruiting'],
  ];

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_22%,rgba(120,181,255,.48),transparent_34%),linear-gradient(180deg,#ffffff,#eff6ff)] px-5 pb-16 pt-[120px] lg:px-8 lg:pb-24 lg:pt-[148px]">
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 lg:grid-cols-[.78fr_1.22fr]">
            <div data-aos="fade-right">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">RESEARCH FOR A HEALTHIER TOMORROW</p>
              <h1 className="mt-6 text-5xl font-extrabold leading-[.98] tracking-[-0.055em] text-navy-900 sm:text-7xl">Advancing knowledge.<br /><span className="text-blue-600">Improving lives.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">At Astikan, research drives how new health technologies are understood, tested, and improved. We bring together real-world information, scientific thinking, and collaboration around meaningful health challenges.</p>
              <div className="mt-8 space-y-4">
                {[[FileText, 'Evidence-based insights'], [UsersRound, 'Collaborative innovation'], [ShieldCheck, 'Ethical and responsible research']].map(([Icon, label]) => <div key={label} className="flex items-center gap-3 text-sm font-extrabold text-navy-900"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={18} /></span>{label}</div>)}
              </div>
            </div>
            <ResearchVisual />
          </div>
          <div className="mx-auto mt-12 max-w-[1380px]"><StatStrip items={stats} /></div>
        </section>

        <section className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1380px]">
            <SectionTitle eyebrow="OUR RESEARCH FOCUS" title="Exploring critical areas that shape the future of health." center />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {researchFocus.map(([Icon, title, text, accent], index) => <article key={title} className={`${cardClass} p-6 text-center`} data-aos="fade-up" data-aos-delay={index * 55}><span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${accent}`}><Icon size={27} strokeWidth={1.5} /></span><h3 className="mt-6 text-base font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f8ff] px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1380px]">
            <SectionTitle eyebrow="ONGOING RESEARCH" title="Questions being explored right now." text="A snapshot of active research directions across Astikan's wider health ecosystem." />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {studies.map(([Icon, title, text, participants, centres, status], index) => <article key={title} className={`${cardClass} relative overflow-hidden p-7`} data-aos="fade-up" data-aos-delay={index * 70}><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-50" /><span className={`relative rounded-full px-3 py-1 text-[9px] font-extrabold ${status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{status}</span><Icon className="relative mt-7 h-16 w-16 text-blue-300" strokeWidth={1.1} /><h3 className="relative mt-6 text-xl font-extrabold text-navy-900">{title}</h3><p className="relative mt-4 text-sm leading-7 text-slate-500">{text}</p><div className="relative mt-7 grid grid-cols-2 border-t border-slate-100 pt-5"><div><div className="text-[9px] text-slate-400">Participants</div><div className="mt-1 text-lg font-extrabold text-blue-700">{participants}</div></div><div><div className="text-[9px] text-slate-400">Centres</div><div className="mt-1 text-lg font-extrabold text-blue-700">{centres}</div></div></div></article>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1380px]">
            <SectionTitle eyebrow="RESEARCH PARTNERS" title="Built through collaboration." center />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {['AIIMS New Delhi', 'IISc Bengaluru', 'Tata Medical Center', 'Max Healthcare', 'Manipal Hospitals', '120+ more partners'].map((name, index) => <div key={name} className={`${cardClass} flex min-h-[110px] items-center justify-center p-5 text-center text-sm font-extrabold text-navy-900`} data-aos="fade-up" data-aos-delay={index * 45}>{name}</div>)}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-[1380px] gap-8 rounded-[2.4rem] border border-blue-100 bg-[linear-gradient(135deg,#eef5ff,#ffffff,#eaf2ff)] p-8 lg:grid-cols-[1.1fr_2fr] lg:p-12" data-aos="fade-up">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">OUR COMMITMENT</p><h2 className="mt-4 text-3xl font-extrabold text-navy-900">Research that puts life first.</h2><p className="mt-4 text-sm leading-7 text-slate-600">Ethical, transparent, useful research—designed around people, privacy, and meaningful impact.</p></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[ShieldCheck,'Ethical research'],[LockKeyhole,'Data privacy'],[Eye,'Transparency'],[Globe2,'Global impact']].map(([Icon,title]) => <div key={title} className="rounded-2xl bg-white/80 p-5"><Icon className="h-7 w-7 text-blue-600" /><div className="mt-4 text-sm font-extrabold text-navy-900">{title}</div></div>)}</div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MissionVisual() {
  return (
    <div className="relative mx-auto min-h-[500px] w-full max-w-[760px]" data-aos="fade-left">
      <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_55%_35%,rgba(255,255,255,.9),transparent_28%),linear-gradient(180deg,#d8ebff,#f9f3e9)]" />
      <Globe2 className="absolute right-[3%] top-[2%] h-[82%] w-[82%] text-white/80" strokeWidth={.55} />
      <div className="absolute inset-[9%] rounded-full border border-white/70" />
      {[[12,22],[71,16],[82,48],[25,54],[61,66]].map(([left,top],index) => <span key={index} className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/30 text-white backdrop-blur-lg" style={{left:`${left}%`,top:`${top}%`}}>{[UsersRound,HeartPulse,Plus,Network,Leaf][index]({size:22})}</span>)}
      <div className="absolute bottom-[5%] left-1/2 flex -translate-x-1/2 items-end gap-4">
        {[120,145,88,118].map((height,index) => <div key={index} className="relative w-16"><div className="mx-auto h-12 w-12 rounded-full bg-[#18355f]" /><div className="mx-auto mt-2 rounded-t-3xl bg-[#18355f]" style={{height,width:index===1?60:52}} /></div>)}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/85 to-transparent" />
    </div>
  );
}

export function MissionPage() {
  const pillars = [
    [UsersRound, 'People First', 'We put people at the centre of every decision, design, and innovation.', 'bg-emerald-50 text-emerald-600'],
    [ShieldCheck, 'Accessible for All', 'We reduce barriers of cost, distance, and complexity.', 'bg-blue-50 text-blue-600'],
    [HeartPulse, 'Connected Care', 'We connect people, information, providers, and technology.', 'bg-rose-50 text-rose-500'],
    [Lightbulb, 'Innovation with Purpose', 'We use research and technology to solve real problems.', 'bg-violet-50 text-violet-600'],
    [Leaf, 'Sustainable Impact', 'We build for the long term with ethical, scalable thinking.', 'bg-cyan-50 text-cyan-600'],
  ];
  const impact = [[UsersRound,'10M+','Lives touched'],[Building2,'25K+','Healthcare providers'],[HeartPulse,'50M+','Health records'],[Globe2,'120+','Countries'],[FlaskConical,'48+','Research projects']];

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff,#ffffff)] px-5 pb-16 pt-[120px] lg:px-8 lg:pb-24 lg:pt-[148px]">
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
            <div data-aos="fade-right"><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">OUR MISSION</p><h1 className="mt-6 text-5xl font-extrabold leading-[.98] tracking-[-0.055em] text-navy-900 sm:text-7xl">Better health for<br /><span className="text-blue-600">every life, everywhere.</span></h1><p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Our mission is to make quality health experiences more accessible, affordable, understandable, and connected for every form of life we can reach.</p><div className="mt-8 space-y-4">{[[HeartPulse,'Accessible health for all'],[UsersRound,'Technology that empowers'],[Globe2,'Global impact, local care']].map(([Icon,label]) => <div key={label} className="flex items-center gap-3 text-sm font-extrabold text-navy-900"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={18} /></span>{label}</div>)}</div></div>
            <MissionVisual />
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-[1380px]"><SectionTitle eyebrow="OUR MISSION PILLARS" title="Five pillars guide everything we build." center /><div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{pillars.map(([Icon,title,text,accent],index) => <article key={title} className={`${cardClass} p-7 text-center`} data-aos="fade-up" data-aos-delay={index*60}><span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${accent}`}><Icon size={28} /></span><h3 className="mt-6 text-base font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{text}</p></article>)}</div></div></section>

        <section className="bg-[#f5f8ff] px-5 py-20 lg:px-8 lg:py-24"><div className="mx-auto max-w-[1380px]"><SectionTitle eyebrow="OUR IMPACT, EVERY DAY" title="Building a healthier world, one life at a time." /><div className="mt-12"><StatStrip items={impact.map(([Icon,value,label])=>[Icon,value,label,'Connected through Astikan systems'])} /></div></div></section>

        <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-[1380px] items-center gap-10 rounded-[2.4rem] border border-blue-100 bg-[linear-gradient(135deg,#ffffff,#eef5ff)] p-8 lg:grid-cols-[.8fr_1.2fr_.7fr] lg:p-12" data-aos="fade-up"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">A GLOBAL VISION</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight text-navy-900">Health access without borders.</h2><p className="mt-5 text-sm leading-7 text-slate-600">A world where every individual can understand and navigate health with confidence, wherever they live.</p></div><div className="relative min-h-[300px]"><Globe2 className="absolute inset-0 h-full w-full text-blue-200" strokeWidth={.6} />{[[15,35],[34,23],[51,44],[67,28],[78,56],[28,67]].map(([left,top],index)=><span key={index} className="absolute h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_0_7px_rgba(59,130,246,.12)]" style={{left:`${left}%`,top:`${top}%`}} />)}</div><div className="space-y-5">{[[MapPin,'Local solutions'],[HandHeart,'Strong partnerships'],[Rocket,'Scalable technology']].map(([Icon,title])=><div key={title} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm"><Icon size={20} /></span><div><h3 className="text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">Built for real needs and designed to grow responsibly.</p></div></div>)}</div></div></section>

        <section className="bg-[#f8faff] px-5 py-20 lg:px-8 lg:py-24"><div className="mx-auto max-w-[1380px]"><SectionTitle eyebrow="OUR PRINCIPLES" title="The values that keep us true to the mission." center /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{[[ShieldCheck,'Integrity','We do what is right.'],[LockKeyhole,'Privacy','We protect data like life.'],[UsersRound,'Empathy','We listen, care, and understand.'],[Scale,'Equity','Health should be reachable.'],[Target,'Excellence','We pursue meaningful quality.']].map(([Icon,title,text],index)=><article key={title} className="p-6 text-center" data-aos="fade-up" data-aos-delay={index*55}><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={22} /></span><h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></article>)}</div></div></section>
      </main>
    </div>
  );
}

function CompanyVisual() {
  return (
    <div className="relative min-h-[500px]" data-aos="fade-left">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#dceaff,#f6f9ff)]" />
      <div className="absolute bottom-0 right-[3%] h-[83%] w-[86%] -skew-y-[2deg] overflow-hidden rounded-t-[2.5rem] border border-white/70 bg-[#17345f] shadow-[0_40px_100px_rgba(13,42,86,.3)]">
        <div className="absolute inset-0 grid grid-cols-7 grid-rows-5 gap-[3px] p-4 opacity-85">{Array.from({length:35}).map((_,index)=><div key={index} className={`${index%4===0?'bg-amber-100/80':'bg-blue-100/25'} border border-white/15`} />)}</div>
        <div className="absolute right-8 top-8 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-xl"><AstikanMark className="h-10 w-10" /><span className="text-xl font-extrabold text-navy-900">astikan</span></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

export function CompanyPage() {
  const products = [[AstikanMark,'Astikan','A unified health interface for everyday health.','/astikan'],[CreditCard,'Astikan Pay','A health-first UPI payment application.','/astikan-pay'],[Building2,'The Kiosk','A physical interface bringing health access closer.','/the-kiosk'],[FlaskConical,'Research','Research, science, and collaboration.','/research'],[Sparkles,'Future systems','New technologies designed around life.',null]];
  const leaders = [['Arjun Mehta','Founder & CEO'],['Priya Nair','COO'],['Rahul Sharma','CTO'],['Neha Verma','Head of Research'],['Vikram Singh','Head of Operations']];

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f5f8ff)] px-5 pb-16 pt-[120px] lg:px-8 lg:pb-24 lg:pt-[148px]"><div className="mx-auto grid max-w-[1380px] items-center gap-12 lg:grid-cols-[.8fr_1.2fr]"><div data-aos="fade-right"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-600">ABOUT ASTIKAN</p><h1 className="mt-6 text-5xl font-extrabold leading-[.98] tracking-[-0.055em] text-navy-900 sm:text-7xl">Building the world’s most <span className="text-blue-600">connected health ecosystem.</span></h1><p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Astikan builds products that connect people, information, and technology into clearer health experiences—digital, physical, and increasingly global.</p><div className="mt-9 grid gap-4 sm:grid-cols-3">{[[UsersRound,'People first'],[ShieldCheck,'Technology driven'],[HandHeart,'Purpose led']].map(([Icon,title])=><div key={title} className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Icon size={18} /></span><div><div className="text-xs font-extrabold text-navy-900">{title}</div><div className="mt-1 text-[10px] leading-5 text-slate-500">Built around real needs.</div></div></div>)}</div></div><CompanyVisual /></div></section>

        <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-[1380px] items-center gap-10 lg:grid-cols-[.75fr_1.25fr]"><div data-aos="fade-right"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">OUR STORY</p><h2 className="mt-4 text-4xl font-extrabold text-navy-900">A simple belief grew into a connected health world.</h2><p className="mt-5 text-base leading-8 text-slate-600">Astikan began with the idea that health experiences should be seamless, personal, and accessible. The product family now spans interfaces, payments, physical access, research, and future systems.</p></div><div className={`${cardClass} grid sm:grid-cols-2 lg:grid-cols-4`} data-aos="fade-left">{[[CalendarDays,'2021','Founded'],[UsersRound,'250+','Team members'],[Globe2,'10M+','Lives impacted'],[Rocket,'5+','Products']].map(([Icon,value,label],index)=><div key={label} className={`p-7 text-center ${index?'border-t border-slate-100 sm:border-l sm:border-t-0':''}`}><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Icon size={25} /></span><div className="mt-5 text-3xl font-extrabold text-navy-900">{value}</div><div className="mt-2 text-sm font-extrabold text-navy-900">{label}</div></div>)}</div></div></section>

        <section className="bg-[#f6f9ff] px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-[1380px]"><SectionTitle eyebrow="WHAT WE BUILD" title="A growing family of connected health products." center /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{products.map(([Icon,title,text,to],index)=>{const content=<><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">{title==='Astikan'?<AstikanMark className="h-12 w-12" />:<Icon size={26} />}</span><h3 className="mt-6 text-base font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{text}</p></>;return to?<a key={title} href={to} className={`${cardClass} block p-6 text-center transition hover:-translate-y-1`} data-aos="fade-up" data-aos-delay={index*55}>{content}</a>:<article key={title} className={`${cardClass} p-6 text-center`} data-aos="fade-up" data-aos-delay={index*55}>{content}</article>})}</div></div></section>

        <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-[1380px]"><SectionTitle eyebrow="OUR LEADERSHIP" title="Experienced people with a shared vision." center /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{leaders.map(([name,role],index)=><article key={name} className={`${cardClass} overflow-hidden p-4 text-center`} data-aos="fade-up" data-aos-delay={index*55}><div className="flex h-48 items-end justify-center rounded-[1.4rem] bg-[linear-gradient(145deg,#e9eef7,#ffffff)]"><div className="flex h-32 w-32 items-center justify-center rounded-full bg-[linear-gradient(145deg,#102c66,#315ea8)] text-white"><UsersRound size={58} strokeWidth={1.15} /></div></div><h3 className="mt-5 text-sm font-extrabold text-navy-900">{name}</h3><p className="mt-1 text-xs text-slate-500">{role}</p></article>)}</div></div></section>

        <section className="bg-[#f6f9ff] px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-[1380px] gap-6 lg:grid-cols-[.8fr_1.2fr_.8fr]"><div className={`${cardClass} p-7`} data-aos="fade-right"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">OUR CULTURE</p><h2 className="mt-4 text-3xl font-extrabold text-navy-900">Curious, collaborative, and deeply human.</h2><div className="mt-7 space-y-5">{[[UsersRound,'Collaborative'],[Network,'Inclusive'],[Target,'Impactful']].map(([Icon,title])=><div key={title} className="flex gap-3"><Icon className="h-6 w-6 shrink-0 text-blue-600" /><div><div className="text-sm font-extrabold text-navy-900">{title}</div><div className="mt-1 text-xs leading-5 text-slate-500">We build together and listen widely.</div></div></div>)}</div></div><div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#edf4ff,#d7e7ff)]" data-aos="fade-up"><div className="absolute inset-0 grid grid-cols-3 gap-5 p-8">{Array.from({length:6}).map((_,index)=><div key={index} className="flex items-center justify-center rounded-3xl bg-white/75"><UsersRound className="h-16 w-16 text-blue-500/70" /></div>)}</div></div><div className={`${cardClass} p-7`} data-aos="fade-left"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">OUR VALUES</p><div className="mt-7 space-y-5">{[[ShieldCheck,'Integrity'],[HandHeart,'Empathy'],[Lightbulb,'Innovation'],[Target,'Excellence']].map(([Icon,title])=><div key={title} className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Icon size={17} /></span><div><div className="text-sm font-extrabold text-navy-900">{title}</div><div className="mt-1 text-xs text-slate-500">A principle behind every product.</div></div></div>)}</div></div></div></section>
      </main>
    </div>
  );
}
