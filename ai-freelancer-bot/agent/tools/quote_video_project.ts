import { defineTool } from "eve/tools";
import { z } from "zod";
import { getData } from "../lib/store";

const VIDEO_TYPES = {
  youtube_long: { baseHours: 8, label: "YouTube long-form (8-15 min)" },
  youtube_short: { baseHours: 2, label: "YouTube Short / Reel" },
  corporate: { baseHours: 12, label: "Corporate / brand video" },
  podcast_clip: { baseHours: 1.5, label: "Podcast clip pack (5 clips)" },
  course: { baseHours: 20, label: "Online course module" },
  faceless_automation: { baseHours: 6, label: "Faceless/automated pipeline setup" },
} as const;

export default defineTool({
  description:
    "Bereken een offerte voor video-editing projecten: shorts, long-form, corporate, podcast clips, courses en faceless automation pipelines.",
  inputSchema: z.object({
    videoType: z.enum(["youtube_long", "youtube_short", "corporate", "podcast_clip", "course", "faceless_automation"]),
    quantity: z.number().min(1).default(1).describe("Aantal video's of deliverables"),
    complexity: z.enum(["basic", "standard", "premium"]).default("standard"),
    includes: z
      .object({
        colorGrading: z.boolean().optional(),
        motionGraphics: z.boolean().optional(),
        subtitles: z.boolean().optional(),
        stockFootage: z.boolean().optional(),
        aiVoiceover: z.boolean().optional(),
        revisionRounds: z.number().min(0).max(5).optional(),
      })
      .optional(),
    hourlyRate: z.number().positive().optional(),
    currency: z.string().optional(),
  }),
  label: {
    start: ({ videoType, quantity }) => `Video offerte: ${quantity}x ${videoType}`,
  },
  async execute({ videoType, quantity, complexity, includes, hourlyRate, currency }) {
    const profile = getData().profile;
    const rate = hourlyRate ?? (profile.hourlyRate > 0 ? profile.hourlyRate : 65);
    const curr = currency ?? profile.currency ?? "EUR";

    const typeConfig = VIDEO_TYPES[videoType];
    const complexityMultiplier = { basic: 0.75, standard: 1.0, premium: 1.5 }[complexity];

    let hours = typeConfig.baseHours * quantity * complexityMultiplier;

    const addOns: string[] = [];
    if (includes?.colorGrading) { hours += 2 * quantity; addOns.push("Color grading (+2u/video)"); }
    if (includes?.motionGraphics) { hours += 4 * quantity; addOns.push("Motion graphics (+4u/video)"); }
    if (includes?.subtitles) { hours += 0.5 * quantity; addOns.push("Ondertiteling (+0.5u/video)"); }
    if (includes?.stockFootage) { hours += 1 * quantity; addOns.push("Stock footage research (+1u/video)"); }
    if (includes?.aiVoiceover) { hours += 1.5 * quantity; addOns.push("AI voiceover setup (+1.5u/video)"); }
    if (includes?.revisionRounds) { hours += includes.revisionRounds * 0.5 * quantity; addOns.push(`${includes.revisionRounds} revisierondes`); }

    const subtotal = Math.round(hours * rate);
    const buffer = Math.round(subtotal * 0.15);
    const total = subtotal + buffer;

    const deliveryDays = Math.ceil(hours / 6);

    return {
      projectType: typeConfig.label,
      quantity,
      complexity,
      estimatedHours: Math.round(hours * 10) / 10,
      hourlyRate: `${rate} ${curr}`,
      pricing: {
        subtotal: `${subtotal} ${curr}`,
        buffer15pct: `${buffer} ${curr}`,
        recommendedFixed: `${total} ${curr}`,
        rushOption: `${Math.round(total * 1.3)} ${curr} (50% sneller)`,
      },
      deliveryEstimate: `${deliveryDays}-${deliveryDays + 2} werkdagen`,
      addOns,
      breakdown: [
        `${quantity}x ${typeConfig.label}`,
        `Complexiteit: ${complexity} (×${complexityMultiplier})`,
        `Basisschatting: ${typeConfig.baseHours}u per stuk`,
        ...addOns,
      ],
      clientPitch:
        `Voor ${quantity}x ${typeConfig.label.toLowerCase()} schat ik ${Math.round(hours)} uur in tegen ${rate} ${curr}/uur. ` +
        `Aanbevolen fixed price: **${total} ${curr}** (incl. 15% scope-buffer). Levering binnen ${deliveryDays}-${deliveryDays + 2} werkdagen.`,
    };
  },
});
