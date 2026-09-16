import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defaultData } from "./default-data.ts";
import type { FreelancerData } from "./types.ts";

function dataDir(): string {
  return process.env.FREELANCEBOT_DATA_DIR ?? join(process.cwd(), "data");
}

function dataFilePath(): string {
  return join(dataDir(), "freelancer-data.json");
}

export function loadPersistedData(): FreelancerData | null {
  try {
    const raw = readFileSync(dataFilePath(), "utf8");
    const parsed = JSON.parse(raw) as FreelancerData;
    if (!parsed.profile || !Array.isArray(parsed.jobs)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedData(data: FreelancerData): void {
  const file = dataFilePath();
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  renameSync(tmp, file);
}

export function loadOrDefault(): FreelancerData {
  return loadPersistedData() ?? defaultData();
}
