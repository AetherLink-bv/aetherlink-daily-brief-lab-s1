import { buildBrief, type BriefResult } from "./brief.js";
import { readAgenda } from "./sources.js";

export type ToolChoice = { name: "readAgenda"; path: string };
export type TestModel = (instruction: string, path: string) => ToolChoice;

export const controlledTestModel: TestModel = (_instruction, path) => ({ name: "readAgenda", path });

export async function runAgent(instruction: string, path: string, model: TestModel = controlledTestModel): Promise<BriefResult> {
  const choice = model(instruction, path);
  if (choice.name !== "readAgenda") throw new Error("TOOL_ERROR: unsupported tool");
  return buildBrief(await readAgenda(choice.path));
}
