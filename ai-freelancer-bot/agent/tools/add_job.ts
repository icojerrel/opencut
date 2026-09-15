import { defineTool } from "eve/tools";
import { z } from "zod";
import { addJob } from "../lib/store";

export default defineTool({
  description: "Voeg een nieuwe freelance opdracht toe aan de job board (bijv. gevonden op LinkedIn of via netwerk).",
  inputSchema: z.object({
    title: z.string().min(3),
    client: z.string().min(1),
    description: z.string().min(10),
    budget: z.string(),
    skills: z.array(z.string()).min(1),
    platform: z.string().default("Handmatig"),
  }),
  label: {
    start: ({ title }) => `Opdracht toevoegen: ${title}`,
  },
  async execute(input) {
    const job = addJob(input);
    return { success: true, job };
  },
});
