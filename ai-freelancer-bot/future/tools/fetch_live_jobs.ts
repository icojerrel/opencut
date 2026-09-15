import { defineTool } from "eve/tools";
import { z } from "zod";
import { fetchLiveJobs, liveJobToListing } from "../lib/job-sources";
import { addJob, getData } from "../lib/store";

export default defineTool({
  description:
    "Haal live freelance opdrachten op van Remotive, RemoteOK, Jobicy, Arbeitnow en Upwork (RSS). Optioneel importeer resultaten naar de lokale job board.",
  inputSchema: z.object({
    query: z.string().min(1).describe("Zoekterm, bijv. 'video editing', 'next.js', 'remotion'"),
    sources: z
      .array(z.enum(["remotive", "remoteok", "jobicy", "arbeitnow", "upwork", "all"]))
      .optional()
      .describe("Bronnen om te doorzoeken. Default: remotive, remoteok, jobicy"),
    limit: z.number().min(1).max(30).optional(),
    importToBoard: z.boolean().optional().describe("Importeer gevonden jobs naar lokale job board"),
  }),
  label: {
    start: ({ query }) => `Live opdrachten ophalen: ${query}`,
  },
  async execute({ query, sources, limit, importToBoard }) {
    const result = await fetchLiveJobs({ query, sources, limit });

    let imported = 0;
    if (importToBoard) {
      const existingIds = new Set(getData().jobs.map((j) => j.id));
      for (const job of result.jobs) {
        if (existingIds.has(job.id)) continue;
        const listing = liveJobToListing(job);
        addJob({
          title: listing.title,
          client: listing.client,
          description: listing.description,
          budget: listing.budget,
          skills: listing.skills,
          platform: listing.platform,
        });
        imported++;
      }
    }

    return {
      count: result.jobs.length,
      imported,
      errors: result.errors,
      jobs: result.jobs.map((j) => ({
        id: j.id,
        title: j.title,
        client: j.client,
        platform: j.platform,
        budget: j.budget,
        skills: j.skills,
        url: j.url,
        postedAt: j.postedAt,
      })),
    };
  },
});
