import { readFile } from "node:fs/promises";
import { agendaSchema, decisionLine } from "./brief.js";

export async function mini(path: string): Promise<string> {
  const data: unknown = JSON.parse(await readFile(path, "utf8"));
  const agenda = agendaSchema.parse(data);
  const item = agenda.items[0];
  if (!item) return "OPEN — no agenda item available";
  return decisionLine(item);
}

if (process.argv[1]?.endsWith("mini.ts")) console.log(await mini(process.argv[2] ?? "sample/calendar-item.sample.json"));
