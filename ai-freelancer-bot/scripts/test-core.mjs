/**
 * v1.0 core tests — profiel, jobs, tarieven, proposals, projecten, facturen.
 */
import { defaultData } from "../agent/lib/default-data.ts";
import {
  calculateRate,
  createInvoiceRecord,
  createJobRecord,
  createProjectRecord,
  createProposalRecord,
  formatInvoice,
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
assert("Seed: 6 jobs", seed.jobs.length === 6); // 3 dev + 3 video
assert("Video jobs present", seed.jobs.some((j) => j.title.includes("Shorts")));

let data = {
  ...seed,
  profile: {
    ...seed.profile,
    name: "Jerrel",
    skills: ["Next.js", "React", "Remotion"],
    hourlyRate: 85,
    experienceYears: 5,
  },
};

// v0.1–0.2
assert("Search", searchJobsInData(data, { skills: ["Next.js"] }).length >= 1);
assert("Match", matchJobsToProfile(data, data.profile).length > 0);

const rate = calculateRate({ experienceYears: 5, skillLevel: "mid", projectType: "hourly", complexity: "medium", market: "nl" });
assert("Rate", rate.hourlyRate.recommended >= 50);

const added = createJobRecord(data, {
  title: "LinkedIn React job",
  client: "Acme",
  description: "React dashboard remote",
  budget: "€70/uur",
  skills: ["React"],
  platform: "LinkedIn",
});
data = added.data;
assert("Add job", data.jobs.length === 7);

const { proposal } = createProposalRecord(data, {
  jobId: "job-001",
  jobTitle: data.jobs[0].title,
  content: "Beste TechFlow, ik lever jullie dashboard binnen 5 weken op met Next.js en TypeScript.",
  proposedRate: 85,
  currency: "EUR",
  status: "draft",
});
assert("Proposal", proposal.id.startsWith("prop-"));

// v0.3
const proj = createProjectRecord(data, {
  title: "Dashboard MVP",
  client: "TechFlow BV",
  status: "active",
  hourlyRate: 85,
  hoursLogged: 0,
  deadline: "2026-10-15",
  notes: "Kickoff",
});
data = proj.data;
assert("Project", proj.project.id.startsWith("proj-"));

const inv = createInvoiceRecord(data, {
  client: "TechFlow BV",
  projectId: proj.project.id,
  lines: [{ description: "Development", quantity: 32, unitPrice: 85 }],
  currency: "EUR",
  dueDate: "2026-10-01",
});
const formatted = formatInvoice(inv.invoice);
assert("Invoice", formatted.includes("2720.00"));

console.log(`\nv1.0 core — ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
