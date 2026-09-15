import { defaultData } from "../agent/lib/default-data.ts";

// Simulate quote_video_project logic
const VIDEO_TYPES = {
  youtube_short: { baseHours: 2, label: "YouTube Short / Reel" },
  faceless_automation: { baseHours: 6, label: "Faceless/automated pipeline setup" },
};

function quote(videoType, quantity, complexity, rate = 75) {
  const type = VIDEO_TYPES[videoType];
  const mult = { basic: 0.75, standard: 1.0, premium: 1.5 }[complexity];
  const hours = type.baseHours * quantity * mult;
  const total = Math.round(hours * rate * 1.15);
  return { hours, total, label: type.label };
}

const shorts = quote("youtube_short", 5, "standard");
const pipeline = quote("faceless_automation", 1, "premium", 95);

console.log("✓ 5x YouTube Shorts:", `${shorts.total} EUR (${shorts.hours}u)`);
console.log("✓ Faceless pipeline:", `${pipeline.total} EUR (${pipeline.hours}u)`);

const data = defaultData();
const videoJobs = data.jobs.filter((j) =>
  j.skills.some((s) => /video|remotion|premiere|youtube|tiktok/i.test(s)),
);
console.log(`✓ ${videoJobs.length} video niche jobs in seed data`);
process.exit(0);
