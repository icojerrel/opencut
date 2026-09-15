import { defineTool } from "eve/tools";
import { z } from "zod";
import { calculateRate, getData } from "../lib/store";

export default defineTool({
  description:
    "Bereken een aanbevolen uurtarief op basis van ervaring, skill-niveau, projectcomplexiteit en markt (NL/EU/US).",
  inputSchema: z.object({
    skillLevel: z.enum(["junior", "mid", "senior", "expert"]).optional(),
    projectType: z.enum(["hourly", "fixed"]).optional(),
    complexity: z.enum(["low", "medium", "high"]).optional(),
    market: z.enum(["nl", "eu", "us"]).optional(),
    estimatedHours: z.number().positive().optional().describe("Geschatte uren voor fixed-price berekening"),
  }),
  label: {
    start: () => "Tarief berekenen",
  },
  async execute({ skillLevel, projectType, complexity, market, estimatedHours }) {
    const profile = getData().profile;

    const result = calculateRate({
      experienceYears: profile.experienceYears,
      skillLevel: skillLevel ?? (profile.experienceYears >= 8 ? "expert" : profile.experienceYears >= 5 ? "senior" : profile.experienceYears >= 2 ? "mid" : "junior"),
      projectType: projectType ?? "hourly",
      complexity: complexity ?? "medium",
      market: market ?? "nl",
    });

    const response: Record<string, unknown> = {
      currency: result.currency,
      hourlyRate: result.hourlyRate,
      reasoning: result.reasoning,
      profileRate: profile.hourlyRate > 0 ? `${profile.hourlyRate} ${profile.currency}` : "Nog niet ingesteld",
    };

    if (estimatedHours) {
      const fixedBase = result.hourlyRate.recommended * estimatedHours;
      const fixedRecommended = Math.round(fixedBase * result.fixedMultiplier);
      response.fixedPrice = {
        estimatedHours,
        min: Math.round(result.hourlyRate.min * estimatedHours * result.fixedMultiplier),
        recommended: fixedRecommended,
        max: Math.round(result.hourlyRate.max * estimatedHours * result.fixedMultiplier),
        currency: result.currency,
      };
    }

    return response;
  },
});
