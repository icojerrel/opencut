import { defineTool } from "eve/tools";
import { z } from "zod";
import { getData, saveProposal, searchJobs } from "../lib/store";

export default defineTool({
  description:
    "Sla een proposal op voor een opdracht. Gebruik dit nadat je een proposal hebt geschreven zodat de gebruiker het kan terugvinden.",
  inputSchema: z.object({
    jobId: z.string().describe("ID van de opdracht"),
    content: z.string().min(50).describe("Volledige proposal tekst"),
    proposedRate: z.number().positive().describe("Voorgesteld uurtarief of totaalbedrag"),
    currency: z.string().default("EUR"),
    status: z.enum(["draft", "sent"]).default("draft"),
  }),
  label: {
    start: ({ jobId }) => `Proposal opslaan voor opdracht ${jobId}`,
  },
  async execute({ jobId, content, proposedRate, currency, status }) {
    const job = searchJobs({}).find((j) => j.id === jobId);
    if (!job) {
      return { success: false, error: `Opdracht ${jobId} niet gevonden` };
    }

    const proposal = saveProposal({
      jobId,
      jobTitle: job.title,
      content,
      proposedRate,
      currency,
      status,
    });

    return {
      success: true,
      proposal: {
        id: proposal.id,
        jobTitle: proposal.jobTitle,
        proposedRate: `${proposal.proposedRate} ${proposal.currency}`,
        status: proposal.status,
        preview: proposal.content.slice(0, 200) + (proposal.content.length > 200 ? "..." : ""),
      },
    };
  },
});
