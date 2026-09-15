/**
 * Core logic tests — runs without AI Gateway credentials.
 */
import { defaultData } from "../agent/lib/default-data.ts";
import {
  calculateRate,
  createInvoiceRecord,
  createProposalRecord,
  formatInvoice,
  matchJobsToProfile,
  searchJobsInData,
} from "../agent/lib/logic.ts";

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(`✓ ${name}`);
  } else {
    failed++;
    console.error(`✗ ${name}`);
  }
}

let data = defaultData();
data = { ...data, profile: { ...data.profile, name: "Jerrel", title: "Senior Next.js Developer", skills: ["Next.js", "React", "TypeScript"], hourlyRate: 95, experienceYears: 8 } };

assert("Profile setup", data.profile.name === "Jerrel" && data.profile.hourlyRate === 95);

const nextJobs = searchJobsInData(data, { skills: ["Next.js"] });
assert("Search by skill", nextJobs.length >= 1);

const matches = matchJobsToProfile(data, data.profile);
assert("Profile matching returns jobs", matches.length > 0);
assert("Top match has score", matches[0].matchScore >= 0);
console.log(`  Top match: ${matches[0].title} (${matches[0].matchScore}%)`);

const rate = calculateRate({
  experienceYears: 8,
  skillLevel: "senior",
  projectType: "fixed",
  complexity: "medium",
  market: "nl",
});
assert("Rate calculation", rate.hourlyRate.recommended > 50);
console.log(`  Recommended rate: €${rate.hourlyRate.recommended}/uur`);

const fixed40h = Math.round(rate.hourlyRate.recommended * 40 * rate.fixedMultiplier);
console.log(`  Fixed 40h price: €${fixed40h}`);
assert("Fixed price calc", fixed40h > 2000);

const job = data.jobs[0];
const proposalResult = createProposalRecord(data, {
  jobId: job.id,
  jobTitle: job.title,
  content: "Beste client, ik heb 8 jaar ervaring met Next.js en kan dit project binnen 5 weken opleveren...",
  proposedRate: 95,
  currency: "EUR",
  status: "draft",
});
data = proposalResult.data;
assert("Proposal saved", proposalResult.proposal.id.startsWith("prop-"));

const invoiceResult = createInvoiceRecord(data, {
  client: "TechFlow BV",
  lines: [{ description: "Development uren", quantity: 32, unitPrice: 95 }],
  currency: "EUR",
  dueDate: "2026-10-01",
});
const formatted = formatInvoice(invoiceResult.invoice);
assert("Invoice generated", formatted.includes("3040.00"));
assert("Invoice has client name", formatted.includes("TechFlow BV"));

console.log("\n--- Invoice preview ---");
console.log(formatted);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
