/**
 * Live job fetch tests — requires network access.
 */
import { fetchLiveJobs, fetchUpworkJobs } from "../agent/lib/job-sources.ts";

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) { passed++; console.log(`✓ ${name}`); }
  else { failed++; console.error(`✗ ${name}`); }
}

console.log("Fetching live video editing jobs...\n");
const result = await fetchLiveJobs({
  query: "video",
  sources: ["jobicy", "remoteok"],
  limit: 5,
});

assert("Returns jobs", result.jobs.length > 0);
assert("Has job titles", result.jobs.every((j) => j.title.length > 0));
console.log(`  Found ${result.jobs.length} jobs`);
for (const job of result.jobs.slice(0, 3)) {
  console.log(`  - [${job.platform}] ${job.title} @ ${job.client}`);
}

console.log("\nTesting Upwork RSS (may be blocked)...");
const upwork = await fetchUpworkJobs("video editing", 3);
if (upwork.warning) {
  console.log(`  ⚠ ${upwork.warning}`);
  assert("Upwork gracefully handles block", upwork.jobs.length === 0);
} else {
  assert("Upwork returns jobs", upwork.jobs.length > 0);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
