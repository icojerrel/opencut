import { defineTool } from "eve/tools";
import { z } from "zod";
import { getData, matchJobsToProfile, searchJobs } from "../lib/store";

export default defineTool({
  description:
    "Zoek freelance opdrachten in de job board. Filter op skills, platform, status of zoekterm. Gebruik matchProfile=true om opdrachten te rangschikken op basis van het profiel van de gebruiker.",
  inputSchema: z.object({
    query: z.string().optional().describe("Vrije zoekterm in titel, beschrijving of client"),
    skills: z.array(z.string()).optional().describe("Filter op vereiste skills"),
    platform: z.string().optional().describe("Platform filter, bijv. Upwork, LinkedIn"),
    status: z.enum(["open", "applied", "won", "lost", "closed"]).optional(),
    matchProfile: z.boolean().optional().describe("Rangschik opdrachten op profiel-match"),
    limit: z.number().min(1).max(20).optional(),
  }),
  label: {
    start: ({ query, matchProfile }) =>
      matchProfile ? "Zoek beste matches voor jouw profiel" : `Zoek opdrachten${query ? `: ${query}` : ""}`,
  },
  async execute({ query, skills, platform, status, matchProfile, limit = 10 }) {
    const data = getData();

    if (matchProfile) {
      const matches = matchJobsToProfile(data.profile).slice(0, limit);
      return {
        count: matches.length,
        profileSkills: data.profile.skills,
        jobs: matches,
      };
    }

    const jobs = searchJobs({ query, skills, platform, status: status ?? "open" }).slice(0, limit);
    return { count: jobs.length, jobs };
  },
});
