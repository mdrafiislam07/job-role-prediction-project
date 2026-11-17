// Rule-based job-chance scoring. Pure functions: used on the server (trusted result)
// and in the browser (live ranking while the user taps skills).
// All percentages come from this code, never from the AI model.

export type Edu = 'ssc' | 'hsc' | 'diploma' | 'bachelor' | 'masters';
export type Field = 'tech' | 'data' | 'design' | 'marketing' | 'business' | 'general';
export type Level = 'high' | 'medium' | 'low';

export interface Inputs {
  skills: string[];
  expYears: number;
  education: Edu;
  field: 'any' | Field;
}

export const FIELDS: { id: Field; en: string; bn: string }[] = [
  { id: 'tech', en: 'IT & software', bn: 'আইটি ও সফটওয়্যার' },
  { id: 'data', en: 'Data', bn: 'ডেটা' },
  { id: 'design', en: 'Design & media', bn: 'ডিজাইন ও মিডিয়া' },
  { id: 'marketing', en: 'Marketing', bn: 'মার্কেটিং' },
  { id: 'business', en: 'Business & finance', bn: 'ব্যবসা ও ফিন্যান্স' },
  { id: 'general', en: 'Office & general', bn: 'অফিস ও সাধারণ' }
];

export const EDU: { id: Edu; en: string; bn: string; rank: number }[] = [
  { id: 'ssc', en: 'SSC', bn: 'এসএসসি', rank: 1 },
  { id: 'hsc', en: 'HSC', bn: 'এইচএসসি', rank: 2 },
  { id: 'diploma', en: 'Diploma', bn: 'ডিপ্লোমা', rank: 3 },
  { id: 'bachelor', en: "Bachelor's", bn: 'স্নাতক', rank: 4 },
  { id: 'masters', en: "Master's", bn: 'স্নাতকোত্তর', rank: 5 }
];

export interface Skill { id: string; en: string; bn: string; field: Field }

