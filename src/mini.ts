import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export interface CalendarItem {
  id: string;
  start: string;
  title: string;
  decision: string;
}

export interface CalendarData {
  user: string;
  items: CalendarItem[];
}

// Learning slice: one line from the first synthetic calendar item. Not the finished agent.
export function miniLine(data: CalendarData): string {
  const item = data.items[0];
  if (!item) return "OPEN — no calendar item in the fixture";
  return `${item.start} ${item.title} — decide: ${item.decision}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: tsx src/mini.ts <calendar-fixture.json>");
    process.exit(2);
  }
  const data = JSON.parse(await readFile(path, "utf8")) as CalendarData;
  console.log(miniLine(data));
}
