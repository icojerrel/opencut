import type { JobListing } from "./types";

export type LiveJobSource = "remotive" | "remoteok" | "jobicy" | "arbeitnow" | "upwork" | "all";

export interface LiveJobResult {
  id: string;
  title: string;
  client: string;
  description: string;
  budget: string;
  skills: string[];
  platform: string;
  postedAt: string;
  url: string;
  source: LiveJobSource;
}

const USER_AGENT = "FreelanceBot/1.0 (+https://github.com/icojerrel/opencut)";

async function fetchJson<T>(url: string, timeoutMs = 15000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string, timeoutMs = 15000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml", "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssItems(xml: string): Array<{ title: string; link: string; description: string; pubDate: string }> {
  const items: Array<{ title: string; link: string; description: string; pubDate: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() ?? "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? "";
    const description =
      block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() ?? "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() ?? "";
    if (title) items.push({ title, link, description, pubDate });
  }

  return items;
}

function matchesQuery(title: string, text: string, query: string): boolean {
  if (!query.trim()) return true;
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (!terms.length) return true;
  const excerpt = `${title} ${text}`.toLowerCase().slice(0, 500);
  return terms.some((t) => excerpt.includes(t));
}

function inferSkills(text: string): string[] {
  const keywords = [
    "Next.js", "React", "TypeScript", "Python", "Node.js", "Video Editing", "Premiere Pro",
    "After Effects", "DaVinci Resolve", "FFmpeg", "Remotion", "CapCut", "YouTube", "TikTok",
    "Motion Graphics", "Color Grading", "AI", "Automation", "Figma", "WordPress", "SEO",
  ];
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k.toLowerCase()));
}

function toIsoDate(input?: string): string {
  if (!input) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString().slice(0, 10) : parsed.toISOString().slice(0, 10);
}

export async function fetchRemotiveJobs(query: string, limit: number): Promise<LiveJobResult[]> {
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}`;
  const data = await fetchJson<{ jobs: Array<Record<string, unknown>> }>(url);
  return (data.jobs ?? [])
    .filter((job) => matchesQuery(String(job.title), `${job.description} ${job.tags}`, query))
    .slice(0, limit)
    .map((job) => ({
    id: `live-remotive-${job.id}`,
    title: String(job.title ?? "Untitled"),
    client: String(job.company_name ?? "Unknown"),
    description: stripHtml(String(job.description ?? "")).slice(0, 500),
    budget: job.salary ? String(job.salary) : "Niet vermeld",
    skills: inferSkills(`${job.title} ${job.tags ?? ""} ${job.description ?? ""}`),
    platform: "Remotive",
    postedAt: toIsoDate(String(job.publication_date ?? "")),
    url: String(job.url ?? "https://remotive.com"),
    source: "remotive" as const,
  }));
}

export async function fetchRemoteOkJobs(query: string, limit: number): Promise<LiveJobResult[]> {
  const tag = query.split(/\s+/)[0] ?? "dev";
  const url = `https://remoteok.com/api?tag=${encodeURIComponent(tag)}`;
  const data = await fetchJson<Array<Record<string, unknown>>>(url);
  const jobs = data.filter((j) => j.id && j.position);

  return jobs
    .filter((job) => matchesQuery(String(job.position), `${job.description} ${job.tags}`, query))
    .slice(0, limit)
    .map((job) => ({
      id: `live-remoteok-${job.id}`,
      title: String(job.position),
      client: String(job.company ?? "Unknown"),
      description: stripHtml(String(job.description ?? "")).slice(0, 500),
      budget: job.salary_min ? `$${job.salary_min}${job.salary_max ? `-$${job.salary_max}` : ""}` : "Niet vermeld",
      skills: inferSkills(`${job.position} ${job.tags} ${job.description}`),
      platform: "RemoteOK",
      postedAt: toIsoDate(job.date ? new Date(Number(job.date) * 1000).toISOString() : undefined),
      url: job.url ? String(job.url) : `https://remoteok.com/remote-jobs/${job.slug}`,
      source: "remoteok" as const,
    }));
}

export async function fetchJobicyJobs(query: string, limit: number): Promise<LiveJobResult[]> {
  const tag = query.split(/\s+/)[0]?.toLowerCase() || "video";
  const url = `https://jobicy.com/api/v2/remote-jobs?count=${limit}&tag=${encodeURIComponent(tag)}&geo=anywhere`;
  const data = await fetchJson<{ jobs: Array<Record<string, unknown>> }>(url);

  return (data.jobs ?? [])
    .filter((job) => matchesQuery(String(job.jobTitle), `${job.jobExcerpt} ${job.jobIndustry}`, query))
    .slice(0, limit)
    .map((job) => ({
    id: `live-jobicy-${job.id}`,
    title: String(job.jobTitle ?? "Untitled"),
    client: String(job.companyName ?? "Unknown"),
    description: stripHtml(String(job.jobExcerpt ?? job.jobDescription ?? "")).slice(0, 500),
    budget: String(job.annualSalaryMin ?? "Niet vermeld"),
    skills: inferSkills(`${job.jobTitle} ${job.jobIndustry} ${job.jobExcerpt}`),
    platform: "Jobicy",
    postedAt: toIsoDate(String(job.pubDate ?? "")),
    url: String(job.url ?? "https://jobicy.com"),
    source: "jobicy" as const,
  }));
}

