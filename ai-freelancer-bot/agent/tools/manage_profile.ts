import { defineTool } from "eve/tools";
import { z } from "zod";
import { getData, updateProfile } from "../lib/store";

export default defineTool({
  description:
    "Bekijk of update het freelancer-profiel: naam, titel, skills, uurtarief, bio, portfolio en beschikbaarheid.",
  inputSchema: z.object({
    action: z.enum(["get", "update"]),
    name: z.string().optional(),
    title: z.string().optional(),
    skills: z.array(z.string()).optional(),
    hourlyRate: z.number().positive().optional(),
    currency: z.string().optional(),
    experienceYears: z.number().min(0).optional(),
    bio: z.string().optional(),
    portfolio: z.array(z.string()).optional(),
    availability: z.enum(["available", "limited", "unavailable"]).optional(),
  }),
  label: {
    start: ({ action }) => (action === "get" ? "Profiel ophalen" : "Profiel bijwerken"),
  },
  async execute({ action, ...updates }) {
    if (action === "get") {
      return { profile: getData().profile };
    }

    const cleaned = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );

    if (Object.keys(cleaned).length === 0) {
      return { success: false, error: "Geen velden om bij te werken" };
    }

    const profile = updateProfile(cleaned);
    return { success: true, profile };
  },
});
