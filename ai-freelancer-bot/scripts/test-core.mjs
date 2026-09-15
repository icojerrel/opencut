/**
 * v0.2 tests — profiel, jobs, tarieven, add job, proposal.
 */
import { defaultData } from "../agent/lib/default-data.ts";
import {
  calculateRate,
  createJobRecord,
  createProposalRecord,
  matchJobsToProfile,
  searchJobsInData,
} from "../agent/lib/logic.ts";

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) { passed++; console.log(`✓ ${name}`); }
  else { failed++; console.error(`✗ ${name}`); }
}

const seed = defaultData();
assert("Seed: 3 jobs", seed.jobs.length === 3);

let data = {
  ...seed,
  profile: {
    ...seed.profile,
    name: "Jerrel",
    skills: ["Next.js", "React", "TypeScript"],
    hourlyRate: 85,
    experienceYears: 5,
  },
};

// v0.1: search & match
assert("Search by skill", searchJobsInData(data, { skills: ["Next.js"] }).length >= 1);
const matches = matchJobsToProfile(data, data.profile);
assert("Profile match", matches[0].title.includes("Next.js"));

// v0.2: calculate rate
const rate = calculateRate({
  experienceYears: 5,
  skillLevel: "mid",
  projectType: "hourly",
  complexity: "medium",
  market: "nl",
});
assert("Rate calculation", rate.hourlyRate.recommended >= 50);
console.log(`  Aanbevolen tarief: €${rate.hourlyRate.recommended}/uur`);

// v0.2: add job
const added = createJobRecord(data, {
  title: "React dashboard via LinkedIn",
  client: "Acme BV",
  description: "Dashboard bouwen met React en TypeScript, 6 weken remote.",
  budget: "€70/uur",
  skills: ["React", "TypeScript"],
  platform: "LinkedIn",
});
data = added.data;
assert("Add job", data.jobs.length === 4);
assert("New job searchable", searchJobsInData(data, { query: "Acme" }).length === 1);

// v0.1: proposal
const { proposal } = createProposalRecord(data, {
  jobId: "job-001",
  jobTitle: data.jobs[0].title,
  content: "Beste TechFlow, met 5 jaar Next.js ervaring lever ik jullie dashboard binnen 5 weken op.",
  proposedRate: 85,
  currency: "EUR",
  status: "draft",
});
assert("Proposal saved", proposal.id.startsWith("prop-"));

console.log(`\nv0.2 flow OK — ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
