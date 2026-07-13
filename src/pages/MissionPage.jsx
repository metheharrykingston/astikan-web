import React from 'react';
import {
  Building2,
  FlaskConical,
  Globe2,
  HandHeart,
  HeartPulse,
  Leaf,
  Lightbulb,
  LockKeyhole,
  MapPin,
  Network,
  Rocket,
  Scale,
  ShieldCheck,
  Target,
  UsersRound,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';

const cardClass = 'rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(31,70,130,.08)]';

function MissionVisual() {
  const nodes = [
    [UsersRound, 12, 22],
    [HeartPulse, 71, 16],
    [Network, 82, 48],
    [HandHeart, 25, 54],
    [Leaf, 61, 66],
  ];

  return (
    <div className="relative mx-auto min-h-[500px] w-full max-w-[760px]" data-aos="fade-left">
      <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_55%_35%,rgba(255,255,255,.9),transparent_28%),linear-gradient(180deg,#d8ebff,#f9f3e9)]" />
      <Globe2 className="absolute right-[3%] top-[2%] h-[82%] w-[82%] text-white/80" strokeWidth={0.55} />
      <div className="absolute inset-[9%] rounded-full border border-white/70" />
      {nodes.map(([Icon, left, top]) => (
        <span key={`${left}-${top}`} className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/30 text-white backdrop-blur-lg" style={{ left: `${left}%`, top: `${top}%` }}>
          <Icon size={22} />
        </span>
      ))}
      <div className="absolute bottom-[5%] left-1/2 flex -translate-x-1/2 items-end gap-4">
        {[120, 145, 88, 118].map((height, index) => (
          <div key={height} className="relative w-16">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#18355f]" />
            <div className="mx-auto mt-2 rounded-t-3xl bg-[#18355f]" style={{ height, width: index === 1 ? 60 : 52 }} />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/85 to-transparent" />
    </div>
  );
}

export default function MissionPage() {
  const pillars = [
    [UsersRound, 'People First', 'We put people at the centre of every decision, design, and innovation.', 'bg-emerald-50 text-emerald-600'],
    [ShieldCheck, 'Accessible for All', 'We reduce barriers of cost, distance, and complexity.', 'bg-blue-50 text-blue-600'],
    [HeartPulse, 'Connected Care', 'We connect people, information, providers, and technology.', 'bg-rose-50 text-rose-500'],
    [Lightbulb, 'Innovation with Purpose', 'We use research and technology to solve real problems.', 'bg-violet-50 text-violet-600'],
    [Leaf, 'Sustainable Impact', 'We build for the long term with ethical and scalable thinking.', 'bg-cyan-50 text-cyan-600'],
  ];

  const impact = [
    [UsersRound, '10M+', 'Lives touched'],
    [Building2, '25K+', 'Healthcare providers'],
    [HeartPulse, '50M+', 'Health records'],
    [Globe2, '120+', 'Countries'],
    [FlaskConical, '48+', 'Research projects'],
  ];

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff,#ffffff)] px-5 pb-16 pt-[120px] lg:px-8 lg:pb-24 lg:pt-[148px]">
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
            <div data-aos="fade-right">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">OUR MISSION</p>
              <h1 className="mt-6 text-5xl font-extrabold leading-[.98] tracking-[-0.055em] text-navy-900 sm:text-7xl">Better health for<br /><span className="text-blue-600">every life, everywhere.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Our mission is to make quality health experiences more accessible, affordable, understandable, and connected for every form of life we can reach.</p>
              <div className="mt-8 space-y-4">
                {[[HeartPulse, 'Accessible health for all'], [UsersRound, 'Technology that empowers'], [Globe2, 'Global impact, local care']].map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-3 text-sm font-extrabold text-navy-900"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={18} /></span>{label}</div>
                ))}
              </div>
            </div>
            <MissionVisual />
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1380px]">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">OUR MISSION PILLARS</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-navy-900 sm:text-5xl">Five pillars guide everything we build.</h2></div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {pillars.map(([Icon, title, text, accent], index) => <article key={title} className={`${cardClass} p-7 text-center`} data-aos="fade-up" data-aos-delay={index * 60}><span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${accent}`}><Icon size={28} /></span><h3 className="mt-6 text-base font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f8ff] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1380px]">
            <div data-aos="fade-up"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">OUR IMPACT, EVERY DAY</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-navy-900">Building a healthier world, one life at a time.</h2></div>
            <div className={`${cardClass} mt-12 grid overflow-hidden sm:grid-cols-2 lg:grid-cols-5`} data-aos="fade-up">
              {impact.map(([Icon, value, label], index) => <div key={label} className={`p-6 ${index ? 'border-t border-slate-100 sm:border-l sm:border-t-0' : ''}`}><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon size={21} /></span><div className="text-3xl font-extrabold tracking-tight text-navy-900">{value}</div></div><div className="mt-4 text-sm font-extrabold text-navy-900">{label}</div><div className="mt-2 text-xs leading-5 text-slate-500">Connected through Astikan systems</div></div>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-[1380px] items-center gap-10 rounded-[2.4rem] border border-blue-100 bg-[linear-gradient(135deg,#ffffff,#eef5ff)] p-8 lg:grid-cols-[.8fr_1.2fr_.7fr] lg:p-12" data-aos="fade-up">
            <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">A GLOBAL VISION</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight text-navy-900">Health access without borders.</h2><p className="mt-5 text-sm leading-7 text-slate-600">A world where every individual can understand and navigate health with confidence, wherever they live.</p></div>
            <div className="relative min-h-[300px]"><Globe2 className="absolute inset-0 h-full w-full text-blue-200" strokeWidth={0.6} />{[[15,35],[34,23],[51,44],[67,28],[78,56],[28,67]].map(([left,top]) => <span key={`${left}-${top}`} className="absolute h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_0_7px_rgba(59,130,246,.12)]" style={{left:`${left}%`,top:`${top}%`}} />)}</div>
            <div className="space-y-5">{[[MapPin,'Local solutions'],[HandHeart,'Strong partnerships'],[Rocket,'Scalable technology']].map(([Icon,title]) => <div key={title} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm"><Icon size={20} /></span><div><h3 className="text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">Built for real needs and designed to grow responsibly.</p></div></div>)}</div>
          </div>
        </section>

        <section className="bg-[#f8faff] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1380px]">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-blue-600">OUR PRINCIPLES</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-navy-900">The values that keep us true to the mission.</h2></div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{[[ShieldCheck,'Integrity','We do what is right.'],[LockKeyhole,'Privacy','We protect data like life.'],[UsersRound,'Empathy','We listen and understand.'],[Scale,'Equity','Health should be reachable.'],[Target,'Excellence','We pursue meaningful quality.']].map(([Icon,title,text],index) => <article key={title} className="p-6 text-center" data-aos="fade-up" data-aos-delay={index*55}><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={22} /></span><h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></article>)}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
