import { readFile } from "node:fs/promises";
import { agendaSchema, type Agenda } from "./brief.js";

export async function readAgenda(path: string): Promise<Agenda> {
  const data: unknown = JSON.parse(await readFile(path, "utf8"));
  const result = agendaSchema.safeParse(data);
  if (!result.success) throw new Error(`SOURCE_ERROR: ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
  return result.data;
}
