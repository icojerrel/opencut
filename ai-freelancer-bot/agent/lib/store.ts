import { defineState } from "eve/context";
import { defaultData } from "./default-data";
import {
  calculateRate,
  createInvoiceRecord,
  createJobRecord,
  createProjectRecord,
  createProposalRecord,
  formatInvoice,
  matchJobsToProfile as matchJobsToProfileLogic,
  searchJobsInData,
} from "./logic";
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

export { calculateRate, formatInvoice } from "./logic";

export const freelancerStore = defineState("freelancer-bot.data", defaultData);

export function getData(): FreelancerData {
  return freelancerStore.get();
}

export function updateData(updater: (data: FreelancerData) => FreelancerData): FreelancerData {
  freelancerStore.update(updater);
  return freelancerStore.get();
}

export function searchJobs(params: {
  query?: string;
  skills?: string[];
  platform?: string;
  status?: JobStatus;
}): JobListing[] {
  return searchJobsInData(getData(), params);
}

export function matchJobsToProfile(profile: FreelancerProfile): Array<JobListing & { matchScore: number }> {
  return matchJobsToProfileLogic(getData(), profile);
}

export function saveProposal(proposal: Omit<Proposal, "id" | "createdAt">): Proposal {
  const { data, proposal: created } = createProposalRecord(getData(), proposal);
  updateData(() => data);
  return created;
}

export function updateProfile(updates: Partial<FreelancerProfile>): FreelancerProfile {
  updateData((d) => ({ ...d, profile: { ...d.profile, ...updates } }));
  return getData().profile;
}

export function addJob(job: Omit<JobListing, "id" | "postedAt" | "status">): JobListing {
  const { data, job: created } = createJobRecord(getData(), job);
  updateData(() => data);
  return created;
}

export function trackProject(project: Omit<Project, "id" | "createdAt">): Project {
  const { data, project: created } = createProjectRecord(getData(), project);
  updateData(() => data);
  return created;
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  let updated: Project | null = null;
  updateData((d) => ({
    ...d,
    projects: d.projects.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, ...updates };
      return updated;
    }),
  }));
  return updated;
}

export function createInvoice(params: {
  client: string;
  projectId?: string;
  lines: InvoiceLine[];
  currency: string;
  dueDate: string;
}): Invoice {
  const { data, invoice } = createInvoiceRecord(getData(), params);
  updateData(() => data);
  return invoice;
}
