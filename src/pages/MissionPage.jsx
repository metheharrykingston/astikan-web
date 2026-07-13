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
  Stethoscope,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';

const shell = 'mx-auto w-full max-w-[1380px] px-5 lg:px-8';
const card = 'rounded-[1.35rem] border border-[#dce7f7] bg-white shadow-[0_14px_38px_rgba(26,64,125,.075)]';

const pillars = [
  [UsersRound, 'People First', 'We put people at the center of every decision, design, and innovation.', 'bg-emerald-50 text-emerald-600'],
  [ShieldCheck, 'Accessible for All', 'We break barriers of cost, distance, and complexity to make healthcare reach everyone.', 'bg-blue-50 text-blue-600'],
  [HeartPulse, 'Connected Care', 'We connect every aspect of health — people, data, providers, and technology seamlessly.', 'bg-rose-50 text-rose-500'],
  [Lightbulb, 'Innovation with Purpose', 'We use research and technology to solve real problems and create meaningful impact.', 'bg-violet-50 text-violet-600'],
  [Leaf, 'Sustainable Impact', 'We build for the long term with ethical, scalable, and environmentally conscious thinking.', 'bg-cyan-50 text-cyan-600'],
];

const impact = [
  [UsersRound, '10M+', 'Lives Touched', 'Across platforms globally', 'bg-blue-50 text-blue-600'],
  [Building2, '25K+', 'Healthcare Providers', 'Connected to our ecosystem', 'bg-emerald-50 text-emerald-600'],
  [HeartPulse, '50M+', 'Health Records', 'Managed securely and responsibly', 'bg-rose-50 text-rose-500'],
  [Globe2, '120+', 'Countries', 'Reaching communities worldwide', 'bg-orange-50 text-orange-500'],
  [FlaskConical, '48+', 'Research Projects', 'Driving innovation in healthcare', 'bg-violet-50 text-violet-600'],
];

const principles = [
  [ShieldCheck, 'Integrity', 'We do what’s right, always.'],
  [LockKeyhole, 'Privacy', 'We protect data like life.'],
  [UsersRound, 'Empathy', 'We listen, care, and understand.'],
  [Scale, 'Equity', 'We believe healthcare is a right, not a privilege.'],
  [Target, 'Excellence', 'We strive for the highest quality in everything.'],
];

function Person({ height, width = 48, tone = '#18345f', child = false }) {
  const head = child ? 30 : 38;
  return (
    <div className="relative flex shrink-0 flex-col items-center" style={{ width }}>
      <div className="rounded-full shadow-sm" style={{ width: head, height: head, background: tone }} />
      <div
        className="mt-2 rounded-t-[2rem] shadow-[0_12px_24px_rgba(8,35,78,.18)]"
        style={{ width, height, background: `linear-gradient(180deg,${tone},#0d2448)` }}
      />
    </div>
  );
}

