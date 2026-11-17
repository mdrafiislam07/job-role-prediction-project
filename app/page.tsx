'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { EDU, FIELDS, SKILLS, jobById, jobName, rank, skillName, validate } from '../lib/jobs';
import type { Edu, Inputs, JobMatch, Lang, Level, Ranking } from '../lib/jobs';

/* ------------------------------ text (EN / BN) ------------------------------ */
const EN = {
  appName: 'JobRole AI',
  badge: 'Agentic AI',
  headline: 'Which jobs can you get with the skills you have today?',
  sub: 'Pick your skills, education and experience. You get a chance for every job role, and the skills that raise it the most.',
  profile: 'Your profile',
  education: 'Education',
  experience: 'Work experience',
  years: 'years',
  field: 'Preferred field',
  anyField: 'Any field',
  skillsTitle: 'Your skills',
  skillsSub: 'Tap every skill you already have. The list on the right updates instantly.',
  search: 'Search skills...',
  selected: 'selected',
  clear: 'Clear all',
  noSkill: 'No skill found.',
  liveTitle: 'Best matches right now',
  liveEmpty: 'Pick your skills and the best job roles for you will appear here.',
  submit: 'Get full report and AI advice',
  checking: 'Analysing...',
  stale: 'You changed your profile. Press "Get full report and AI advice" to refresh the report.',
  reportTitle: 'Your job role report',
  reportSub: 'Open a role to see what you have, what to add and the typical pay.',
  chance: 'chance',
  skillMatch: 'Skill match',
  have: 'Skills you have',
  haveNone: 'None yet',
  missing: 'Skills to add',
  missingNone: 'You have every skill this role asks for.',
  pay: 'Typical monthly pay',
  payNote: 'Rough range from entry to mid level, in taka.',
  scoreParts: 'How the chance is built',
  partSkills: 'Skills',
  partExp: 'Experience',
  partEdu: 'Education',
  partInterest: 'Field interest',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  showAll: 'Show all job roles',
  showLess: 'Show fewer',
  learnNext: 'Learn these next',
  learnSub: 'These skills lift your chance the most across your best job roles.',
  jobsWord: 'roles',
  aiTitle: 'AI career advice',
  strengths: 'Working for you',
  gaps: 'Holding you back',
  steps: 'Next 3 months',
  aiUnavailable: 'The AI advice is not available right now. The chances above are still correct.',
  askTitle: 'Ask your career coach',
  askPlaceholder: 'Ask anything about your result...',
  send: 'Send',
  thinking: 'Thinking...',
  q1: 'Which job should I apply for first?',
  q2: 'What should I learn in the next 3 months?',
  q3: 'How do I write a CV for my top job?',
  network: 'Network error. Please try again.',
  disclaimer:
    'These chances are estimates from your skills, experience and education. They are not a promise of a job. Pay ranges are rough guides and change by company and city.'
};

