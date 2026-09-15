import { defineTool } from "eve/tools";
import { z } from "zod";
import { getData, trackProject, updateProject } from "../lib/store";

export default defineTool({
  description: "Beheer freelance projecten: lijst, aanmaken, bijwerken of uren loggen.",
  inputSchema: z.object({
    action: z.enum(["list", "create", "update", "log_hours"]),
    projectId: z.string().optional(),
    title: z.string().optional(),
    client: z.string().optional(),
    status: z.enum(["active", "completed", "on_hold", "cancelled"]).optional(),
    hourlyRate: z.number().positive().optional(),
    hours: z.number().positive().optional(),
    deadline: z.string().optional(),
    notes: z.string().optional(),
  }),
  label: {
    start: ({ action }) => {
      const labels = { list: "Projecten ophalen", create: "Project aanmaken", update: "Project bijwerken", log_hours: "Uren loggen" };
      return labels[action];
    },
  },
  async execute({ action, projectId, title, client, status, hourlyRate, hours, deadline, notes }) {
    const data = getData();

    if (action === "list") {
      return {
        count: data.projects.length,
        projects: data.projects.map((p) => ({
          ...p,
          revenue: p.hourlyRate * p.hoursLogged,
        })),
      };
    }

    if (action === "create") {
      if (!title || !client) {
        return { success: false, error: "title en client zijn verplicht" };
      }
      const project = trackProject({
        title,
        client,
        status: status ?? "active",
        hourlyRate: hourlyRate ?? data.profile.hourlyRate,
        hoursLogged: 0,
        deadline: deadline ?? null,
        notes: notes ?? "",
      });
      return { success: true, project };
    }

    if (!projectId) {
      return { success: false, error: "projectId is verplicht" };
    }

    if (action === "log_hours") {
      if (!hours) return { success: false, error: "hours is verplicht" };
      const existing = data.projects.find((p) => p.id === projectId);
      if (!existing) return { success: false, error: "Project niet gevonden" };

      const project = updateProject(projectId, {
        hoursLogged: existing.hoursLogged + hours,
        notes: notes ? `${existing.notes}\n[+${hours}u] ${notes}`.trim() : existing.notes,
      });
      return { success: true, project, revenue: (project?.hourlyRate ?? 0) * (project?.hoursLogged ?? 0) };
    }

    const project = updateProject(projectId, { status, deadline, notes, hourlyRate });
    if (!project) return { success: false, error: "Project niet gevonden" };
    return { success: true, project };
  },
});
