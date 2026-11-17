import { EDU, jobById, rank, skillName, type Inputs } from './jobs';

/** A compact, English-named view of the result for the model. */
export function briefFor(inputs: Inputs) {
  const ranking = rank(inputs);
  return {
    profile: {
      skills: inputs.skills.map((s) => skillName(s, 'en')),
      experienceYears: inputs.expYears,
      education: EDU.find((e) => e.id === inputs.education)?.en,
      preferredField: inputs.field
    },
    topJobs: ranking.matches.slice(0, 6).map((m) => ({
      job: jobById(m.id)?.en,
      chancePercent: m.chance,
      level: m.level,
      skillsYouHave: m.have.map((s) => skillName(s, 'en')),
      skillsMissing: m.missing.slice(0, 4).map((x) => ({ skill: skillName(x.skill, 'en'), addsPercent: x.gain })),
      typicalMonthlyPayBdt: jobById(m.id)?.pay
    })),
    bestSkillsToLearnNext: ranking.next.map((n) => ({
      skill: skillName(n.skill, 'en'),
      addsPercentAcrossTopJobs: n.gain,
      helpsJobs: n.jobs
    }))
  };
}