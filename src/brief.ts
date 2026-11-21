import { z } from "zod";

const status = z.enum(["READY", "OPEN", "CONFLICT"]);
const item = z.object({ status, text: z.string().min(1), sourceIds: z.array(z.string()) }).superRefine((value, ctx) => {
  if (value.status !== "OPEN" && value.sourceIds.length === 0) ctx.addIssue({ code: "custom", message: `${value.status} needs a source ID` });
  if (value.status === "OPEN" && !value.text.startsWith("OPEN")) ctx.addIssue({ code: "custom", message: "OPEN text must start OPEN" });
  if (value.status === "CONFLICT" && !value.text.startsWith("CONFLICT")) ctx.addIssue({ code: "custom", message: "CONFLICT text must start CONFLICT" });
});

export const dailyBriefSchema = z.object({
  title: z.string().min(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), greeting: z.string().min(1),
  summary: item, moveWorkForward: item, topTodos: z.array(item).min(1), newUpdates: z.array(item).min(1),
  yourDay: z.array(item).min(1), sources: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) }))
});

export type DailyBrief = z.infer<typeof dailyBriefSchema>;

export function parseDailyBrief(input: unknown): DailyBrief {
  const brief = dailyBriefSchema.parse(input);
  const sources = new Set(brief.sources.map(({ id }) => id));
  for (const entry of [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay]) {
    for (const id of entry.sourceIds) if (!sources.has(id)) throw new Error(`Unresolved source ID: ${id}`);
  }
  return brief;
}