export async function fetchArbeitnowJobs(query: string, limit: number): Promise<LiveJobResult[]> {
  const data = await fetchJson<{ data: Array<Record<string, unknown>> }>("https://arbeitnow.com/api/job-board-api");

  return (data.data ?? [])
    .filter((job) => matchesQuery(String(job.title), `${job.description} ${job.tags}`, query))
    .slice(0, limit)
    .map((job) => ({
      id: `live-arbeitnow-${job.slug}`,
      title: String(job.title),
      client: String(job.company ?? "Unknown"),
      description: stripHtml(String(job.description ?? "")).slice(0, 500),
      budget: job.remote ? "Remote" : "On-site/hybrid",
      skills: inferSkills(`${job.title} ${job.tags} ${job.description}`),
      platform: "Arbeitnow",
      postedAt: toIsoDate(String(job.created_at ?? "")),
      url: String(job.url ?? "https://arbeitnow.com"),
      source: "arbeitnow" as const,
    }));
}

export async function fetchUpworkJobs(query: string, limit: number): Promise<{ jobs: LiveJobResult[]; warning?: string }> {
  const url = `https://www.upwork.com/ab/feed/jobs/rss?q=${encodeURIComponent(query)}`;
  const xml = await fetchText(url);

  if (xml.includes("challenge-error-text") || xml.includes("_cf_chl_opt") || !xml.includes("<rss")) {
    return {
      jobs: [],
      warning:
        "Upwork RSS is geblokkeerd (Cloudflare). Gebruik Remotive, RemoteOK of Jobicy als alternatief — of voeg Upwork-opdrachten handmatig toe met add_job.",
    };
  }

  const items = parseRssItems(xml).slice(0, limit);
  const jobs = items.map((item, i) => ({
    id: `live-upwork-${i}-${Date.now()}`,
    title: stripHtml(item.title),
    client: "Upwork Client",
    description: stripHtml(item.description).slice(0, 500),
    budget: "Zie Upwork listing",
    skills: inferSkills(`${item.title} ${item.description}`),
    platform: "Upwork",
    postedAt: toIsoDate(item.pubDate),
    url: item.link || "https://www.upwork.com",
    source: "upwork" as const,
  }));

  return { jobs };
}

export async function fetchLiveJobs(params: {
  query: string;
  sources?: LiveJobSource[];
  limit?: number;
}): Promise<{ jobs: LiveJobResult[]; errors: string[]; imported?: number }> {
  const limit = params.limit ?? 10;
  const perSource = Math.max(3, Math.ceil(limit / 3));
  const sources = params.sources ?? ["remotive", "remoteok", "jobicy"];
  const errors: string[] = [];
  const allJobs: LiveJobResult[] = [];

  const activeSources = sources.includes("all")
    ? (["remotive", "remoteok", "jobicy", "arbeitnow", "upwork"] as LiveJobSource[])
    : sources;

  for (const source of activeSources) {
    if (source === "all") continue;
    try {
      if (source === "upwork") {
        const upwork = await fetchUpworkJobs(params.query, perSource);
        if (upwork.warning) errors.push(upwork.warning);
        allJobs.push(...upwork.jobs);
        continue;
      }
      const fetcher = {
        remotive: () => fetchRemotiveJobs(params.query, perSource),
        remoteok: () => fetchRemoteOkJobs(params.query, perSource),
        jobicy: () => fetchJobicyJobs(params.query, perSource),
        arbeitnow: () => fetchArbeitnowJobs(params.query, perSource),
      }[source];
      if (fetcher) allJobs.push(...(await fetcher()));
    } catch (err) {
      errors.push(`${source}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const seen = new Set<string>();
  const deduped = allJobs.filter((job) => {
    const key = job.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { jobs: deduped.slice(0, limit), errors };
}

export function liveJobToListing(job: LiveJobResult): Omit<JobListing, "status"> {
  return {
    id: job.id,
    title: job.title,
    client: job.client,
    description: `${job.description}\n\nBron: ${job.url}`,
    budget: job.budget,
    skills: job.skills.length ? job.skills : ["General"],
    platform: job.platform,
    postedAt: job.postedAt,
  };
}
