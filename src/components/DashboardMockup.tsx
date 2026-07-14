import React from 'react';
import { Bell, CalendarDays, CheckCircle2, FileText, HeartPulse, Home, MessageCircle, MoreHorizontal, ShieldCheck, Stethoscope } from 'lucide-react';
import { AstikanMark } from './AstikanLogo';

const nav = [Home, HeartPulse, CalendarDays, FileText, MessageCircle];

function Metric({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="text-lg font-bold text-navy-900">{value}</div>
      <div className="mt-1 text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

export default function DashboardMockup() {
  return (
    <div className="hero-dashboard absolute left-[11%] top-[29%] z-20 w-[78%] rounded-[1.35rem] border border-white/80 bg-white shadow-dashboard">
      <div className="flex min-h-[285px] overflow-hidden rounded-[1.35rem]">
        <aside className="w-[58px] bg-gradient-to-b from-navy-800 to-navy-950 px-2 py-4 text-white">
          <div className="mx-auto mb-6 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><AstikanMark className="h-6 w-6" /></div>
          <div className="space-y-3">
            {nav.map((Icon, i) => <div key={i} className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${i === 0 ? 'bg-white/15' : ''}`}><Icon size={15} strokeWidth={1.8}/></div>)}
          </div>
        </aside>
        <main className="flex-1 bg-slate-50/80 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-slate-500">Welcome back, Arjun</p>
              <h3 className="mt-0.5 text-sm font-bold text-navy-900">Your care is connected.</h3>
            </div>
            <div className="flex gap-2 text-navy-700"><Bell size={15}/><MoreHorizontal size={16}/></div>
          </div>
          <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500"><span>Care Journey</span><span className="text-mint">On track</span></div>
            <div className="mt-3 flex items-center gap-1.5">
              {['Consultation', 'Diagnostics', 'Treatment', 'Follow-up'].map((label, i) => (
                <React.Fragment key={label}>
                  <div className="min-w-0 flex-1 text-center">
                    <span className={`mx-auto block h-2.5 w-2.5 rounded-full border-2 ${i < 3 ? 'border-mint bg-mint/20' : 'border-slate-300 bg-white'}`}/>
                    <span className="mt-1 block truncate text-[8px] text-slate-500">{label}</span>
                  </div>
                  {i < 3 && <span className={`h-px flex-1 ${i < 2 ? 'bg-mint' : 'bg-slate-200'}`}/>} 
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <Metric value="2" label="Appointments"/><Metric value="5" label="Reports"/><Metric value="3" label="Prescriptions"/><Metric value="1" label="Billing"/>
          </div>
        </main>
      </div>
      <div className="absolute -right-[16%] top-[15%] w-[32%] rounded-2xl border border-white/90 bg-white/95 p-3 shadow-soft backdrop-blur">
        <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold text-navy-900">Upcoming</span><MoreHorizontal size={13}/></div>
        {[["Cardiology Consultation","Tomorrow, 10:00 AM",Stethoscope],["MRI Scan","24 May, 09:30 AM",CalendarDays]].map(([a,b,Icon]) => <div key={a} className="mb-2 flex gap-2 rounded-xl bg-slate-50 p-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><Icon size={13}/></div><div><div className="text-[8px] font-semibold text-navy-900">{a}</div><div className="mt-0.5 text-[7px] text-slate-400">{b}</div></div></div>)}
      </div>
      <div className="absolute -bottom-[17%] -right-[28%] w-[26%] rounded-[1.6rem] border-[5px] border-slate-900 bg-white p-2 shadow-soft">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-slate-300"/>
        <div className="rounded-xl bg-slate-50 p-2">
          <div className="text-[8px] text-slate-500">Care Wallet</div><div className="mt-1 text-[10px] font-bold text-navy-900">₹25,450</div>
          <div className="mt-3 space-y-2">
            <div className="rounded-lg bg-emerald-50 p-2"><div className="flex items-center gap-1 text-[7px] font-semibold text-emerald-700"><ShieldCheck size={10}/> Personal Assistance</div></div>
            <div className="rounded-lg bg-rose-50 p-2"><div className="flex items-center gap-1 text-[7px] font-semibold text-rose-700"><CheckCircle2 size={10}/> Emergency Support</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