const BN: typeof EN = {
  appName: 'JobRole AI',
  badge: 'এজেন্টিক এআই',
  headline: 'আজকের স্কিল দিয়ে আপনি কোন কোন চাকরি পেতে পারেন?',
  sub: 'আপনার স্কিল, শিক্ষা ও অভিজ্ঞতা দিন। প্রতিটি চাকরির সম্ভাবনা এবং কোন স্কিল শিখলে সম্ভাবনা সবচেয়ে বেশি বাড়বে তা জানুন।',
  profile: 'আপনার প্রোফাইল',
  education: 'শিক্ষাগত যোগ্যতা',
  experience: 'কাজের অভিজ্ঞতা',
  years: 'বছর',
  field: 'পছন্দের ক্ষেত্র',
  anyField: 'যেকোনো ক্ষেত্র',
  skillsTitle: 'আপনার স্কিল',
  skillsSub: 'আপনার যেসব স্কিল আছে সবগুলোতে ট্যাপ করুন। ডানের তালিকা সঙ্গে সঙ্গে বদলাবে।',
  search: 'স্কিল খুঁজুন...',
  selected: 'টি বাছাই করা',
  clear: 'সব মুছুন',
  noSkill: 'কোনো স্কিল পাওয়া যায়নি।',
  liveTitle: 'এই মুহূর্তের সেরা মিল',
  liveEmpty: 'স্কিল বাছাই করলেই আপনার জন্য সেরা চাকরিগুলো এখানে দেখা যাবে।',
  submit: 'পূর্ণ রিপোর্ট ও এআই পরামর্শ নিন',
  checking: 'বিশ্লেষণ হচ্ছে...',
  stale: 'আপনি প্রোফাইল বদলেছেন। রিপোর্ট নতুন করতে "পূর্ণ রিপোর্ট ও এআই পরামর্শ নিন" চাপুন।',
  reportTitle: 'আপনার চাকরির রিপোর্ট',
  reportSub: 'কোনো চাকরি খুললে দেখবেন আপনার কী আছে, কী যোগ করতে হবে ও সাধারণ বেতন কত।',
  chance: 'সম্ভাবনা',
  skillMatch: 'স্কিল মিল',
  have: 'আপনার যে স্কিল আছে',
  haveNone: 'এখনো নেই',
  missing: 'যে স্কিল যোগ করতে হবে',
  missingNone: 'এই চাকরির সব স্কিল আপনার আছে।',
  pay: 'সাধারণ মাসিক বেতন',
  payNote: 'শুরু থেকে মাঝারি স্তরের আনুমানিক পরিসর, টাকায়।',
  scoreParts: 'সম্ভাবনা কীভাবে তৈরি হয়েছে',
  partSkills: 'স্কিল',
  partExp: 'অভিজ্ঞতা',
  partEdu: 'শিক্ষা',
  partInterest: 'ক্ষেত্রের আগ্রহ',
  high: 'বেশি',
  medium: 'মাঝারি',
  low: 'কম',
  showAll: 'সব চাকরি দেখুন',
  showLess: 'কম দেখুন',
  learnNext: 'এরপর এগুলো শিখুন',
  learnSub: 'এই স্কিলগুলো আপনার সেরা চাকরিগুলোতে সম্ভাবনা সবচেয়ে বেশি বাড়াবে।',
  jobsWord: 'টি চাকরিতে',
  aiTitle: 'এআই ক্যারিয়ার পরামর্শ',
  strengths: 'যা আপনার পক্ষে কাজ করছে',
  gaps: 'যা পিছিয়ে রাখছে',
  steps: 'আগামী ৩ মাসের করণীয়',
  aiUnavailable: 'এআই পরামর্শ এখন পাওয়া যাচ্ছে না। উপরের সম্ভাবনা ঠিকই আছে।',
  askTitle: 'ক্যারিয়ার কোচকে জিজ্ঞাসা করুন',
  askPlaceholder: 'আপনার ফলাফল নিয়ে যেকোনো প্রশ্ন করুন...',
  send: 'পাঠান',
  thinking: 'ভাবছি...',
  q1: 'প্রথমে কোন চাকরিতে আবেদন করা উচিত?',
  q2: 'আগামী ৩ মাসে আমার কী শেখা উচিত?',
  q3: 'আমার সেরা চাকরির জন্য সিভি কীভাবে লিখব?',
  network: 'নেটওয়ার্কে সমস্যা। আবার চেষ্টা করুন।',
  disclaimer:
    'এই সম্ভাবনা আপনার স্কিল, অভিজ্ঞতা ও শিক্ষা থেকে করা অনুমান। এটি চাকরির নিশ্চয়তা নয়। বেতনের পরিসর আনুমানিক, কোম্পানি ও শহরভেদে বদলায়।'
};

const TEXT: Record<Lang, typeof EN> = { en: EN, bn: BN };

/* --------------------------------- helpers --------------------------------- */
interface AiNotes { summary: string; strengths: string[]; gaps: string[]; steps: string[] }
interface Msg { role: 'user' | 'assistant'; content: string }

