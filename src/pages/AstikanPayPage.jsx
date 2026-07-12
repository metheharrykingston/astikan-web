import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Activity,
  BadgeCheck,
  BellRing,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  FlaskConical,
  Globe2,
  HeartHandshake,
  HeartPulse,
  Hospital,
  IndianRupee,
  Landmark,
  LockKeyhole,
  Pill,
  QrCode,
  ReceiptText,
  RotateCcw,
  ScanLine,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  UserRound,
  UsersRound,
  WalletCards,
  Zap,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import { AstikanMark } from '../components/AstikanLogo';

const paymentMoments = [
  [WalletCards, 'UPI payments', 'Send money, pay bills, or pay any UPI merchant through one familiar flow.', 'bg-blue-50 text-blue-600'],
  [Hospital, 'Health bills', 'Pay hospitals, clinics, laboratories, pharmacies, and health stores.', 'bg-indigo-50 text-indigo-600'],
  [ReceiptText, 'Receipts and refunds', 'Keep transaction receipts, refund updates, and payment history organised.', 'bg-cyan-50 text-cyan-600'],
  [UsersRound, 'Family payments', 'Pay for parents, children, and family health needs from one place.', 'bg-violet-50 text-violet-600'],
  [Pill, 'Medicine purchases', 'Pay for medicines and pharmacy bills with a clear health context.', 'bg-emerald-50 text-emerald-600'],
  [Zap, 'Emergency quick pay', 'Scan, choose an account, and complete a payment in a few calm steps.', 'bg-orange-50 text-orange-500'],
];

const ecosystemLeft = [
  [Hospital, 'Hospitals and clinics', 'Consultations, procedures, and hospital bills'],
  [FlaskConical, 'Diagnostics and labs', 'Tests, scans, and health check-ups'],
  [Pill, 'Pharmacies', 'Medicines and pharmacy purchases'],
  [HeartHandshake, 'Family support', 'Payments made for loved ones'],
];

const ecosystemRight = [
  [ShieldCheck, 'Health plans', 'Health-plan and coverage payments'],
  [Store, 'Everyday UPI', 'Shops, recharges, and normal UPI payments'],
  [QrCode, 'QR payments', 'Any supported UPI QR code'],
  [ReceiptText, 'Receipts and history', 'One organised payment timeline'],
];

const designPrinciples = [
  [IndianRupee, 'UPI-first', 'A familiar payment language for everyday transactions.'],
  [ReceiptText, 'Organised receipts', 'Payments, receipts, refunds, and reminders stay together.'],
  [HeartPulse, 'Health-focused', 'Health expenses are easier to understand and revisit.'],
  [UsersRound, 'Family support', 'Payments for loved ones remain clear and manageable.'],
  [Sparkles, 'Calm interface', 'A simple visual system without unnecessary financial noise.'],
];

function PayMark({ className = 'h-16 w-16' }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-[28%] bg-gradient-to-br from-[#132d70] via-[#204bc4] to-[#63258f] shadow-[0_18px_45px_rgba(21,59,150,.28)] ${className}`}>
      <AstikanMark className="h-[66%] w-[66%]" iconOnly />
      <span className="absolute bottom-[8%] text-[8px] font-black tracking-[.14em] text-white sm:text-[9px]">PAY</span>
    </div>
  );
}

function PhoneShell({ children, className = '' }) {
  return (
    <div className={`relative w-[190px] rounded-[2.3rem] border-[7px] border-[#0b1020] bg-white p-2 shadow-[0_30px_70px_rgba(2,20,63,.24)] ${className}`}>
      <div className="absolute left-1/2 top-2 z-20 h-5 w-16 -translate-x-1/2 rounded-full bg-[#0b1020]" />
      <div className="min-h-[400px] overflow-hidden rounded-[1.8rem] bg-[#f7f9fe] pt-7">{children}</div>
    </div>
  );
}

function MiniNav({ active = 'home' }) {
  return (
    <div className="mt-auto grid grid-cols-4 border-t border-slate-100 bg-white px-2 py-3 text-center text-[7px] font-bold text-slate-400">
      {['home', 'pay', 'scan', 'profile'].map((item) => (
        <div key={item} className={active === item ? 'text-blue-700' : ''}>
          <span className={`mx-auto mb-1 block h-2.5 w-2.5 rounded-full ${active === item ? 'bg-blue-600' : 'bg-slate-200'}`} />
          {item}
        </div>
      ))}
    </div>
  );
}