export const SKILLS: Skill[] = [
  // IT & software
  { id: 'html', en: 'HTML & CSS', bn: 'এইচটিএমএল ও সিএসএস', field: 'tech' },
  { id: 'js', en: 'JavaScript', bn: 'জাভাস্ক্রিপ্ট', field: 'tech' },
  { id: 'react', en: 'React', bn: 'রিয়্যাক্ট', field: 'tech' },
  { id: 'node', en: 'Node.js', bn: 'নোড.জেএস', field: 'tech' },
  { id: 'py', en: 'Python', bn: 'পাইথন', field: 'tech' },
  { id: 'java', en: 'Java', bn: 'জাভা', field: 'tech' },
  { id: 'sql', en: 'SQL / databases', bn: 'এসকিউএল / ডেটাবেস', field: 'tech' },
  { id: 'git', en: 'Git & GitHub', bn: 'গিট ও গিটহাব', field: 'tech' },
  { id: 'flutter', en: 'Flutter / mobile apps', bn: 'ফ্লাটার / মোবাইল অ্যাপ', field: 'tech' },
  { id: 'linux', en: 'Linux', bn: 'লিনাক্স', field: 'tech' },
  { id: 'net', en: 'Networking', bn: 'নেটওয়ার্কিং', field: 'tech' },
  { id: 'sec', en: 'Cyber security basics', bn: 'সাইবার নিরাপত্তার মূল ধারণা', field: 'tech' },
  { id: 'test', en: 'Software testing', bn: 'সফটওয়্যার টেস্টিং', field: 'tech' },
  { id: 'dsa', en: 'Data structures & algorithms', bn: 'ডেটা স্ট্রাকচার ও অ্যালগরিদম', field: 'tech' },
  // Data
  { id: 'excel', en: 'Excel / Google Sheets', bn: 'এক্সেল / গুগল শিট', field: 'data' },
  { id: 'viz', en: 'Dashboards (Power BI, Tableau)', bn: 'ড্যাশবোর্ড (পাওয়ার বিআই, ট্যাবলো)', field: 'data' },
  { id: 'stats', en: 'Statistics', bn: 'পরিসংখ্যান', field: 'data' },
  { id: 'ml', en: 'Machine learning', bn: 'মেশিন লার্নিং', field: 'data' },
  // Design & media
  { id: 'ui', en: 'UI/UX design (Figma)', bn: 'ইউআই/ইউএক্স ডিজাইন (ফিগমা)', field: 'design' },
  { id: 'ps', en: 'Photoshop', bn: 'ফটোশপ', field: 'design' },
  { id: 'ai', en: 'Illustrator', bn: 'ইলাস্ট্রেটর', field: 'design' },
  { id: 'video', en: 'Video editing', bn: 'ভিডিও এডিটিং', field: 'design' },
  { id: 'creative', en: 'Creativity and visual sense', bn: 'সৃজনশীলতা ও ভিজ্যুয়াল সেন্স', field: 'design' },
  // Marketing
  { id: 'social', en: 'Social media management', bn: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট', field: 'marketing' },
  { id: 'seo', en: 'SEO', bn: 'এসইও', field: 'marketing' },
  { id: 'write', en: 'Content writing', bn: 'কনটেন্ট রাইটিং', field: 'marketing' },
  { id: 'ads', en: 'Facebook / Google ads', bn: 'ফেসবুক / গুগল বিজ্ঞাপন', field: 'marketing' },
  { id: 'ga', en: 'Web analytics', bn: 'ওয়েব অ্যানালিটিক্স', field: 'marketing' },
  { id: 'ecom', en: 'E-commerce operations', bn: 'ই-কমার্স পরিচালনা', field: 'marketing' },
  // Business & finance
  { id: 'sales', en: 'Sales', bn: 'বিক্রয়', field: 'business' },
  { id: 'nego', en: 'Negotiation', bn: 'দরকষাকষি', field: 'business' },
  { id: 'mgmt', en: 'Team and project management', bn: 'টিম ও প্রজেক্ট ম্যানেজমেন্ট', field: 'business' },
  { id: 'acc', en: 'Accounting', bn: 'হিসাববিজ্ঞান', field: 'business' },
  { id: 'fin', en: 'Banking and finance basics', bn: 'ব্যাংকিং ও ফিন্যান্সের মূল ধারণা', field: 'business' },
  { id: 'hr', en: 'HR and recruitment basics', bn: 'এইচআর ও নিয়োগের মূল ধারণা', field: 'business' },
  { id: 'logi', en: 'Logistics and supply chain', bn: 'লজিস্টিকস ও সাপ্লাই চেইন', field: 'business' },
  // Office & general
  { id: 'comm', en: 'Communication', bn: 'যোগাযোগ দক্ষতা', field: 'general' },
  { id: 'eng', en: 'English (spoken and written)', bn: 'ইংরেজি (বলা ও লেখা)', field: 'general' },
  { id: 'prob', en: 'Problem solving', bn: 'সমস্যা সমাধান', field: 'general' },
  { id: 'office', en: 'MS Office', bn: 'এমএস অফিস', field: 'general' },
  { id: 'type', en: 'Fast, accurate typing', bn: 'দ্রুত ও নির্ভুল টাইপিং', field: 'general' },
  { id: 'teach', en: 'Teaching', bn: 'শিক্ষকতা', field: 'general' }
];

export interface Job {
  id: string;
  en: string;
  bn: string;
  field: Field;
  reqs: [string, number][]; // [skill id, weight 1-3]
  minEdu: Edu;
  exp: number;               // typical years of experience asked
  pay: [number, number];     // rough monthly pay in BDT (entry to mid level)
}

// Pay ranges are rough, round-number guides for Bangladesh. Edit them freely.
export const JOBS: Job[] = [
  { id: 'web', en: 'Web Developer', bn: 'ওয়েব ডেভেলপার', field: 'tech', minEdu: 'hsc', exp: 1, pay: [25000, 80000], reqs: [['html', 3], ['js', 3], ['react', 2], ['node', 2], ['git', 1], ['sql', 1], ['prob', 1]] },
  { id: 'mobile', en: 'Mobile App Developer', bn: 'মোবাইল অ্যাপ ডেভেলপার', field: 'tech', minEdu: 'diploma', exp: 1, pay: [30000, 90000], reqs: [['flutter', 3], ['java', 2], ['git', 1], ['sql', 1], ['prob', 1]] },
  { id: 'swe', en: 'Software Engineer', bn: 'সফটওয়্যার ইঞ্জিনিয়ার', field: 'tech', minEdu: 'bachelor', exp: 1, pay: [40000, 120000], reqs: [['py', 2], ['java', 2], ['dsa', 3], ['sql', 2], ['git', 1], ['prob', 2]] },
  { id: 'qa', en: 'QA / Software Tester', bn: 'কিউএ / সফটওয়্যার টেস্টার', field: 'tech', minEdu: 'diploma', exp: 0, pay: [22000, 55000], reqs: [['test', 3], ['sql', 1], ['prob', 2], ['comm', 1], ['git', 1], ['eng', 1]] },
  { id: 'netadmin', en: 'Network Administrator', bn: 'নেটওয়ার্ক অ্যাডমিনিস্ট্রেটর', field: 'tech', minEdu: 'diploma', exp: 1, pay: [25000, 70000], reqs: [['net', 3], ['linux', 2], ['sec', 2], ['prob', 2]] },
  { id: 'cyber', en: 'Cyber Security Analyst', bn: 'সাইবার সিকিউরিটি অ্যানালিস্ট', field: 'tech', minEdu: 'bachelor', exp: 1, pay: [45000, 110000], reqs: [['sec', 3], ['net', 2], ['linux', 2], ['py', 1], ['prob', 2]] },
  { id: 'analyst', en: 'Data Analyst', bn: 'ডেটা অ্যানালিস্ট', field: 'data', minEdu: 'bachelor', exp: 1, pay: [30000, 80000], reqs: [['excel', 3], ['sql', 3], ['viz', 2], ['stats', 2], ['py', 1], ['eng', 1]] },
  { id: 'ds', en: 'Data Scientist', bn: 'ডেটা সায়েন্টিস্ট', field: 'data', minEdu: 'bachelor', exp: 2, pay: [60000, 150000], reqs: [['py', 3], ['stats', 3], ['ml', 3], ['sql', 2], ['viz', 1]] },
  { id: 'uiux', en: 'UI/UX Designer', bn: 'ইউআই/ইউএক্স ডিজাইনার', field: 'design', minEdu: 'hsc', exp: 1, pay: [30000, 90000], reqs: [['ui', 3], ['creative', 2], ['html', 1], ['comm', 1], ['prob', 1], ['eng', 1]] },
  { id: 'graphic', en: 'Graphic Designer', bn: 'গ্রাফিক ডিজাইনার', field: 'design', minEdu: 'hsc', exp: 0, pay: [20000, 55000], reqs: [['ps', 3], ['ai', 3], ['creative', 3], ['comm', 1]] },
  { id: 'video', en: 'Video Editor', bn: 'ভিডিও এডিটর', field: 'design', minEdu: 'hsc', exp: 0, pay: [20000, 60000], reqs: [['video', 3], ['creative', 2], ['ps', 1], ['comm', 1]] },
  { id: 'dm', en: 'Digital Marketer', bn: 'ডিজিটাল মার্কেটার', field: 'marketing', minEdu: 'hsc', exp: 1, pay: [25000, 70000], reqs: [['social', 3], ['seo', 2], ['ads', 3], ['ga', 2], ['write', 1], ['comm', 1]] },
  { id: 'writer', en: 'Content Writer', bn: 'কনটেন্ট রাইটার', field: 'marketing', minEdu: 'hsc', exp: 0, pay: [18000, 50000], reqs: [['write', 3], ['eng', 3], ['seo', 2], ['creative', 1]] },
  { id: 'ecom', en: 'E-commerce Executive', bn: 'ই-কমার্স এক্সিকিউটিভ', field: 'marketing', minEdu: 'hsc', exp: 0, pay: [20000, 55000], reqs: [['ecom', 3], ['social', 2], ['ads', 1], ['sales', 1], ['ga', 1], ['comm', 1]] },
  { id: 'sales', en: 'Sales Executive', bn: 'সেলস এক্সিকিউটিভ', field: 'business', minEdu: 'hsc', exp: 0, pay: [18000, 60000], reqs: [['sales', 3], ['comm', 3], ['nego', 2], ['office', 1]] },
  { id: 'hr', en: 'HR Executive', bn: 'এইচআর এক্সিকিউটিভ', field: 'business', minEdu: 'bachelor', exp: 1, pay: [25000, 60000], reqs: [['hr', 3], ['comm', 2], ['office', 2], ['mgmt', 1], ['eng', 1]] },
  { id: 'acct', en: 'Accountant', bn: 'অ্যাকাউন্ট্যান্ট', field: 'business', minEdu: 'bachelor', exp: 1, pay: [25000, 65000], reqs: [['acc', 3], ['excel', 3], ['office', 1], ['fin', 1]] },
  { id: 'bank', en: 'Bank Officer', bn: 'ব্যাংক অফিসার', field: 'business', minEdu: 'bachelor', exp: 0, pay: [30000, 60000], reqs: [['fin', 3], ['comm', 2], ['excel', 1], ['eng', 1], ['sales', 1], ['office', 1]] },
  { id: 'pm', en: 'Project Manager', bn: 'প্রজেক্ট ম্যানেজার', field: 'business', minEdu: 'bachelor', exp: 4, pay: [70000, 180000], reqs: [['mgmt', 3], ['comm', 3], ['prob', 2], ['office', 1], ['eng', 2]] },
  { id: 'logi', en: 'Logistics Executive', bn: 'লজিস্টিকস এক্সিকিউটিভ', field: 'business', minEdu: 'hsc', exp: 1, pay: [22000, 55000], reqs: [['logi', 3], ['excel', 2], ['comm', 1], ['mgmt', 1], ['nego', 1]] },
  { id: 'merch', en: 'Merchandiser (garments)', bn: 'মার্চেন্ডাইজার (গার্মেন্টস)', field: 'business', minEdu: 'diploma', exp: 1, pay: [30000, 80000], reqs: [['eng', 2], ['nego', 3], ['comm', 2], ['excel', 2], ['mgmt', 1]] },
  { id: 'support', en: 'Customer Support Executive', bn: 'কাস্টমার সাপোর্ট এক্সিকিউটিভ', field: 'general', minEdu: 'hsc', exp: 0, pay: [15000, 35000], reqs: [['comm', 3], ['eng', 2], ['prob', 2], ['office', 1], ['type', 1]] },
  { id: 'admin', en: 'Admin / Office Executive', bn: 'অ্যাডমিন / অফিস এক্সিকিউটিভ', field: 'general', minEdu: 'hsc', exp: 0, pay: [18000, 40000], reqs: [['office', 3], ['comm', 2], ['type', 1], ['mgmt', 1], ['eng', 1]] },
  { id: 'teacher', en: 'Teacher / Tutor', bn: 'শিক্ষক / টিউটর', field: 'general', minEdu: 'bachelor', exp: 0, pay: [15000, 45000], reqs: [['teach', 3], ['comm', 3], ['eng', 1], ['office', 1]] },
  { id: 'dataentry', en: 'Data Entry Operator', bn: 'ডেটা এন্ট্রি অপারেটর', field: 'general', minEdu: 'ssc', exp: 0, pay: [12000, 25000], reqs: [['type', 3], ['office', 3], ['excel', 2]] }
];

const SKILL_MAP = new Map(SKILLS.map((s) => [s.id, s]));
const JOB_MAP = new Map(JOBS.map((j) => [j.id, j]));
const EDU_RANK = new Map(EDU.map((e) => [e.id, e.rank]));

export type Lang = 'en' | 'bn';
export const skillName = (id: string, lang: Lang) => { const s = SKILL_MAP.get(id); return s ? s[lang] : id; };
export const jobName = (id: string, lang: Lang) => { const j = JOB_MAP.get(id); return j ? j[lang] : id; };
export const jobById = (id: string) => JOB_MAP.get(id);

export interface JobMatch {
  id: string;
  chance: number;                         // 0-95
  level: Level;
  skillPct: number;                       // share of the job's weighted skills you have, 0-100
  have: string[];
  missing: { skill: string; gain: number }[]; // sorted by gain (percentage points you would add)
  parts: { skills: number; experience: number; education: number; interest: number };
}

export interface Ranking {
  matches: JobMatch[];                    // all jobs, best first
  next: { skill: string; gain: number; jobs: number }[]; // best skills to learn for the top 5 jobs
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Returns an error message, or null when the inputs are usable. */
export function validate(i: unknown): string | null {
  if (!i || typeof i !== 'object') return 'Inputs are missing.';
  const x = i as Record<string, unknown>;
  if (!Array.isArray(x.skills) || x.skills.length === 0) return 'Pick at least one skill.';
  if (x.skills.length > 60 || x.skills.some((s) => typeof s !== 'string' || !SKILL_MAP.has(s))) return 'One of the skills is not valid.';
  if (!isNum(x.expYears)) return 'Please enter your experience in years.';
  if (x.expYears < 0 || x.expYears > 40) return 'Experience must be between 0 and 40 years.';
  if (!EDU_RANK.has(x.education as Edu)) return 'Select your education.';
  if (x.field !== 'any' && !FIELDS.some((f) => f.id === x.field)) return 'Select a job field.';
  return null;
}

export function matchJob(job: Job, i: Inputs): JobMatch {
  const owned = new Set(i.skills);
  const totalW = job.reqs.reduce((s, [, w]) => s + w, 0);
  const have: string[] = [];
  const missingRaw: { skill: string; pts: number }[] = [];
  let haveW = 0;
  for (const [skill, w] of job.reqs) {
    if (owned.has(skill)) { have.push(skill); haveW += w; }
    else missingRaw.push({ skill, pts: (65 * w) / totalW });
  }

  // 65 pts skill match + 12 pts experience + 13 pts education + 10 pts field preference = 100
  const skills = 65 * (haveW / totalW);
  const expRatio = job.exp === 0 ? 1 : Math.max(0.2, Math.min(1, i.expYears / job.exp));
  const experience = 12 * expRatio;
  const diff = (EDU_RANK.get(i.education) || 1) - (EDU_RANK.get(job.minEdu) || 1);
  const education = diff >= 0 ? 13 : diff === -1 ? 7 : 2;
  const interest = i.field === 'any' ? 5 : i.field === job.field ? 10 : 0;

  const chance = Math.min(95, Math.round(skills + experience + education + interest));
  const level: Level = chance >= 65 ? 'high' : chance >= 40 ? 'medium' : 'low';
  const room = 95 - chance;

  return {
    id: job.id,
    chance,
    level,
    skillPct: Math.round((haveW / totalW) * 100),
    have,
    missing: missingRaw
      .map((m) => ({ skill: m.skill, gain: Math.max(0, Math.min(Math.round(m.pts), room)) }))
      .sort((a, b) => b.gain - a.gain),
    parts: { skills: Math.round(skills), experience: Math.round(experience), education, interest }
  };
}

export function rank(i: Inputs): Ranking {
  const matches = JOBS.map((j) => matchJob(j, i)).sort((a, b) => b.chance - a.chance || b.skillPct - a.skillPct);

  const agg = new Map<string, { gain: number; jobs: number }>();
  for (const m of matches.slice(0, 5)) {
    for (const x of m.missing) {
      const cur = agg.get(x.skill) || { gain: 0, jobs: 0 };
      agg.set(x.skill, { gain: cur.gain + x.gain, jobs: cur.jobs + 1 });
    }
  }
  const next = [...agg.entries()]
    .map(([skill, v]) => ({ skill, ...v }))
    .sort((a, b) => b.gain - a.gain)
    .slice(0, 5);

  return { matches, next };
}