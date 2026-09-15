export type JobStatus = "open" | "applied" | "won" | "lost" | "closed";

export interface JobListing {
  id: string;
  title: string;
  client: string;
  description: string;
  budget: string;
  skills: string[];
  platform: string;
  postedAt: string;
  status: JobStatus;
}

export interface FreelancerProfile {
  name: string;
  title: string;
  skills: string[];
  hourlyRate: number;
  currency: string;
  experienceYears: number;
  bio: string;
  portfolio: string[];
  availability: "available" | "limited" | "unavailable";
}

export interface Proposal {
  id: string;
  jobId: string;
  jobTitle: string;
  content: string;
  proposedRate: number;
  currency: string;
  createdAt: string;
  status: "draft" | "sent" | "accepted" | "rejected";
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: "active" | "completed" | "on_hold" | "cancelled";
  hourlyRate: number;
  hoursLogged: number;
  deadline: string | null;
  notes: string;
  createdAt: string;
}

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  projectId: string | null;
  client: string;
  lines: InvoiceLine[];
  currency: string;
  dueDate: string;
  status: "draft" | "sent" | "paid";
  createdAt: string;
}

export interface FreelancerData {
  profile: FreelancerProfile;
  jobs: JobListing[];
  proposals: Proposal[];
  projects: Project[];
  invoices: Invoice[];
}