function HomePhone() {
  return (
    <PhoneShell className="z-20 lg:-rotate-2">
      <div className="flex min-h-[400px] flex-col px-3">
        <div className="flex items-center justify-between text-[8px] font-bold text-navy-900"><span>Home</span><BellRing size={11} /></div>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-navy-900 to-blue-700 p-4 text-white">
          <div className="text-[8px] text-blue-100">UPI balance</div>
          <div className="mt-1 text-2xl font-extrabold">₹12,450</div>
          <div className="mt-3 flex justify-between text-[7px] text-blue-100"><span>harry@astikan</span><ShieldCheck size={12} /></div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[ScanLine, Send, CreditCard, Landmark].map((Icon, index) => <div key={index} className="rounded-xl bg-white p-2 text-center shadow-sm"><Icon className="mx-auto text-blue-600" size={14} /><div className="mt-1 text-[6px] text-slate-500">{['Scan', 'Send', 'Bill', 'Bank'][index]}</div></div>)}
        </div>
        <div className="mt-4 text-[8px] font-extrabold text-navy-900">Pay for health</div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[Hospital, FlaskConical, Pill, UsersRound].map((Icon, index) => <div key={index} className="rounded-xl border border-slate-100 bg-white p-2 text-center"><Icon className="mx-auto text-emerald-500" size={13} /><div className="mt-1 text-[6px] text-slate-500">{['Hospital', 'Labs', 'Medicine', 'Family'][index]}</div></div>)}
        </div>
        <div className="mt-4 space-y-2">
          {['CityCare Hospital', 'HealthPlus Lab', 'MediPlus Pharmacy'].map((name, index) => <div key={name} className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-sm"><div><div className="text-[7px] font-bold text-navy-900">{name}</div><div className="mt-1 text-[6px] text-slate-400">Paid recently</div></div><div className="text-[8px] font-extrabold text-navy-900">₹{[2450, 850, 1230][index]}</div></div>)}
        </div>
        <MiniNav />
      </div>
    </PhoneShell>
  );
}

function ScanPhone() {
  return (
    <PhoneShell className="z-30 -ml-8 mt-8 lg:mt-3 lg:rotate-1">
      <div className="flex min-h-[400px] flex-col px-3">
        <div className="text-center text-[8px] font-extrabold text-navy-900">Scan and pay</div>
        <div className="mt-5 rounded-3xl bg-[#070a10] p-4 text-center text-white">
          <div className="mx-auto flex h-40 items-center justify-center rounded-2xl bg-white"><QrCode size={112} className="text-black" strokeWidth={1.2} /></div>
          <div className="mt-4 text-[7px] text-slate-300">Scan any supported UPI QR</div>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3"><div className="text-[7px] text-slate-400">Pay from</div><div className="mt-1 flex items-center justify-between text-[8px] font-bold text-navy-900"><span>HDFC Bank ••4521</span><CheckCircle2 size={12} className="text-emerald-500" /></div></div>
        <div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl bg-blue-50 p-3 text-center text-[7px] font-bold text-blue-700">Flash</div><div className="rounded-xl bg-blue-50 p-3 text-center text-[7px] font-bold text-blue-700">Gallery</div></div>
        <MiniNav active="scan" />
      </div>
    </PhoneShell>
  );
}

function BillPhone() {
  return (
    <PhoneShell className="z-40 -ml-8 lg:-rotate-1">
      <div className="flex min-h-[400px] flex-col px-3">
        <div className="text-center text-[8px] font-extrabold text-navy-900">Pay hospital bill</div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm"><Hospital size={18} className="text-blue-600" /><div><div className="text-[8px] font-bold text-navy-900">CityCare Hospital</div><div className="text-[6px] text-slate-400">Consultation and medicines</div></div></div>
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm"><div className="text-[7px] text-slate-400">Bill amount</div><div className="mt-1 text-2xl font-extrabold text-navy-900">₹2,450</div><div className="mt-3 border-t border-slate-100 pt-3 text-[7px] text-slate-500"><div className="flex justify-between"><span>Consultation</span><span>₹1,500</span></div><div className="mt-2 flex justify-between"><span>Laboratory</span><span>₹700</span></div><div className="mt-2 flex justify-between"><span>Medicines</span><span>₹250</span></div></div></div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-[8px] font-bold text-navy-900">HDFC Bank ••4521</div>
        <div className="mt-3 rounded-xl bg-blue-700 p-3 text-center text-[8px] font-extrabold text-white">Pay ₹2,450</div>
        <div className="mt-3 flex items-center justify-center gap-1 text-[7px] font-bold text-emerald-600"><ShieldCheck size={11} /> UPI payment</div>
        <MiniNav active="pay" />
      </div>
    </PhoneShell>
  );
}

