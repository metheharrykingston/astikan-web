import React from 'react';
import {
  Activity,
  ArrowRight,
  Brain,
  Building2,
  Dna,
  Eye,
  FileText,
  FlaskConical,
  Globe2,
  HeartPulse,
  Leaf,
  LockKeyhole,
  Microscope,
  Network,
  Plus,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import TechnologyHighlights from '../components/TechnologyHighlights';

const shell = 'mx-auto w-full max-w-[1380px] px-5 lg:px-8';
const card = 'rounded-[1.35rem] border border-[#dce7f7] bg-white shadow-[0_14px_38px_rgba(26,64,125,.075)]';

const stats = [
  [FlaskConical, '48+', 'Research Projects', 'Across health domains', 'bg-blue-50 text-blue-600'],
  [UsersRound, '120+', 'Research Partners', 'Hospitals, labs & institutions', 'bg-emerald-50 text-emerald-600'],
  [FileText, '250+', 'Publications', 'In peer-reviewed journals', 'bg-violet-50 text-violet-600'],
  [UsersRound, '15K+', 'Participants', 'In research studies', 'bg-orange-50 text-orange-500'],
  [Globe2, '12+', 'Countries', 'Global research footprint', 'bg-blue-50 text-blue-600'],
];

const focusAreas = [
  [HeartPulse, 'Preventive\nHealth', 'Understanding risks and building preventive strategies.', 'bg-rose-50 text-rose-500'],
  [Brain, 'Chronic Disease\nManagement', 'Researching better outcomes for long-term conditions.', 'bg-blue-50 text-blue-600'],
  [Dna, 'Genomics &\nPrecision Health', 'Personalized insights through genetic research.', 'bg-emerald-50 text-emerald-600'],
  [Sparkles, 'AI & Data\nScience', 'Leveraging data and AI to drive health innovation.', 'bg-violet-50 text-violet-600'],
  [Leaf, 'Mental\nWellbeing', 'Advancing research in mental health and behavior.', 'bg-cyan-50 text-cyan-600'],
  [Plus, 'Healthcare\nAccess', 'Improving access and equity in healthcare.', 'bg-orange-50 text-orange-500'],
];

const studies = [
  {
    icon: HeartPulse,
    title: 'AI-based Early Detection of Hypertension',
    text: 'Using machine learning to identify early patterns and enable timely intervention.',
    participants: '2,340',
    centers: '18',
    status: 'Active',
    tone: 'blue',
  },
  {
    icon: Activity,
    title: 'Gut Microbiome & Metabolic Health',
    text: 'Studying the impact of gut health on metabolism and chronic disease risk.',
    participants: '1,870',
    centers: '12',
    status: 'Active',
    tone: 'green',
  },
  {
    icon: Brain,
    title: 'Digital Therapeutics for Anxiety & Stress',
    text: 'Evaluating digital interventions for improving mental wellbeing at scale.',
    participants: '1,120',
    centers: '10',
    status: 'Recruiting',
    tone: 'violet',
  },
];

function ResearchHeroVisual() {
  return (
    <div className="relative min-h-[430px] overflow-hidden bg-[radial-gradient(circle_at_72%_32%,rgba(119,191,255,.82),transparent_43%),linear-gradient(135deg,#f4f9ff_0%,#cde6ff_48%,#8dc5ff_100%)] lg:min-h-[500px]" data-aos="fade-left">
      <Globe2 className="absolute -right-[5%] top-[7%] h-[78%] w-[58%] text-white/45" strokeWidth={0.45} />
      <div className="absolute right-[10%] top-[8%] h-[66%] w-[48%] rounded-[1.6rem] border border-white/55 bg-white/10 p-5 shadow-[0_25px_70px_rgba(29,92,170,.18)] backdrop-blur-[2px]">
        <div className="grid h-full grid-cols-2 gap-3">
          {[Activity, Dna, Globe2, HeartPulse, Network, Brain].map((Icon, index) => (
            <div key={index} className="rounded-xl border border-white/35 bg-white/10 p-3">
              <Icon className="h-7 w-7 text-white/85" strokeWidth={1.2} />
              <div className="mt-4 h-1.5 rounded-full bg-white/45" />
              <div className="mt-2 h-1.5 w-2/3 rounded-full bg-white/25" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[7%] left-[17%] z-10 flex h-[330px] w-[275px] items-center justify-center rounded-[2.1rem] bg-white/92 shadow-[0_35px_80px_rgba(13,48,98,.28)] sm:left-[22%] lg:left-[12%]">
        <Microscope className="h-[245px] w-[245px] text-[#102850]" strokeWidth={1.1} />
      </div>

      <div className="absolute bottom-[5%] left-[2%] flex items-end gap-3 opacity-90">
        {[102, 142, 116].map((height, index) => (
          <div key={index} className="relative w-12 rounded-b-2xl border border-blue-300/70 bg-white/55" style={{ height }}>
            <div className="absolute inset-x-1 bottom-1 h-1/2 rounded-b-xl bg-blue-500/35" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-[4%] right-[5%] flex items-end gap-2.5 opacity-95">
        {[112, 138, 124, 150, 129, 142].map((height, index) => (
          <div key={index} className="relative w-8 rounded-b-lg border border-blue-200 bg-white/55" style={{ height }}>
            <div className="absolute inset-x-1 bottom-1 h-[64%] rounded-b-md bg-blue-500/45" />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
    </div>
  );
}

function StatStrip() {
  return (
    <div className={`${card} grid overflow-hidden sm:grid-cols-2 lg:grid-cols-5`} data-aos="fade-up">
      {stats.map(([Icon, value, title, text, accent], index) => (
        <article key={title} className={`min-w-0 px-6 py-7 ${index ? 'border-t border-slate-100 sm:border-l sm:border-t-0' : ''}`}>
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent}`}><Icon size={21} strokeWidth={1.6} /></span>
            <strong className="text-[2rem] font-extrabold tracking-[-.04em] text-[#0b285b]">{value}</strong>
          </div>
          <h3 className="mt-4 text-[13px] font-extrabold text-[#0b285b]">{title}</h3>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">{text}</p>
        </article>
      ))}
    </div>
  );
}

function StudyCard({ study, index }) {
  const Icon = study.icon;
  const tones = {
    blue: ['bg-blue-50 text-blue-700', 'text-blue-300', 'bg-blue-100/70'],
    green: ['bg-emerald-50 text-emerald-700', 'text-emerald-300', 'bg-emerald-100/70'],
    violet: ['bg-indigo-50 text-indigo-700', 'text-indigo-300', 'bg-indigo-100/70'],
  };
  const [badge, iconTone, circle] = tones[study.tone];

  return (
    <article className="relative min-h-[300px] overflow-hidden rounded-[1.25rem] border border-[#dce7f7] bg-white p-6 shadow-sm" data-aos="fade-up" data-aos-delay={index * 70}>
      <span className={`inline-flex rounded-full px-3 py-1 text-[9px] font-extrabold ${badge}`}>{study.status}</span>
      <div className={`absolute right-4 top-12 flex h-36 w-36 items-center justify-center rounded-full ${circle}`}>
        <Icon className={`h-24 w-24 ${iconTone}`} strokeWidth={0.9} />
      </div>
      <div className="relative z-10 max-w-[68%]">
        <h3 className="mt-5 text-[17px] font-extrabold leading-6 text-[#0b285b]">{study.title}</h3>
        <p className="mt-4 text-[11px] leading-5 text-slate-500">{study.text}</p>
      </div>
      <div className="absolute inset-x-6 bottom-5 grid grid-cols-2 border-t border-slate-100 pt-4">
        <div><div className="text-[9px] text-slate-400">Participants</div><div className="mt-1 text-lg font-extrabold text-blue-700">{study.participants}</div></div>
        <div className="border-l border-slate-100 pl-5"><div className="text-[9px] text-slate-400">Centers</div><div className="mt-1 text-lg font-extrabold text-blue-700">{study.centers}</div></div>
      </div>
    </article>
  );
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_78%,#ffffff_100%)] pt-[76px]">
          <div className="grid min-h-[500px] lg:grid-cols-[.41fr_.59fr]">
            <div className="relative z-10 flex items-center px-5 py-14 lg:justify-end lg:px-8 lg:py-16">
              <div className="w-full max-w-[500px]" data-aos="fade-right">
                <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-blue-600">RESEARCH FOR A HEALTHIER TOMORROW</p>
                <h1 className="mt-6 text-[3.25rem] font-extrabold leading-[.98] tracking-[-.055em] text-[#0a285b] sm:text-[4.2rem] lg:text-[4.65rem]">Advancing knowledge.<br /><span className="text-blue-600">Improving lives.</span></h1>
                <p className="mt-7 max-w-[430px] text-[15px] leading-7 text-slate-600">At Astikan, research drives everything we do. We combine real-world data, technology, and scientific collaboration to solve tomorrow&apos;s health challenges today.</p>
                <div className="mt-7 space-y-3.5">
                  {[[FileText, 'Evidence-based insights'], [UsersRound, 'Collaborative innovation'], [ShieldCheck, 'Ethical & responsible research']].map(([Icon, label]) => (
                    <div key={label} className="flex items-center gap-3 text-[13px] font-extrabold text-[#0b285b]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm"><Icon size={18} strokeWidth={1.7} /></span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ResearchHeroVisual />
          </div>
          <div className={`${shell} relative z-20 -mt-3 pb-10 lg:-mt-8`}><StatStrip /></div>
        </section>

        <section className="px-5 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[1380px]">
            <div className="text-center" data-aos="fade-up">
              <h2 className="text-[2rem] font-extrabold tracking-[-.035em] text-[#0b285b]">Our Research Focus</h2>
              <p className="mt-3 text-sm text-slate-500">Exploring critical areas to shape the future of healthcare</p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {focusAreas.map(([Icon, title, text, accent], index) => (
                <article key={title} className={`${card} min-h-[250px] p-6 text-center`} data-aos="fade-up" data-aos-delay={index * 50}>
                  <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${accent}`}><Icon size={27} strokeWidth={1.5} /></span>
                  <h3 className="mt-6 whitespace-pre-line text-[15px] font-extrabold leading-5 text-[#0b285b]">{title}</h3>
                  <p className="mt-4 text-[11px] leading-5 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <TechnologyHighlights variant="research" />

        <section className="px-5 pb-10 lg:px-8">
          <div className="mx-auto max-w-[1380px] rounded-[1.5rem] bg-[linear-gradient(135deg,#f5f9ff,#edf5ff)] p-5 sm:p-7" data-aos="fade-up">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-extrabold text-[#0b285b]">Ongoing Research</h2>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-600">View all research <ArrowRight size={15} /></span>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {studies.map((study, index) => <StudyCard key={study.title} study={study} index={index} />)}
            </div>
          </div>
        </section>

        <section className="px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1380px]">
            <h2 className="text-center text-xl font-extrabold text-[#0b285b]" data-aos="fade-up">Our Research Partners</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {[
                ['AIIMS', 'New Delhi'],
                ['Indian Institute of Science', 'Bengaluru'],
                ['TATA', 'Medical Center'],
                ['MAX', 'Healthcare'],
                ['Manipal', 'Hospitals'],
                ['+ 120+', 'More Partners'],
              ].map(([name, detail], index) => (
                <div key={name} className="flex min-h-[82px] items-center justify-center rounded-xl border border-[#dce7f7] bg-white px-4 text-center shadow-sm" data-aos="fade-up" data-aos-delay={index * 45}>
                  <div><div className={`font-extrabold ${index === 5 ? 'text-blue-600' : 'text-[#0b285b]'} ${name.length > 16 ? 'text-[11px]' : 'text-lg'}`}>{name}</div><div className="mt-1 text-[10px] text-slate-500">{detail}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-14 pt-4 lg:px-8 lg:pb-20">
          <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-[1.5rem] border border-blue-100 bg-[linear-gradient(135deg,#edf5ff_0%,#ffffff_48%,#e6f0ff_100%)] lg:grid-cols-[1.1fr_2.2fr]" data-aos="fade-up">
            <div className="p-7 lg:p-9">
              <h2 className="text-2xl font-extrabold text-[#0b285b]">Our Commitment</h2>
              <p className="mt-4 max-w-sm text-[12px] leading-6 text-slate-600">We are committed to ethical, transparent, and impactful research that puts people first.</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-lg border border-blue-500 bg-white px-4 py-2.5 text-[11px] font-extrabold text-blue-600">Our Research Policy <ArrowRight size={14} /></span>
            </div>
            <div className="grid border-t border-blue-100 sm:grid-cols-2 lg:grid-cols-4 lg:border-l lg:border-t-0">
              {[
                [ShieldCheck, 'Ethical Research', 'We follow the highest ethical standards.'],
                [LockKeyhole, 'Data Privacy', 'Protecting participant privacy is our priority.'],
                [Eye, 'Transparency', 'We are open about our methods and findings.'],
                [Globe2, 'Global Impact', 'Research that creates real-world change.'],
              ].map(([Icon, title, text], index) => (
                <article key={title} className={`p-7 ${index ? 'border-t border-blue-100 sm:border-l sm:border-t-0' : ''}`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={20} /></span>
                  <h3 className="mt-5 text-sm font-extrabold text-[#0b285b]">{title}</h3>
                  <p className="mt-3 text-[11px] leading-5 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