function MissionHeroVisual() {
  const nodes = [
    [UsersRound, '14%', '25%'],
    [HeartPulse, '73%', '15%'],
    [Stethoscope, '20%', '54%'],
    [Building2, '82%', '43%'],
    [Leaf, '70%', '67%'],
  ];

  return (
    <div
      className="relative min-h-[390px] overflow-hidden bg-[linear-gradient(180deg,#acd4ff_0%,#e9f4ff_52%,#f7ead8_100%)] sm:min-h-[460px] lg:min-h-[505px]"
      data-aos="fade-left"
      role="img"
      aria-label="A family looking toward a connected global health network"
    >
      <div className="absolute inset-x-0 top-0 h-[44%] bg-[radial-gradient(circle_at_65%_15%,rgba(255,255,255,.95),transparent_42%)]" />
      <Globe2 className="absolute right-[7%] top-[7%] h-[73%] w-[72%] text-white/75" strokeWidth={0.52} />
      <div className="absolute right-[10%] top-[10%] h-[68%] w-[68%] rounded-full border border-white/55" />
      <div className="absolute right-[17%] top-[17%] h-[54%] w-[54%] rounded-full border border-dashed border-white/55" />

      {nodes.map(([Icon, left, top], index) => (
        <span
          key={`${left}-${top}`}
          className="absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/30 text-white shadow-[0_10px_30px_rgba(21,82,158,.15)] backdrop-blur-md"
          style={{ left, top }}
        >
          <Icon size={22} strokeWidth={1.5} />
          {index < nodes.length - 1 && <span className="absolute left-full top-1/2 hidden h-px w-20 rotate-[18deg] bg-white/55 sm:block" />}
        </span>
      ))}

      <div className="absolute inset-x-0 bottom-[24%] h-36 bg-[radial-gradient(ellipse_at_center,rgba(71,112,151,.2),transparent_62%)]" />
      <div className="absolute inset-x-[-8%] bottom-[15%] h-40 rounded-[50%] bg-[#7697b6]/28" />
      <div className="absolute inset-x-[-6%] bottom-[9%] h-32 rounded-[50%] bg-[#507695]/34" />
      <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,#8aa27f,#5d7754)]" />

      <div className="absolute bottom-[4%] left-1/2 z-20 flex -translate-x-1/2 items-end gap-3 sm:gap-5">
        <Person height={154} width={56} />
        <Person height={118} width={43} tone="#264b77" child />
        <Person height={86} width={36} tone="#d9ecff" child />
        <Person height={145} width={54} tone="#eef6ff" />
      </div>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/55 to-transparent lg:w-36" />
    </div>
  );
}