function SuccessPhone() {
  return (
    <PhoneShell className="z-30 -ml-8 mt-7 lg:mt-2 lg:rotate-1">
      <div className="flex min-h-[400px] flex-col px-3 text-center">
        <div className="text-[8px] font-extrabold text-navy-900">Payment successful</div>
        <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"><CheckCircle2 size={44} className="text-emerald-500" /></div>
        <div className="mt-5 text-3xl font-extrabold text-navy-900">₹2,450</div>
        <div className="mt-2 text-[8px] font-bold text-slate-500">Paid to CityCare Hospital</div>
        <div className="mt-5 rounded-2xl bg-white p-4 text-left shadow-sm"><div className="flex justify-between text-[7px] text-slate-400"><span>UPI reference</span><span>56301829</span></div><div className="mt-3 flex justify-between text-[7px] text-slate-400"><span>Date</span><span>10 May, 10:24</span></div></div>
        <div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl border border-blue-100 p-3 text-[7px] font-bold text-blue-700">Receipt</div><div className="rounded-xl border border-blue-100 p-3 text-[7px] font-bold text-blue-700">Share</div></div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-3 text-left"><div className="text-[8px] font-extrabold text-navy-900">Health expense added</div><div className="mt-1 text-[7px] text-slate-500">Your timeline has been updated.</div></div>
        <MiniNav active="pay" />
      </div>
    </PhoneShell>
  );
}

function FamilyPhone() {
  return (
    <PhoneShell className="z-20 -ml-8 mt-12 hidden xl:block xl:-rotate-2">
      <div className="flex min-h-[400px] flex-col px-3">
        <div className="text-center text-[8px] font-extrabold text-navy-900">Family payment</div>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 p-4"><div className="text-[8px] font-extrabold text-navy-900">Pay for a loved one</div><div className="mt-1 text-[7px] text-slate-500">Choose a family profile</div></div>
        <div className="mt-3 space-y-2">{[['Mum', 'Hospital bill', '₹1,700'], ['Father', 'Lab test', '₹850'], ['Aarav', 'Medicine', '₹420']].map(([name, detail, amount], index) => <div key={name} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><span className={`flex h-8 w-8 items-center justify-center rounded-full ${['bg-rose-50 text-rose-500', 'bg-blue-50 text-blue-500', 'bg-emerald-50 text-emerald-500'][index]}`}><UserRound size={15} /></span><div className="flex-1"><div className="text-[8px] font-bold text-navy-900">{name}</div><div className="text-[6px] text-slate-400">{detail}</div></div><div className="text-[8px] font-extrabold text-navy-900">{amount}</div></div>)}</div>
        <div className="mt-4 rounded-xl border border-dashed border-blue-200 p-3 text-center text-[7px] font-bold text-blue-700">Add family profile</div>
        <MiniNav active="profile" />
      </div>
    </PhoneShell>
  );
}

function PaymentStage() {
  return (
    <div className="pay-device-stage relative flex min-h-[620px] items-center justify-center overflow-visible lg:justify-end">
      <div className="absolute right-[-18%] top-[-8%] h-[760px] w-[920px] rounded-[48%] bg-gradient-to-br from-[#0f2a72] via-[#073f99] to-[#031a4d]" />
      <div className="absolute right-[1%] top-[9%] h-[540px] w-[720px] rounded-full border border-blue-300/15" />
      <div className="absolute right-[10%] top-[17%] h-[390px] w-[550px] rounded-full border border-dashed border-cyan-200/20" />
      <div className="relative flex items-start justify-center scale-[.78] sm:scale-[.92] lg:scale-[.82] xl:scale-[.9] 2xl:scale-100">
        <HomePhone /><ScanPhone /><BillPhone /><SuccessPhone /><FamilyPhone />
      </div>
    </div>
  );
}

