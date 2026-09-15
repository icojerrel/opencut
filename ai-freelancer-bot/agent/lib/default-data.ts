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
        "Analytics dashboard bouwen met React/Next.js, TypeScript en Tailwind. Duur: 4-6 weken, remote.",
      budget: "€4.000 - €6.000",
      skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      platform: "LinkedIn",
      postedAt: "2026-09-10",
      status: "open",
    },
    {
      id: "job-002",
      title: "AI chatbot integratie in webapp",
      client: "RetailPlus",
      description:
        "AI-assistent integreren in e-commerce platform. API design, streaming, rate limiting. Node.js of Python.",
      budget: "€80/uur",
      skills: ["AI", "Node.js", "API", "Python"],
      platform: "Upwork",
      postedAt: "2026-09-12",
      status: "open",
    },
    {
      id: "job-003",
      title: "WordPress naar headless CMS migratie",
      client: "MediaGroep NL",
      description:
        "200+ artikelen migreren naar Sanity CMS met Next.js frontend. SEO behoud en redirect mapping.",
      budget: "€5.000 - €8.000",
      skills: ["Next.js", "Sanity", "WordPress", "SEO"],
      platform: "Freelance.nl",
      postedAt: "2026-09-08",
      status: "open",
    },
  ],
  proposals: [],
  projects: [],
  invoices: [],
});
