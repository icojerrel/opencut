import type {
  FreelancerData,
  FreelancerProfile,
  Invoice,
  InvoiceLine,
  JobListing,
  JobStatus,
  Project,
  Proposal,
} from "./types";

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function searchJobsInData(
  data: FreelancerData,
  params: {
    query?: string;
    skills?: string[];
    platform?: string;
    status?: JobStatus;
  },
): JobListing[] {
  const q = params.query?.toLowerCase();

  return data.jobs.filter((job) => {
    if (params.status && job.status !== params.status) return false;
    if (params.platform && job.platform.toLowerCase() !== params.platform.toLowerCase()) return false;
    if (params.skills?.length) {
      const jobSkills = job.skills.map((s) => s.toLowerCase());
      const hasSkill = params.skills.some((s) => jobSkills.some((js) => js.includes(s.toLowerCase())));
      if (!hasSkill) return false;
    }
    if (q) {
      const haystack = `${job.title} ${job.description} ${job.client} ${job.skills.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function matchJobsToProfile(
  data: FreelancerData,
  profile: FreelancerProfile,
): Array<JobListing & { matchScore: number }> {
  const openJobs = searchJobsInData(data, { status: "open" });
  const userSkills = profile.skills.map((s) => s.toLowerCase());

  return openJobs
    .map((job) => {
      const jobSkills = job.skills.map((s) => s.toLowerCase());
      const matches = userSkills.filter((us) => jobSkills.some((js) => js.includes(us) || us.includes(js)));
      const matchScore = userSkills.length ? Math.round((matches.length / jobSkills.length) * 100) : 0;
      return { ...job, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function calculateRate(params: {
  experienceYears: number;
  skillLevel: "junior" | "mid" | "senior" | "expert";
  projectType: "hourly" | "fixed";
  complexity: "low" | "medium" | "high";
  market: "nl" | "eu" | "us";
}): {
  hourlyRate: { min: number; recommended: number; max: number };
  fixedMultiplier: number;
  currency: string;
  reasoning: string[];
} {
  const baseRates = { nl: 55, eu: 65, us: 85 };
  const levelMultipliers = { junior: 0.7, mid: 1.0, senior: 1.35, expert: 1.75 };
  const complexityMultipliers = { low: 0.85, medium: 1.0, high: 1.25 };
  const expBonus = Math.min(params.experienceYears * 2, 20);

  const base = baseRates[params.market];
  const level = levelMultipliers[params.skillLevel];
  const complexity = complexityMultipliers[params.complexity];
  const recommended = Math.round(base * level * complexity + expBonus);

  const currency = params.market === "us" ? "USD" : "EUR";
  const reasoning = [
    `Basistarief ${params.market.toUpperCase()}: €${base}/uur equivalent`,
    `Niveau (${params.skillLevel}): ×${level}`,
    `Complexiteit (${params.complexity}): ×${complexity}`,
    `Ervaringsbonus (+${expBonus}): ${params.experienceYears} jaar`,
  ];

  return {
    hourlyRate: {
      min: Math.round(recommended * 0.85),
      recommended,
      max: Math.round(recommended * 1.25),
    },
    fixedMultiplier: params.projectType === "fixed" ? 1.15 : 1.0,
    currency,
    reasoning,
  };
}

export function formatInvoice(invoice: Invoice): string {
  const subtotal = invoice.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  const lines = invoice.lines
    .map(
      (l) =>
        `  ${l.description.padEnd(40)} ${String(l.quantity).padStart(4)} × ${l.unitPrice.toFixed(2).padStart(8)} ${invoice.currency}`,
    )
    .join("\n");

  return [
    "═══════════════════════════════════════",
    "              FACTUUR",
    "═══════════════════════════════════════",
    `Factuurnummer: ${invoice.id}`,
    `Klant:         ${invoice.client}`,
    `Datum:         ${invoice.createdAt.slice(0, 10)}`,
    `Vervaldatum:   ${invoice.dueDate}`,
    `Status:        ${invoice.status}`,
    "───────────────────────────────────────",
    lines,
    "───────────────────────────────────────",
    `Totaal:        ${subtotal.toFixed(2)} ${invoice.currency}`,
    "═══════════════════════════════════════",
  ].join("\n");
}

export function createProposalRecord(
  data: FreelancerData,
  proposal: Omit<Proposal, "id" | "createdAt">,
): { data: FreelancerData; proposal: Proposal } {
  const created: Proposal = {
    ...proposal,
    id: generateId("prop"),
    createdAt: new Date().toISOString(),
  };
  return { data: { ...data, proposals: [...data.proposals, created] }, proposal: created };
}

export function createJobRecord(
  data: FreelancerData,
  job: Omit<JobListing, "id" | "postedAt" | "status">,
): { data: FreelancerData; job: JobListing } {
  const created: JobListing = {
    ...job,
    id: generateId("job"),
    postedAt: new Date().toISOString().slice(0, 10),
    status: "open",
  };
  return { data: { ...data, jobs: [...data.jobs, created] }, job: created };
}

export function createProjectRecord(
  data: FreelancerData,
  project: Omit<Project, "id" | "createdAt">,
): { data: FreelancerData; project: Project } {
  const created: Project = {
    ...project,
    id: generateId("proj"),
    createdAt: new Date().toISOString(),
  };
  return { data: { ...data, projects: [...data.projects, created] }, project: created };
}

export function createInvoiceRecord(
  data: FreelancerData,
  params: {
    client: string;
    projectId?: string;
    lines: InvoiceLine[];
    currency: string;
    dueDate: string;
  },
): { data: FreelancerData; invoice: Invoice } {
  const invoice: Invoice = {
    id: generateId("inv"),
    projectId: params.projectId ?? null,
    client: params.client,
    lines: params.lines,
    currency: params.currency,
    dueDate: params.dueDate,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  return { data: { ...data, invoices: [...data.invoices, invoice] }, invoice };
}