function PaymentOverview() {
  const payments = [
    ['CityCare Hospital', 'Hospital payment', '₹2,450', 'Completed'],
    ['HealthPlus Lab', 'Lab test', '₹850', 'Completed'],
    ['MediPlus Pharmacy', 'Medicines', '₹1,230', 'Completed'],
    ['Dr. Kavya Clinic', 'Consultation', '₹700', 'Pending'],
  ];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(5,36,84,.16)]">
      <div className="grid min-h-[510px] grid-cols-[76px_1fr] sm:grid-cols-[110px_1fr]">
        <aside className="bg-[#061f4b] p-3 text-white sm:p-4">
          <div className="flex justify-center"><PayMark className="h-11 w-11" /></div>
          <div className="mt-8 space-y-3">{[Activity, WalletCards, ReceiptText, UsersRound, CalendarClock, ShieldCheck].map((Icon, index) => <div key={index} className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${index === 0 ? 'bg-white/15 text-white' : 'text-blue-100/60'}`}><Icon size={17} /></div>)}</div>
        </aside>
        <div className="bg-[#f7f9fd] p-4 sm:p-7">
          <div className="flex items-start justify-between"><div><div className="text-xs font-extrabold text-navy-900 sm:text-sm">My payments</div><div className="mt-1 text-[9px] text-slate-400">A personal overview of bills, receipts, and payment reminders.</div></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm"><BellRing size={16} /></div></div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[[Clock3, 'Pending', '2'], [CalendarClock, 'Upcoming', '1'], [CheckCircle2, 'Completed', '18'], [IndianRupee, 'This month', '₹18,750']].map(([Icon, label, value]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><Icon size={17} className="text-blue-600" /><div className="mt-3 text-[9px] text-slate-400">{label}</div><div className="mt-1 text-lg font-extrabold text-navy-900">{value}</div></div>)}
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex justify-between"><span className="text-xs font-extrabold text-navy-900">Payment timeline</span><span className="text-[8px] font-bold text-blue-600">All payments</span></div><div className="mt-4 space-y-3">{payments.map(([name, detail, amount, status], index) => <div key={name} className="grid grid-cols-[30px_1fr_auto] items-center gap-3 border-b border-slate-50 pb-3 last:border-0"><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${['bg-blue-50 text-blue-600', 'bg-emerald-50 text-emerald-600', 'bg-violet-50 text-violet-600', 'bg-orange-50 text-orange-500'][index]}`}>{[Hospital, FlaskConical, Pill, Building2].map((Icon, iconIndex) => iconIndex === index ? <Icon key={iconIndex} size={14} /> : null)}</span><div><div className="text-[9px] font-extrabold text-navy-900">{name}</div><div className="mt-1 text-[8px] text-slate-400">{detail} · {status}</div></div><div className="text-[9px] font-extrabold text-navy-900">{amount}</div></div>)}</div></div>
            <div className="space-y-4"><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="text-xs font-extrabold text-navy-900">Due reminders</div><div className="mt-4 space-y-3">{[['Health check-up', '₹1,250'], ['Parents’ lab tests', '₹1,600']].map(([label, amount]) => <div key={label} className="flex items-center justify-between rounded-xl bg-blue-50/60 p-3"><div className="text-[8px] font-bold text-navy-900">{label}</div><div className="text-[8px] font-extrabold text-blue-700">{amount}</div></div>)}</div></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="text-xs font-extrabold text-navy-900">Recent receipts</div><div className="mt-3 flex items-center gap-3"><ReceiptText size={22} className="text-blue-600" /><div><div className="text-[8px] font-bold text-navy-900">3 new receipts</div><div className="text-[7px] text-slate-400">Ready to review</div></div></div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EcosystemItem({ item, side }) {
  const [Icon, title, text] = item;
  return (
    <div className={`relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card ${side === 'left' ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={20} strokeWidth={1.5} /></span>
      <div><div className="text-xs font-extrabold text-navy-900">{title}</div><div className="mt-1 text-[10px] leading-4 text-slate-400">{text}</div></div>
      <span className={`absolute top-1/2 hidden w-20 border-t border-dashed border-blue-200 lg:block ${side === 'left' ? '-right-20' : '-left-20'}`} />
    </div>
  );
}

export default function AstikanPayPage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.pay-hero-copy > *', { y: 28, opacity: 0, duration: 0.72, stagger: 0.08 })
        .from('.pay-device-stage', { x: 46, opacity: 0, scale: 0.97, duration: 1 }, '-=.66');
      gsap.to('.pay-device-stage', { y: -7, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-slate-700">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_35%_30%,rgba(219,231,255,.72),transparent_38%),linear-gradient(180deg,#ffffff_0%,#f5f8ff_100%)] pt-[76px]">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(75,110,190,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(75,110,190,.055)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="relative mx-auto grid min-h-[780px] max-w-[1500px] items-center gap-5 px-5 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
            <div className="pay-hero-copy relative z-20 max-w-2xl py-14 lg:py-20">
              <div className="flex items-center gap-4"><PayMark className="h-16 w-16 sm:h-20 sm:w-20" /><div><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">HEALTH-FIRST UPI</p><div className="mt-1 text-sm font-bold text-slate-400">Powered by everyday payments</div></div></div>
              <h1 className="mt-7 text-[3.35rem] font-extrabold leading-[.98] tracking-[-0.045em] text-navy-900 sm:text-7xl lg:text-[5.15rem]">Astikan Pay</h1>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-blue-700 sm:text-3xl">A health-first UPI payment application.</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">Astikan Pay brings hospital bills, laboratory payments, pharmacy purchases, family support, receipts, refunds, and normal UPI transactions into one calm payment experience.</p>
              <div className="mt-8 flex flex-wrap gap-3">{[[WalletCards, 'UPI payments'], [Hospital, 'Health bills'], [UsersRound, 'Family payments'], [ReceiptText, 'Receipts and refunds']].map(([Icon, label]) => <div key={label} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-4 py-2.5 text-xs font-extrabold text-navy-900 shadow-sm"><Icon size={15} className="text-blue-600" />{label}</div>)}</div>
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-200 pt-7 sm:grid-cols-4">{[[IndianRupee, 'UPI-first'], [LockKeyhole, 'Protected access'], [ReceiptText, 'Organised history'], [HeartPulse, 'Health focused']].map(([Icon, label]) => <div key={label} className="flex items-center gap-2 text-xs font-extrabold text-navy-900"><Icon size={20} className="text-blue-600" />{label}</div>)}</div>
            </div>
            <PaymentStage />
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">ONE APP, MANY PAYMENT MOMENTS</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">Every payment. Every time. Covered.</h2><p className="mt-5 text-base leading-8 text-slate-600">Everyday UPI and health payments belong in one clear, familiar interface.</p></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{paymentMoments.map(([Icon, title, text, accent], index) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft" data-aos="fade-up" data-aos-delay={index * 55}><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}><Icon size={24} strokeWidth={1.5} /></span><h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></article>)}</div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 px-5 lg:grid-cols-[.45fr_1.55fr] lg:px-8">
            <div data-aos="fade-right"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">THE ASTIKAN PAY EXPERIENCE</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">Health payments, beautifully organised.</h2><p className="mt-5 text-base leading-8 text-slate-600">Bills, completed payments, reminders, receipts, and family expenses stay together in one personal overview—not an admin panel.</p><div className="mt-8 space-y-4">{['Live payment timeline with clear status', 'Pending, completed, and upcoming bills', 'Payment reminders without financial clutter', 'Receipt history for every transaction', 'A clear family-payment context'].map((item) => <div key={item} className="flex items-start gap-3 text-sm font-semibold leading-6 text-navy-900"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.4} />{item}</div>)}</div></div>
            <div data-aos="fade-left"><PaymentOverview /></div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/80 blur-3xl" />
          <div className="relative mx-auto max-w-[1180px] px-5 lg:px-8">
            <div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">BUILT FOR HEALTH. BUILT FOR LIFE.</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">One payment ecosystem for everyday life.</h2></div>
            <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_240px_1fr]">
              <div className="space-y-4">{ecosystemLeft.map((item) => <EcosystemItem key={item[1]} item={item} side="left" />)}</div>
              <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-blue-200 bg-white shadow-[0_30px_80px_rgba(44,86,170,.18)]"><div className="absolute inset-4 rounded-full border border-dashed border-blue-200" /><div className="absolute inset-9 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50" /><PayMark className="relative h-24 w-24" /></div>
              <div className="space-y-4">{ecosystemRight.map((item) => <EcosystemItem key={item[1]} item={item} side="right" />)}</div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">CLARITY. SIMPLICITY. CONTEXT.</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">Designed for the way people pay.</h2></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{designPrinciples.map(([Icon, title, text], index) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card" data-aos="fade-up" data-aos-delay={index * 65}><Icon className="h-9 w-9 text-blue-600" strokeWidth={1.45} /><h3 className="mt-5 text-sm font-extrabold text-navy-900">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{text}</p></article>)}</div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-r from-[#031a45] via-[#073b88] to-[#091f58] px-5 py-12 text-white lg:px-8">
          <div className="absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-cyan-200/15" /><div className="absolute bottom-0 right-0 h-full w-1/2 opacity-20 [background-image:radial-gradient(circle,#7dc7ff_1px,transparent_1px)] [background-size:15px_15px]" />
          <div className="relative mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-5"><PayMark className="h-20 w-20" /><div><div className="text-3xl font-extrabold">Astikan Pay</div><div className="mt-2 text-sm text-blue-100/75">UPI for everyday payments and every health expense.</div></div></div>
            <div className="grid grid-cols-2 gap-5 text-xs font-bold text-blue-100/85 sm:grid-cols-4">{[[WalletCards, 'UPI payments'], [ReceiptText, 'Receipts'], [UsersRound, 'Family'], [HeartPulse, 'Health context']].map(([Icon, label]) => <div key={label} className="flex items-center gap-2"><Icon size={20} className="text-cyan-300" />{label}</div>)}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