const LEVEL: Record<Level, { bar: string; text: string; soft: string }> = {
  high: { bar: '#0f9d58', text: 'text-emerald-700', soft: 'bg-emerald-50 text-emerald-800' },
  medium: { bar: '#e08a00', text: 'text-amber-700', soft: 'bg-amber-50 text-amber-800' },
  low: { bar: '#d6336c', text: 'text-rose-700', soft: 'bg-rose-50 text-rose-800' }
};

const taka = (n: number) => `৳${n.toLocaleString('en-IN')}`;
const inputsKey = (i: Inputs) => JSON.stringify({ ...i, skills: [...i.skills].sort() });

const focusRing = 'outline-none focus-visible:ring-4 focus-visible:ring-violet-600/25';
const fieldCls = `w-full rounded-lg border border-[#d9d6ee] bg-white px-3.5 py-2.5 text-sm text-[#1b1b3a] placeholder:text-slate-400 focus:border-violet-600 ${focusRing}`;

/* -------------------------------- components -------------------------------- */
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={`min-h-[40px] rounded-full border px-4 text-sm font-medium transition ${focusRing} ${
        active
          ? 'border-violet-600 bg-violet-600 text-white'
          : 'border-[#d9d6ee] bg-white text-[#3a3a5c] hover:border-violet-400 hover:text-violet-700'
      }`}
    >
      {children}
    </button>
  );
}

function Bar({ value, level }: { value: number; level: Level }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#ecebf7]" role="presentation">
      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${value}%`, background: LEVEL[level].bar }} />
    </div>
  );
}

function Notes({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-sm font-bold text-[#1b1b3a]">{title}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="border-l-2 border-violet-300 pl-3 text-sm leading-relaxed text-[#4a4a6a]">{t}</li>
        ))}
      </ul>
    </div>
  );
}

function JobRow({ m, index, lang, T, defaultOpen }: { m: JobMatch; index: number; lang: Lang; T: typeof EN; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const job = jobById(m.id);
  const label: Record<Level, string> = { high: T.high, medium: T.medium, low: T.low };
  const parts: [string, number, number][] = [
    [T.partSkills, m.parts.skills, 65],
    [T.partExp, m.parts.experience, 12],
    [T.partEdu, m.parts.education, 13],
    [T.partInterest, m.parts.interest, 10]
  ];
  return (
    <li className="border-b border-[#e6e4f4] last:border-b-0">
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className={`flex w-full items-center gap-3 px-1 py-4 text-left sm:gap-5 ${focusRing}`}
      >
        <span className="w-7 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-400">{index + 1}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold text-[#1b1b3a]">{jobName(m.id, lang)}</span>
          <span className="mt-2 block"><Bar value={m.chance} level={m.level} /></span>
        </span>
        <span className="w-24 shrink-0 text-right">
          <span className={`block text-2xl font-extrabold tabular-nums ${LEVEL[m.level].text}`}>{m.chance}%</span>
          <span className="block text-xs text-slate-500">{label[m.level]} {T.chance}</span>
        </span>
        <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="grid gap-6 pb-6 pl-8 pr-1 sm:pl-12 md:grid-cols-2">
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-[#1b1b3a]">{T.have} <span className="font-medium text-slate-500">({m.skillPct}% {T.skillMatch})</span></h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {m.have.length === 0 && <span className="text-sm text-slate-500">{T.haveNone}</span>}
                {m.have.map((s) => (
                  <span key={s} className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-800">{skillName(s, lang)}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1b1b3a]">{T.missing}</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {m.missing.length === 0 && <span className="text-sm text-slate-500">{T.missingNone}</span>}
                {m.missing.map((x) => (
                  <span key={x.skill} className="rounded-md border border-dashed border-[#c9c5e6] px-2.5 py-1 text-xs font-medium text-[#3a3a5c]">
                    {skillName(x.skill, lang)} <span className="font-bold text-emerald-700">+{x.gain}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            {job && (
              <div>
                <h4 className="text-sm font-bold text-[#1b1b3a]">{T.pay}</h4>
                <p className="mt-1 text-lg font-extrabold tabular-nums text-[#1b1b3a]">{taka(job.pay[0])} – {taka(job.pay[1])}</p>
                <p className="text-xs text-slate-500">{T.payNote}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-[#1b1b3a]">{T.scoreParts}</h4>
              <div className="mt-2 space-y-2">
                {parts.map(([name, pts, max]) => (
                  <div key={name} className="flex items-center gap-3 text-xs">
                    <span className="w-24 shrink-0 text-slate-600">{name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ecebf7]">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${(pts / max) * 100}%` }} />
                    </div>
                    <span className="w-12 shrink-0 text-right tabular-nums text-slate-500">{pts}/{max}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

