/**
 * FreelanceBot's eerste klantenjacht: profiel, live jobs, match, proposal.
 * Run: npx tsx scripts/hunt-first-client.ts
 */
import { defaultData } from "../agent/lib/default-data.js";
import { fetchLiveJobs, liveJobToListing } from "../agent/lib/job-sources.js";
import {
  createJobRecord,
  createProjectRecord,
  createProposalRecord,
  matchJobsToProfile,
} from "../agent/lib/logic.js";
import { loadOrDefault, savePersistedData } from "../agent/lib/persistence.js";
import type { FreelancerData, FreelancerProfile, JobListing } from "../agent/lib/types.js";

function buildProposal(job: JobListing, profile: FreelancerProfile): string {
  const skillOverlap = job.skills.filter((s) =>
    profile.skills.some((ps) => s.toLowerCase().includes(ps.toLowerCase()) || ps.toLowerCase().includes(s.toLowerCase())),
  );

  return `Hoi ${job.client.split(" ")[0] || job.client},

Ik las jullie opdracht "${job.title}" en denk direct: dit past bij wat ik dagelijks bouw.

**Waarom ik**
- ${profile.title} met ${profile.experienceYears}+ jaar ervaring
- Sterk in: ${skillOverlap.length > 0 ? skillOverlap.join(", ") : profile.skills.slice(0, 4).join(", ")}
- Beschikbaar: ${profile.availability === "available" ? "direct starten" : "beperkt beschikbaar"}

**Aanpak**
1. Kick-off (30 min) — scope, deliverables, timeline
2. Iteratief werken met korte feedbackloops
3. Oplevering + documentatie

**Investering**
€${profile.hourlyRate}/uur · transparante uren · geen verrassingen achteraf

Ik zou graag 15 minuten inplannen om te horen waar jullie nu tegenaan lopen.

Groet,
${profile.name}`;
}

async function main() {
  console.log("🤖 FreelanceBot — eerste klantenjacht\n");

  let data: FreelancerData = {
    ...defaultData(),
    profile: {
      name: "FreelanceBot",
      title: "Full-stack AI Developer",
      skills: ["Next.js", "React", "TypeScript", "AI", "Node.js", "Tailwind CSS"],
      hourlyRate: 85,
      currency: "EUR",
      experienceYears: 5,
      bio: "AI-native freelancer: snelle MVP's, chatbots, dashboards en automatisering.",
      portfolio: ["https://ai-freelancer-bot.vercel.app"],
      availability: "available",
    },
    proposals: [],
    projects: [],
    invoices: [],
  };

  console.log(`✓ Profiel: ${data.profile.title} · €${data.profile.hourlyRate}/u\n`);

  const queries = ["next.js developer", "react freelance", "AI integration"];

  for (const query of queries) {
    console.log(`→ Live jobs ophalen: "${query}"…`);
    const result = await fetchLiveJobs({ query, limit: 8, sources: ["remotive", "remoteok", "jobicy"] });
    const existingIds = new Set(data.jobs.map((j) => j.id));
    let added = 0;

    for (const job of result.jobs) {
      if (existingIds.has(job.id)) continue;
      const listing = liveJobToListing(job);
      const created = createJobRecord(data, {
        title: listing.title,
        client: listing.client,
        description: listing.description,
        budget: listing.budget,
        skills: listing.skills,
        platform: listing.platform,
      });
      data = created.data;
      added++;
    }

    if (result.errors.length) {
      for (const err of result.errors) console.log(`  ⚠ ${err}`);
    }
    console.log(`  ${result.jobs.length} gevonden, ${added} nieuw toegevoegd\n`);
  }

  const matches = matchJobsToProfile(data, data.profile);
  const top = matches.find((j) => j.matchScore > 0) ?? matches[0];

  if (!top) {
    console.log("✗ Geen opdrachten gevonden.");
    process.exit(1);
  }

  console.log("═══════════════════════════════════════");
  console.log("  TOP MATCH — EERSTE KLANTKANDIDAAT");
  console.log("═══════════════════════════════════════");
  console.log(`  Titel:    ${top.title}`);
  console.log(`  Klant:    ${top.client}`);
  console.log(`  Platform: ${top.platform}`);
  console.log(`  Budget:   ${top.budget}`);
  console.log(`  Match:    ${top.matchScore}%`);
  console.log(`  Skills:   ${top.skills.join(", ")}`);
  console.log("───────────────────────────────────────\n");

  const proposalContent = buildProposal(top, data.profile);
  const proposalResult = createProposalRecord(data, {
    jobId: top.id,
    jobTitle: top.title,
    content: proposalContent,
    proposedRate: data.profile.hourlyRate,
    currency: data.profile.currency,
    status: "sent",
  });
  data = proposalResult.data;

  data = {
    ...data,
    jobs: data.jobs.map((j) => (j.id === top.id ? { ...j, status: "applied" as const } : j)),
  };

  const projectResult = createProjectRecord(data, {
    title: top.title,
    client: top.client,
    status: "active",
    hourlyRate: data.profile.hourlyRate,
    hoursLogged: 0,
    deadline: null,
    notes: `Eerste klantenjacht — proposal ${proposalResult.proposal.id} verstuurd. Wachten op reactie.`,
  });
  data = projectResult.data;

  savePersistedData(data);

  console.log(`✓ Proposal opgeslagen: ${proposalResult.proposal.id}`);
  console.log(`✓ Project gestart: ${projectResult.project.id} (${projectResult.project.client})\n`);
  console.log("─── PROPOSAL PREVIEW ───\n");
  console.log(proposalContent);
  console.log("\n─── OVERZICHT ───");
  console.log(`  Jobs: ${data.jobs.length} · Proposals: ${data.proposals.length} · Projecten: ${data.projects.length}`);
  console.log(`  Opgeslagen in: data/freelancer-data.json\n`);

  console.log("─── TOP 5 MATCHES ───");
  for (const m of matches.slice(0, 5)) {
    console.log(`  [${m.matchScore}%] ${m.title} @ ${m.client} (${m.platform})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
