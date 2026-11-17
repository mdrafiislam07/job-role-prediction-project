import { NextResponse } from 'next/server';
import { rank, validate, type Inputs } from '../../../lib/jobs';
import { briefFor } from '../../../lib/brief';
import { generate, parseJson } from '../../../lib/gemini';

interface AiNotes {
  summary: string;
  strengths: string[];
  gaps: string[];
  steps: string[];
}

const list = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).slice(0, max).map((x) => String(x).trim()) : [];

export async function POST(req: Request) {
  let body: { inputs?: unknown; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const error = validate(body.inputs);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const inputs = body.inputs as Inputs;
  const lang = body.lang === 'bn' ? 'Bangla (Bengali script)' : 'English';
  const ranking = rank(inputs); // all percentages are computed here, not by the AI

  let ai: AiNotes | null = null;
  try {
    const system =
      'You are CareerMatch, a careful career assistant for job seekers in Bangladesh. ' +
      'The job-chance percentages were already calculated by code from skill match, experience and education. ' +
      'Never change, recalculate or contradict them, and never invent numbers or facts that are not given. ' +
      'Never promise a job. Pay figures are rough ranges, say so if you mention them. Be specific, practical and encouraging but honest. Currency is BDT (taka).';

    const prompt = `Job seeker data (JSON):
${JSON.stringify(briefFor(inputs), null, 2)}

Write your answer in ${lang}.
Return ONLY a JSON object with these keys:
- "summary": 2-3 sentences on where this person stands. Name the best job and its chance percent.
- "strengths": up to 3 short strings (what already works in their favour).
- "gaps": up to 3 short strings (what holds the top jobs back, use the skills and percents given).
- "steps": up to 4 short, concrete actions for the next 3 months. Prefer the "bestSkillsToLearnNext" list.`;

    const text = await generate({ system, contents: [{ role: 'user', parts: [{ text: prompt }] }], json: true });
    const parsed = parseJson<Partial<AiNotes>>(text);
    if (parsed && typeof parsed.summary === 'string') {
      ai = {
        summary: parsed.summary.trim(),
        strengths: list(parsed.strengths, 3),
        gaps: list(parsed.gaps, 3),
        steps: list(parsed.steps, 4)
      };
    }
  } catch (e) {
    console.error('Gemini advice failed:', e);
  }

  // If the AI is unavailable the ranking is still returned (ai = null).
  return NextResponse.json({ ranking, ai });
}