/* ----------------------------------- page ----------------------------------- */
export default function JobRolePage() {
  const [lang, setLang] = useState<Lang>('en');
  const T = TEXT[lang];

  const [skills, setSkills] = useState<string[]>([]);
  const [expYears, setExpYears] = useState('1');
  const [education, setEducation] = useState<Edu>('bachelor');
  const [field, setField] = useState<Inputs['field']>('any');
  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ranking, setRanking] = useState<Ranking | null>(null);
  const [ai, setAi] = useState<AiNotes | null>(null);
  const [assessed, setAssessed] = useState<Inputs | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [chat, setChat] = useState<Msg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const reportTop = useRef<HTMLElement>(null);

  const inputs: Inputs = useMemo(
    () => ({ skills, expYears: expYears.trim() === '' ? NaN : Number(expYears), education, field }),
    [skills, expYears, education, field]
  );
  const live = useMemo(() => (validate(inputs) ? null : rank(inputs)), [inputs]);
  const stale = !!assessed && inputsKey(assessed) !== inputsKey(inputs);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [chat, chatLoading]);

  const toggleSkill = (id: string) =>
    setSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const bumpExp = (d: number) => setExpYears(String(Math.max(0, Math.min(40, (Number(expYears) || 0) + d))));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validate(inputs);
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, lang })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || T.network); return; }
      setRanking(data.ranking);
      setAi(data.ai);
      setAssessed(inputs);
      setShowAll(false);
      setChat([]);
      setTimeout(() => reportTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch {
      setError(T.network);
    } finally {
      setLoading(false);
    }
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || chatLoading || !assessed) return;
    const next: Msg[] = [...chat, { role: 'user', content: q }];
    setChat(next);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, inputs: assessed, lang })
      });
      const data = await res.json();
      setChat([...next, { role: 'assistant', content: res.ok ? data.reply : data.error || T.network }]);
    } catch {
      setChat([...next, { role: 'assistant', content: T.network }]);
    } finally {
      setChatLoading(false);
    }
  };

  const needle = query.trim().toLowerCase();
  const visibleMatches = ranking ? (showAll ? ranking.matches : ranking.matches.slice(0, 8)) : [];

  return (
    <main className="min-h-screen bg-white text-[#1b1b3a]">
      {/* top bar */}
      <header className="border-b border-[#e6e4f4]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-600 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-base font-extrabold tracking-tight">{T.appName}</p>
              <p className="hidden text-xs text-slate-500 sm:block">{T.badge}</p>
            </div>
          </div>
          <div className="flex rounded-full border border-[#d9d6ee] p-0.5 text-xs font-semibold" role="group" aria-label="Language">
            {(['en', 'bn'] as Lang[]).map((l) => (
              <button
                key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`min-h-[32px] rounded-full px-3.5 transition ${focusRing} ${lang === l ? 'bg-[#1b1b3a] text-white' : 'text-slate-600 hover:text-[#1b1b3a]'}`}
              >
                {l === 'en' ? 'EN' : 'বাংলা'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* headline */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-10 sm:px-6 sm:pt-14">
        <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">{T.headline}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4a4a6a]">{T.sub}</p>
      </section>

      {/* workbench */}
      <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-12">
          {/* profile */}
          <section>
            <h2 className="text-xl font-bold">{T.profile}</h2>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-[#3a3a5c]">{T.education}</p>
              <div className="flex flex-wrap gap-2">
                {EDU.map((e) => (
                  <Pill key={e.id} active={education === e.id} onClick={() => setEducation(e.id)}>{e[lang]}</Pill>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="exp" className="mb-2 block text-sm font-semibold text-[#3a3a5c]">{T.experience}</label>
                <div className="flex items-stretch gap-2">
                  <button type="button" onClick={() => bumpExp(-1)} aria-label="-1" className={`w-11 rounded-lg border border-[#d9d6ee] text-lg font-bold hover:border-violet-400 ${focusRing}`}>−</button>
                  <div className="relative flex-1">
                    <input
                      id="exp" type="number" inputMode="decimal" min="0" max="40" step="0.5" value={expYears}
                      onChange={(e) => setExpYears(e.target.value)} className={`${fieldCls} pr-16 text-center font-semibold tabular-nums`}
                    />
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">{T.years}</span>
                  </div>
                  <button type="button" onClick={() => bumpExp(1)} aria-label="+1" className={`w-11 rounded-lg border border-[#d9d6ee] text-lg font-bold hover:border-violet-400 ${focusRing}`}>+</button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-[#3a3a5c]">{T.field}</p>
              <div className="flex flex-wrap gap-2">
                <Pill active={field === 'any'} onClick={() => setField('any')}>{T.anyField}</Pill>
                {FIELDS.map((f) => (
                  <Pill key={f.id} active={field === f.id} onClick={() => setField(f.id)}>{f[lang]}</Pill>
                ))}
              </div>
            </div>
          </section>

          {/* skills */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{T.skillsTitle}</h2>
                <p className="mt-1 text-sm text-slate-500">{T.skillsSub}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold tabular-nums text-violet-700">{skills.length} {T.selected}</span>
                {skills.length > 0 && (
                  <button type="button" onClick={() => setSkills([])} className={`rounded text-slate-500 underline underline-offset-2 hover:text-[#1b1b3a] ${focusRing}`}>{T.clear}</button>
                )}
              </div>
            </div>

            <input
              type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={T.search}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              className={`${fieldCls} mt-4`}
            />

            <div className="mt-5 space-y-6">
              {FIELDS.map((f) => {
                const list = SKILLS.filter(
                  (s) => s.field === f.id && (!needle || s.en.toLowerCase().includes(needle) || s.bn.includes(needle))
                );
                if (!list.length) return null;
                return (
                  <div key={f.id}>
                    <h3 className="mb-2.5 text-sm font-bold text-[#3a3a5c]">{f[lang]}</h3>
                    <div className="flex flex-wrap gap-2">
                      {list.map((s) => (
                        <Pill key={s.id} active={skills.includes(s.id)} onClick={() => toggleSkill(s.id)}>{s[lang]}</Pill>
                      ))}
                    </div>
                  </div>
                );
              })}
              {needle && !SKILLS.some((s) => s.en.toLowerCase().includes(needle) || s.bn.includes(needle)) && (
                <p className="text-sm text-slate-500">{T.noSkill}</p>
              )}
            </div>
          </section>
        </div>

        {/* live ranking */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border-2 border-[#1b1b3a] bg-white p-5">
            <h2 className="text-lg font-bold">{T.liveTitle}</h2>
            {!live ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{T.liveEmpty}</p>
            ) : (
              <ol className="mt-4 space-y-4" aria-live="polite">
                {live.matches.slice(0, 5).map((m, i) => (
                  <li key={m.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate text-sm font-semibold">
                        <span className="mr-2 tabular-nums text-slate-400">{i + 1}</span>{jobName(m.id, lang)}
                      </span>
                      <span className={`text-base font-extrabold tabular-nums ${LEVEL[m.level].text}`}>{m.chance}%</span>
                    </div>
                    <div className="mt-1.5"><Bar value={m.chance} level={m.level} /></div>
                  </li>
                ))}
              </ol>
            )}

            {error && (
              <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className={`mt-5 min-h-[48px] w-full rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {loading ? T.checking : T.submit}
            </button>
          </div>
        </aside>
      </form>

      {/* report */}
      {ranking && (
        <section ref={reportTop} className="border-t border-[#e6e4f4] bg-[#f6f5fc]" aria-live="polite">
          <div className="fade-up mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{T.reportTitle}</h2>
              <p className="mt-1.5 text-sm text-slate-600">{T.reportSub}</p>
              {stale && (
                <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{T.stale}</p>
              )}
            </div>

            {/* job ledger */}
            <div>
              <ul className="rounded-2xl bg-white px-4 sm:px-6">
                {visibleMatches.map((m, i) => (
                  <JobRow key={m.id} m={m} index={i} lang={lang} T={T} defaultOpen={i === 0} />
                ))}
              </ul>
              <button
                type="button" onClick={() => setShowAll((v) => !v)}
                className={`mt-4 rounded-lg border border-[#d9d6ee] bg-white px-5 py-2.5 text-sm font-semibold hover:border-violet-400 ${focusRing}`}
              >
                {showAll ? T.showLess : `${T.showAll} (${ranking.matches.length})`}
              </button>
            </div>

            {/* skills to learn */}
            {ranking.next.length > 0 && (
              <div>
                <h3 className="text-xl font-bold">{T.learnNext}</h3>
                <p className="mt-1 text-sm text-slate-600">{T.learnSub}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ranking.next.map((n) => (
                    <div key={n.skill} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{skillName(n.skill, lang)}</p>
                        <p className="text-xs text-slate-500">{n.jobs} {T.jobsWord}</p>
                      </div>
                      <p className="text-xl font-extrabold tabular-nums text-emerald-700">+{n.gain}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI advice */}
            <div className="rounded-2xl bg-white p-5 sm:p-7">
              <h3 className="text-xl font-bold">{T.aiTitle}</h3>
              {ai ? (
                <div className="mt-4 space-y-6">
                  <p className="max-w-3xl text-base leading-relaxed text-[#3a3a5c]">{ai.summary}</p>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Notes title={T.strengths} items={ai.strengths} />
                    <Notes title={T.gaps} items={ai.gaps} />
                    <Notes title={T.steps} items={ai.steps} />
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">{T.aiUnavailable}</p>
              )}
            </div>

            {/* follow-up chat */}
            <div className="rounded-2xl bg-white p-5 sm:p-7">
              <h3 className="text-xl font-bold">{T.askTitle}</h3>
              {chat.length === 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {[T.q1, T.q2, T.q3].map((q) => (
                    <button
                      key={q} type="button" onClick={() => send(q)}
                      className={`min-h-[40px] rounded-full border border-[#d9d6ee] px-4 text-sm text-[#3a3a5c] transition hover:border-violet-500 hover:text-violet-700 ${focusRing}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {chat.length > 0 && (
                <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
                  {chat.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.role === 'user' ? 'rounded-br-sm bg-violet-600 text-white' : 'rounded-bl-sm bg-[#f0eefa] text-[#1b1b3a]'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && <p className="pl-1 text-sm italic text-slate-500">{T.thinking}</p>}
                  <div ref={chatEnd} />
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); send(chatInput); }} className="mt-4 flex gap-2">
                <input
                  value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={T.askPlaceholder} maxLength={400}
                  className={fieldCls}
                />
                <button
                  type="submit" disabled={chatLoading || !chatInput.trim()}
                  className={`min-h-[44px] shrink-0 rounded-lg bg-[#1b1b3a] px-5 text-sm font-semibold text-white transition hover:bg-[#2c2c58] disabled:opacity-50 ${focusRing}`}
                >
                  {T.send}
                </button>
              </form>
            </div>

            <p className="max-w-3xl text-xs leading-relaxed text-slate-500">{T.disclaimer}</p>
          </div>
        </section>
      )}
    </main>
  );
}