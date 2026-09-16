/**
 * Persistence tests — data overleeft "herstart" (nieuwe load).
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultData } from "../agent/lib/default-data.js";
import { loadOrDefault, loadPersistedData, savePersistedData } from "../agent/lib/persistence.js";

const dir = mkdtempSync(join(tmpdir(), "freelancebot-test-"));
process.env.FREELANCEBOT_DATA_DIR = dir;

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean) {
  if (condition) {
    passed++;
    console.log(`✓ ${name}`);
  } else {
    failed++;
    console.error(`✗ ${name}`);
  }
}

const initial = loadOrDefault();
assert("Fresh load uses defaults", initial.jobs.length === 6);

const custom = {
  ...defaultData(),
  profile: { ...defaultData().profile, name: "Persisted User", hourlyRate: 99 },
};
savePersistedData(custom);

const reloaded = loadPersistedData();
assert("Reload preserves profile name", reloaded?.profile.name === "Persisted User");
assert("Reload preserves hourly rate", reloaded?.profile.hourlyRate === 99);

savePersistedData({
  ...custom,
  proposals: [
    {
      id: "prop-test",
      jobId: "job-001",
      jobTitle: "Test",
      content: "Hello",
      proposedRate: 99,
      currency: "EUR",
      status: "draft",
      createdAt: "2026-09-16",
    },
  ],
});
assert("Proposals persist", loadPersistedData()?.proposals.length === 1);

rmSync(dir, { recursive: true, force: true });
console.log(`\nPersistence — ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
