import fixture from "../sample/calendar-item.sample.json" with { type: "json" };

export type CalendarItem = { start: string; title: string; decision: string };

export const decisionLine = (item: CalendarItem) => `${item.start} ${item.title} — decide: ${item.decision}`;

if (process.argv[1]?.endsWith("mini.ts")) console.log(decisionLine(fixture.items[0]!));
