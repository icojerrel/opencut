/**
 * MVP tests — profiel, job search, proposal (geen AI credentials nodig).
 */
import { defaultData } from "../agent/lib/default-data.ts";
import { createProposalRecord, matchJobsToProfile, searchJobsInData } from "../agent/lib/logic.ts";

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) { passed++; console.log(`✓ ${name}`); }
  else { failed++; console.error(`✗ ${name}`); }
}

// MVP: 3 seed jobs
const seed = defaultData();
assert("Seed data has 3 jobs", seed.jobs.length === 3);

// Profiel
let data = {
  ...seed,
  profile: {
    ...seed.profile,
    name: "Jerrel",
    title: "Senior Next.js Developer",
    skills: ["Next.js", "React", "TypeScript"],
    hourlyRate: 85,
    experienceYears: 5,
  },
};
assert("Profile setup", data.profile.hourlyRate === 85);

// Job search
const nextJobs = searchJobsInData(data, { skills: ["Next.js"] });
assert("Search by skill", nextJobs.length >= 1);

const matches = matchJobsToProfile(data, data.profile);
assert("Profile matching", matches.length > 0);
assert("Best match is Next.js job", matches[0].title.includes("Next.js"));
console.log(`  Best match: ${matches[0].title} (${matches[0].matchScore}%)`);

// Proposal
const job = data.jobs[0];
const { proposal } = createProposalRecord(data, {
  jobId: job.id,
  jobTitle: job.title,
  content: "Beste TechFlow, met 5 jaar Next.js ervaring lever ik jullie dashboard binnen 5 weken op...",
  proposedRate: 85,
  currency: "EUR",
  status: "draft",
});
assert("Proposal saved", proposal.id.startsWith("prop-"));
assert("Proposal linked to job", proposal.jobId === "job-001");

console.log(`\nMVP flow OK — ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
