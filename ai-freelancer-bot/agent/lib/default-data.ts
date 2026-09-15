import type { FreelancerData } from "./types";

export const defaultData = (): FreelancerData => ({
  profile: {
    name: "",
    title: "Freelancer",
    skills: [],
    hourlyRate: 75,
    currency: "EUR",
    experienceYears: 3,
    bio: "",
    portfolio: [],
    availability: "available",
  },
  jobs: [
    {
      id: "job-001",
      title: "Next.js dashboard voor SaaS startup",
      client: "TechFlow BV",
      description:
        "We zoeken een ervaren frontend developer voor een analytics dashboard. React/Next.js, TypeScript, Tailwind. Duur: 4-6 weken.",
      budget: "€4.000 - €6.000",
      skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      platform: "LinkedIn",
      postedAt: "2026-09-10",
      status: "open",
    },
    {
      id: "job-002",
      title: "AI chatbot integratie in bestaande webapp",
      client: "RetailPlus",
      description:
        "Integratie van een AI-assistent (OpenAI/Claude) in onze e-commerce platform. API design, streaming responses, rate limiting.",
      budget: "€80/uur",
      skills: ["AI", "Node.js", "API", "Python"],
      platform: "Upwork",
      postedAt: "2026-09-12",
      status: "open",
    },
    {
      id: "job-003",
      title: "Video editing automation pipeline",
      client: "ContentCreator Co",
      description:
        "Automatiseer short-form video productie: script → TTS → visuals → export. Remotion of FFmpeg. Python preferred.",
      budget: "€3.500 fixed",
      skills: ["Python", "FFmpeg", "Remotion", "Automation"],
      platform: "Direct",
      postedAt: "2026-09-14",
      status: "open",
    },
    {
      id: "job-004",
      title: "WordPress naar headless CMS migratie",
      client: "MediaGroep NL",
      description:
        "Migratie van 200+ artikelen naar Sanity CMS met Next.js frontend. SEO behoud, redirect mapping.",
      budget: "€5.000 - €8.000",
      skills: ["Next.js", "Sanity", "WordPress", "SEO"],
      platform: "Freelance.nl",
      postedAt: "2026-09-08",
      status: "open",
    },
    {
      id: "job-005",
      title: "Mobile app MVP (React Native)",
      client: "FitStart",
      description:
        "MVP fitness tracking app: onboarding, workout logging, basic analytics. iOS + Android. 8 weken timeline.",
      budget: "€10.000 fixed",
      skills: ["React Native", "TypeScript", "Firebase"],
      platform: "Upwork",
      postedAt: "2026-09-13",
      status: "open",
    },
  ],
  proposals: [],
  projects: [],
  invoices: [],
});
