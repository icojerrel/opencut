/**
 * Persistence tests — data overleeft "herstart" (nieuwe load).
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadOrDefault, loadPersistedData, savePersistedData } from "../agent/lib/persistence.ts";
import { defaultData } from "../agent/lib/default-data.ts";

const dir = mkdtempSync(join(tmpdir(), "freelancebot-test-"));
process.env.FREELANCEBOT_DATA_DIR = dir;

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) { passed++; console.log(`✓ ${name}`); }
  else { failed++; console.error(`✗ ${name}`); }
}

// Fresh load → defaults
const initial = loadOrDefault();
assert("Fresh load uses defaults", initial.jobs.length === 6);

// Save custom data
const custom = {
  ...defaultData(),
  profile: { ...defaultData().profile, name: "Persisted User", hourlyRate: 99 },
};
savePersistedData(custom);

// Simulate server restart: new process would call loadOrDefault again
const reloaded = loadPersistedData();
assert("Reload preserves profile name", reloaded?.profile.name === "Persisted User");
assert("Reload preserves hourly rate", reloaded?.profile.hourlyRate === 99);

// Update and re-read
savePersistedData({
  ...custom,
  proposals: [{ id: "prop-test", jobId: "job-001", jobTitle: "Test", content: "Hello", proposedRate: 99, currency: "EUR", status: "draft", createdAt: "2026-09-16" }],
});
const withProposal = loadPersistedData();
assert("Proposals persist", withProposal?.proposals.length === 1);

rmSync(dir, { recursive: true, force: true });
console.log(`\nPersistence — ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
