import {
  Atom,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Dna,
  FileHeart,
  Globe2,
  HeartPulse,
  MapPin,
  Microscope,
  Pill,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TestTube2,
  WifiOff,
} from 'lucide-react';

type TechnologyVariant = 'astikan' | 'pay' | 'kiosk' | 'research';

interface TechnologyHighlightsProps {
  variant: TechnologyVariant;
}

const content = {
  astikan: {
    eyebrow: 'HEALTH TECHNOLOGY IN PRACTICE',
    title: 'A clearer digital foundation for everyday care.',
    text: 'Astikan turns complex health activity into one understandable experience that supports people before, during, and after care.',
    items: [
      [CalendarDays, 'Care planning', 'Book care and keep appointments easy to follow.'],
      [FileHeart, 'Health records', 'Keep reports and important information in one place.'],
      [HeartPulse, 'Personal guidance', 'Follow routines, care plans, and daily health moments.'],
      [Stethoscope, 'Care access', 'Reach doctors, diagnostics, and hospitals more easily.'],
    ],
  },
  pay: {
    eyebrow: 'PAYMENT TECHNOLOGY',
    title: 'Healthcare payments designed around real life.',
    text: 'Astikan Pay makes medical expenses easier to understand, complete, revisit, and manage for individuals and families.',
    items: [
      [CreditCard, 'Clear payments', 'Pay medical bills through one familiar interface.'],
      [ReceiptText, 'Organised history', 'Find receipts, refunds, and payment activity quickly.'],
      [CircleDollarSign, 'Financial support', 'Make care financing and assistance easier to navigate.'],
      [ShieldCheck, 'Protected access', 'Keep every healthcare payment clear and secure.'],
    ],
  },
  kiosk: {
    eyebrow: 'THE PHYSICAL ACCESS LAYER',
    title: 'Health technology beyond the smartphone.',
    text: 'Astikan Health Kiosks bring assisted digital care into communities, workplaces, transport hubs, and regions where personal devices are not enough.',
    items: [
      [ScanLine, 'Guided screening', 'Support simple measurements and structured health checks.'],
      [Stethoscope, 'Care assistance', 'Help people reach doctors, diagnostics, and support.'],
      [WifiOff, 'Resilient access', 'Designed for locations where internet access may be unreliable.'],
      [MapPin, 'Community deployment', 'Built for public spaces, workplaces, and rural communities.'],
    ],
  },
  research: {
    eyebrow: 'FRONTIER RESEARCH',
    title: 'Exploring what healthcare can become next.',
    text: 'These are long term research directions, not product promises. Each begins with evidence, careful validation, and human safety.',
    items: [
      [Syringe, 'Robotic surgery', 'Study precision systems that strengthen clinician control and access.'],
      [Atom, 'Medical nanotechnology', 'Explore microscopic sensing and targeted intervention.'],
      [Pill, 'Responsive therapeutics', 'Investigate medicines that respond intelligently to changing needs.'],
      [Dna, 'Regenerative systems', 'Research technologies that may restore tissue and function.'],
    ],
  },
} as const;

const researchPrinciples = [
  [Microscope, 'Research first'],
  [TestTube2, 'Validate carefully'],
  [ShieldCheck, 'Safety before scale'],
  [Globe2, 'Build for access'],
] as const;

export default function TechnologyHighlights({ variant }: TechnologyHighlightsProps) {
  const section = content[variant];
  const dark = variant === 'research';

  return (
    <section className={`relative overflow-hidden px-5 py-16 sm:py-24 lg:px-8 ${dark ? 'bg-[#041a3d] text-white' : 'bg-slate-50'}`}>
      <div className="absolute -right-24 top-0 h-80 w-80 rounded-full border border-blue-300/20" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1380px]">
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <p className={`text-xs font-extrabold uppercase tracking-[0.2em] ${dark ? 'text-cyan-300' : 'text-gold-500'}`}>{section.eyebrow}</p>
          <h2 className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-navy-900'}`}>{section.title}</h2>
          <p className={`mt-5 text-base leading-8 ${dark ? 'text-blue-100/70' : 'text-slate-600'}`}>{section.text}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map(([Icon, title, text], index) => (
            <article key={title} className={`rounded-2xl p-6 ${dark ? 'border border-white/10 bg-white/[.05]' : 'border border-slate-200 bg-white shadow-card'}`} data-aos="zoom-in-up" data-aos-delay={index * 70}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? 'bg-cyan-300/10 text-cyan-300' : 'bg-blue-50 text-blue-600'}`}><Icon size={24} strokeWidth={1.5} /></span>
              <h3 className={`mt-5 text-lg font-extrabold ${dark ? 'text-white' : 'text-navy-900'}`}>{title}</h3>
              <p className={`mt-3 text-sm leading-7 ${dark ? 'text-blue-100/60' : 'text-slate-500'}`}>{text}</p>
            </article>
          ))}
        </div>

        {variant === 'research' && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
            {researchPrinciples.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-bold text-blue-100"><Icon size={18} className="text-cyan-300" />{label}</div>)}
          </div>
        )}
      </div>
    </section>
  );
}
