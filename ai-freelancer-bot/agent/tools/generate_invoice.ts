import { defineTool } from "eve/tools";
import { z } from "zod";
import { createInvoice, formatInvoice, getData } from "../lib/store";

export default defineTool({
  description: "Genereer een factuur voor een klant op basis van projectregels of uren × tarief.",
  inputSchema: z.object({
    client: z.string().describe("Klantnaam"),
    projectId: z.string().optional(),
    lines: z
      .array(
        z.object({
          description: z.string(),
          quantity: z.number().positive(),
          unitPrice: z.number().positive(),
        }),
      )
      .optional(),
    hours: z.number().positive().optional(),
    hourlyRate: z.number().positive().optional(),
    description: z.string().optional().describe("Omschrijving bij uren-facturatie"),
    dueDays: z.number().min(1).max(90).default(14),
    currency: z.string().optional(),
  }),
  label: {
    start: ({ client }) => `Factuur genereren voor ${client}`,
  },
  async execute({ client, projectId, lines, hours, hourlyRate, description, dueDays, currency }) {
    const data = getData();
    const curr = currency ?? data.profile.currency ?? "EUR";

    let invoiceLines = lines;
    if (!invoiceLines?.length && hours && hourlyRate) {
      invoiceLines = [
        {
          description: description ?? "Freelance diensten",
          quantity: hours,
          unitPrice: hourlyRate,
        },
      ];
    }

    if (!invoiceLines?.length) {
      return { success: false, error: "Geef lines op, of hours + hourlyRate" };
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDays);

    const invoice = createInvoice({
      client,
      projectId,
      lines: invoiceLines,
      currency: curr,
      dueDate: dueDate.toISOString().slice(0, 10),
    });

    const subtotal = invoice.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);

    return {
      success: true,
      invoice: {
        id: invoice.id,
        client: invoice.client,
        subtotal: `${subtotal.toFixed(2)} ${curr}`,
        dueDate: invoice.dueDate,
        status: invoice.status,
      },
      formatted: formatInvoice(invoice),
    };
  },
});
