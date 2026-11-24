import { z } from "zod";

export const STATUSES = ["READY", "OPEN", "CONFLICT"] as const;

const nonEmpty = z.string().min(1);

export const SourceSchema = z.strictObject({ id: nonEmpty, label: nonEmpty });

export const ItemSchema = z
  .strictObject({
    status: z.enum(STATUSES),
    text: nonEmpty,
    sourceIds: z.array(nonEmpty),
  })
  .superRefine((item, ctx) => {
    if (item.status !== "OPEN" && item.sourceIds.length === 0) {
      ctx.addIssue({ code: "custom", path: ["sourceIds"], message: `${item.status} item needs at least one source ID` });
    }
    if (item.status === "OPEN" && !item.text.startsWith("OPEN")) {
      ctx.addIssue({ code: "custom", path: ["text"], message: "OPEN text must start with OPEN" });
    }
    if (item.status === "CONFLICT" && !item.text.startsWith("CONFLICT")) {
      ctx.addIssue({ code: "custom", path: ["text"], message: "CONFLICT text must start with CONFLICT" });
    }
  });

const ItemList = z.array(ItemSchema).min(1);

export const DailyBriefSchema = z
  .strictObject({
    title: nonEmpty,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
    greeting: nonEmpty,
    summary: ItemSchema,
    moveWorkForward: ItemSchema,
    topTodos: ItemList,
    newUpdates: ItemList,
    yourDay: ItemList,
    sources: z.array(SourceSchema),
  })
  .superRefine((brief, ctx) => {
    const known = new Set(brief.sources.map((source) => source.id));
    const check = (path: (string | number)[], ids: string[]) => {
      ids.forEach((id, index) => {
        if (!known.has(id)) {
          ctx.addIssue({ code: "custom", path: [...path, "sourceIds", index], message: `sourceId ${id} does not resolve in sources` });
        }
      });
    };
    check(["summary"], brief.summary.sourceIds);
    check(["moveWorkForward"], brief.moveWorkForward.sourceIds);
    for (const key of ["topTodos", "newUpdates", "yourDay"] as const) {
      brief[key].forEach((item, index) => check([key, index], item.sourceIds));
    }
  });

export type Item = z.infer<typeof ItemSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type DailyBrief = z.infer<typeof DailyBriefSchema>;

export function parseBrief(data: unknown): DailyBrief {
  return DailyBriefSchema.parse(data);
}
