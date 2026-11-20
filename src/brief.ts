import { z } from "zod";

export const agendaItemSchema = z.object({
  id: z.string().min(1),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string().min(1),
  decision: z.string().min(1),
});

export const agendaSchema = z.object({
  user: z.string().min(1),
  items: z.array(agendaItemSchema),
});

export type Agenda = z.infer<typeof agendaSchema>;

export type BriefResult =
  | { status: "ordinary"; user: string; line: string }
  | { status: "open"; user: string; line: "OPEN — no agenda item available" }
  | { status: "conflict"; user: string; line: string };

export function decisionLine(item: z.infer<typeof agendaItemSchema>): string {
  return `${item.start} ${item.title} — decide: ${item.decision}`;
}

export function buildBrief(input: unknown): BriefResult {
  const agenda = agendaSchema.parse(input);
  if (agenda.items.length === 0) return { status: "open", user: agenda.user, line: "OPEN — no agenda item available" };
  const times = new Set(agenda.items.map((item) => item.start));
  if (times.size < agenda.items.length) {
    return { status: "conflict", user: agenda.user, line: `CONFLICT — ${agenda.items.length} agenda items share a start time` };
  }
  const item = agenda.items[0];
  if (!item) return { status: "open", user: agenda.user, line: "OPEN — no agenda item available" };
  return { status: "ordinary", user: agenda.user, line: decisionLine(item) };
}