function GlobalMapVisual() {
  const points = [
    ['18%', '38%'], ['30%', '26%'], ['43%', '47%'], ['57%', '29%'], ['70%', '48%'], ['82%', '34%'], ['63%', '67%'], ['34%', '69%'],
  ];

  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-[1.2rem] bg-[radial-gradient(circle_at_center,#ffffff_0%,#edf5ff_74%)]" role="img" aria-label="Connected global health map">
      <Globe2 className="absolute inset-[4%] h-[92%] w-[92%] text-blue-200/85" strokeWidth={0.55} />
      <div className="absolute inset-[12%] rounded-full border border-dashed border-blue-200" />
      {points.map(([left, top], index) => (
        <span key={`${left}-${top}`} className="absolute h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,.12)]" style={{ left, top }}>
          {index < points.length - 1 && <span className="absolute left-2 top-1/2 h-px w-16 origin-left rotate-[12deg] bg-blue-300/55" />}
        </span>
      ))}
    </div>
  );
}

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] pt-[76px]">
          <div className="grid min-h-[505px] lg:grid-cols-[.44fr_.56fr]">
            <div className="relative z-10 flex items-center px-5 py-14 lg:justify-end lg:px-10 lg:py-12">
              <div className="w-full max-w-[570px]" data-aos="fade-right">
                <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-blue-600">OUR MISSION</p>
                <h1 className="mt-6 text-[3.05rem] font-extrabold leading-[.98] tracking-[-.055em] text-[#0b285b] sm:text-[3.75rem] lg:text-[4rem] xl:text-[4.25rem]">
                  Better health for<br />
                  <span className="text-blue-600">every life, everywhere.</span>
                </h1>
                <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-slate-600">
                  Our mission is to make quality healthcare accessible, affordable, and connected for everyone. Through technology, innovation, and compassion, we are building a world where no one is left behind.
                </p>
                <div className="mt-7 space-y-3.5">
                  {[
                    [HeartPulse, 'Accessible healthcare for all'],
                    [UsersRound, 'Technology that empowers'],
                    [Globe2, 'Global impact, local care'],
                  ].map(([Icon, label]) => (
                    <div key={label} className="flex items-center gap-3 text-[13px] font-extrabold text-[#0b285b]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm">
                        <Icon size={18} strokeWidth={1.7} />
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <MissionHeroVisual />
          </div>
        </section>

        <section className="px-5 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[1380px]">
            <div className="text-center" data-aos="fade-up">
              <h2 className="text-[2rem] font-extrabold tracking-[-.035em] text-[#0b285b]">Our Mission Pillars</h2>
              <p className="mt-3 text-sm text-slate-500">Five pillars guide everything we do at Astikan.</p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {pillars.map(([Icon, title, text, accent], index) => (
                <article key={title} className={`${card} min-h-[260px] p-6 text-center`} data-aos="fade-up" data-aos-delay={index * 55}>
                  <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${accent}`}><Icon size={29} strokeWidth={1.5} /></span>
                  <h3 className="mt-6 text-[15px] font-extrabold text-[#0b285b]">{title}</h3>
                  <p className="mt-4 text-[11px] leading-5 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-6 lg:px-8 lg:pb-8">
          <div className="mx-auto max-w-[1380px] rounded-[1.45rem] bg-[linear-gradient(135deg,#f5f9ff,#edf5ff)] p-7 sm:p-9" data-aos="fade-up">
            <h2 className="text-2xl font-extrabold text-[#0b285b]">Our Impact, Every Day</h2>
            <p className="mt-2 text-sm text-slate-500">Building a healthier world, one life at a time.</p>
            <div className="mt-7 grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
              {impact.map(([Icon, value, title, text, accent], index) => (
                <article key={title} className={`min-w-0 py-4 sm:px-5 lg:px-7 ${index ? 'border-t border-blue-100 sm:border-l sm:border-t-0' : ''}`}>
                  <div className="flex items-center gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent}`}><Icon size={21} strokeWidth={1.55} /></span><strong className="text-[2rem] font-extrabold tracking-[-.04em] text-[#0b285b]">{value}</strong></div>
                  <h3 className="mt-4 text-[12px] font-extrabold text-[#0b285b]">{title}</h3>
                  <p className="mt-2 text-[10px] leading-5 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto grid max-w-[1380px] items-center gap-8 rounded-[1.45rem] border border-[#dce7f7] bg-[linear-gradient(135deg,#ffffff,#f4f8ff)] p-7 lg:grid-cols-[.72fr_1.3fr_.78fr] lg:p-9" data-aos="fade-up">
            <div>
              <h2 className="text-[2rem] font-extrabold tracking-[-.035em] text-[#0b285b]">A Global Vision</h2>
              <p className="mt-5 text-[12px] leading-6 text-slate-600">We envision a world where every individual, regardless of where they live, can access quality healthcare and lead a healthier, happier life.</p>
              <a href="/company" className="mt-6 inline-flex items-center gap-3 rounded-lg border border-blue-500 bg-white px-4 py-2.5 text-[11px] font-extrabold text-blue-600 transition hover:bg-blue-50">See Our Journey <TrendingUp size={15} /></a>
            </div>
            <GlobalMapVisual />
            <div className="space-y-5 lg:border-l lg:border-blue-100 lg:pl-8">
              {[
                [MapPin, 'Local Solutions', 'Built for local needs, culturally and contextually.'],
                [HandHeart, 'Strong Partnerships', 'Collaborating with institutions, governments, and communities.'],
                [Rocket, 'Scalable Technology', 'Building platforms that grow with the world.'],
              ].map(([Icon, title, text]) => (
                <div key={title} className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm"><Icon size={20} strokeWidth={1.6} /></span><div><h3 className="text-[13px] font-extrabold text-[#0b285b]">{title}</h3><p className="mt-1 text-[11px] leading-5 text-slate-500">{text}</p></div></div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-14 pt-6 lg:px-8 lg:pb-20 lg:pt-8">
          <div className={shell}>
            <div className="text-center" data-aos="fade-up"><h2 className="text-2xl font-extrabold text-[#0b285b]">Our Principles</h2><p className="mt-2 text-sm text-slate-500">The values that keep us true to our mission.</p></div>
            <div className="mt-8 grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
              {principles.map(([Icon, title, text], index) => (
                <article key={title} className={`px-6 py-4 text-center ${index ? 'border-t border-blue-100 sm:border-l sm:border-t-0' : ''}`} data-aos="fade-up" data-aos-delay={index * 50}><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={22} strokeWidth={1.6} /></span><h3 className="mt-4 text-[13px] font-extrabold text-[#0b285b]">{title}</h3><p className="mx-auto mt-2 max-w-[170px] text-[11px] leading-5 text-slate-500">{text}</p></article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
