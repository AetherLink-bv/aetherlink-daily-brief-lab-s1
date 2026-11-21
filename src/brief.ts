import { z } from "zod";

export const agendaItemSchema = z.object({
  id: z.string().min(1),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string().min(1),
  decision: z.string().min(1),
});

export const agendaSchema = z.object({
  user: z.string().min(1),
  source: z.string().min(1),
  items: z.array(agendaItemSchema),
});

export type Agenda = z.infer<typeof agendaSchema>;

export const dailyBriefItemSchema = z.object({
  status: z.enum(["READY", "OPEN", "CONFLICT"]),
  text: z.string().trim().min(1),
  sourceIds: z.array(z.string().trim().min(1)),
}).strict().superRefine((item, context) => {
  if (item.status !== "OPEN" && item.sourceIds.length === 0) {
    context.addIssue({ code: "custom", message: "READY and CONFLICT items require at least one source ID" });
  }
  if (item.status === "OPEN" && !item.text.startsWith("OPEN")) {
    context.addIssue({ code: "custom", message: "OPEN items must explain the gap" });
  }
  if (item.status === "CONFLICT" && !item.text.startsWith("CONFLICT")) {
    context.addIssue({ code: "custom", message: "CONFLICT items must explain the conflict" });
  }
});

export const dailyBriefSchema = z.object({
  title: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(Date.UTC(year ?? 0, (month ?? 0) - 1, day));
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() + 1 === month && parsed.getUTCDate() === day;
  }, "date must be a real calendar date"),
  greeting: z.string().trim().min(1),
  summary: dailyBriefItemSchema,
  moveWorkForward: dailyBriefItemSchema,
  topTodos: z.array(dailyBriefItemSchema).min(1),
  newUpdates: z.array(dailyBriefItemSchema).min(1),
  yourDay: z.array(dailyBriefItemSchema).min(1),
  sources: z.array(z.object({
    id: z.string().trim().min(1),
    label: z.string().trim().min(1),
  }).strict()),
}).strict().superRefine((brief, context) => {
  const knownSources = new Set(brief.sources.map((source) => source.id));
  if (knownSources.size !== brief.sources.length) {
    context.addIssue({ code: "custom", path: ["sources"], message: "source IDs must be unique" });
  }
  const items = [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay];
  for (const [index, item] of items.entries()) {
    for (const sourceId of item.sourceIds) {
      if (!knownSources.has(sourceId)) {
        context.addIssue({ code: "custom", path: ["items", index, "sourceIds"], message: `unknown source ID: ${sourceId}` });
      }
    }
  }
});

export type DailyBrief = z.infer<typeof dailyBriefSchema>;

export type BriefResult =
  | { status: "ordinary"; user: string; line: string; source: string }
  | { status: "open"; user: string; line: "OPEN — no agenda item available"; source: string }
  | { status: "conflict"; user: string; line: string; source: string };

export function decisionLine(item: z.infer<typeof agendaItemSchema>): string {
  return `${item.start} ${item.title} — decide: ${item.decision}`;
}

export function buildBrief(input: unknown): BriefResult {
  const agenda = agendaSchema.parse(input);
  if (agenda.items.length === 0) return { status: "open", user: agenda.user, line: "OPEN — no agenda item available", source: agenda.source };
  const times = new Set(agenda.items.map((item) => item.start));
  if (times.size < agenda.items.length) {
    return { status: "conflict", user: agenda.user, line: `CONFLICT — ${agenda.items.length} agenda items share a start time`, source: agenda.source };
  }
  const item = agenda.items[0];
  if (!item) return { status: "open", user: agenda.user, line: "OPEN — no agenda item available", source: agenda.source };
  return { status: "ordinary", user: agenda.user, line: decisionLine(item), source: `${agenda.source}#${item.id}` };
}
