import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { query, type Options } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { parseDailyBrief } from "./brief.js";
import { renderBrief } from "./render.js";

const configSchema = z.object({ approvedCorporateConnector: z.boolean(), approvedReadOnlyTool: z.boolean(), authorizedModelAccount: z.boolean(), modelProvider: z.literal("vertex"), user: z.string(), decision: z.string(), mcp: z.object({ server: z.literal("jira"), tool: z.string() }) });
export type BreeConfig = z.infer<typeof configSchema>;

export function checkLiveConfig(input: unknown): string[] {
  const parsed = configSchema.safeParse(input);
  if (!parsed.success) return ["valid local configuration"];
  const config = parsed.data;
  return [!config.approvedCorporateConnector && "corporate connector approval", !config.approvedReadOnlyTool && "read-only tool approval", !config.authorizedModelAccount && "authorized Vertex model account", (!config.mcp.tool.startsWith("mcp__jira__") || config.mcp.tool.includes("REPLACE_")) && "exact Jira tool from /mcp"].filter((item): item is string => Boolean(item));
}

export function buildSdkOptions(config: BreeConfig): Pick<Options, "allowedTools" | "tools" | "permissionMode"> {
  return { allowedTools: [config.mcp.tool], tools: [config.mcp.tool], permissionMode: "default" };
}

export const privateOutputPath = (date: string) => join(homedir(), ".bree", "briefs", `${date}.html`);

async function loadConfig(): Promise<BreeConfig> {
  return configSchema.parse(JSON.parse(await readFile(".bree.local.json", "utf8")));
}

async function runLive(config: BreeConfig): Promise<void> {
  const missing = checkLiveConfig(config);
  if (missing.length) throw new Error(`OPEN — ${missing.join(", ")}`);
  let candidate: unknown;
  const observedKeys = new Set<string>();
  for await (const message of query({ prompt: `Use only ${config.mcp.tool}. Return a complete DailyBrief JSON object for ${config.user}'s decision: ${config.decision}. Keep unavailable sections OPEN.`, options: { ...buildSdkOptions(config), settingSources: ["user", "project"], maxTurns: 2 } })) {
    if (message.type === "user") for (const key of JSON.stringify(message).match(/\b[A-Z][A-Z0-9]+-\d+\b/g) ?? []) observedKeys.add(key);
    if (message.type === "result" && message.subtype === "success") candidate = JSON.parse(message.result);
  }
  const brief = parseDailyBrief(candidate);
  const liveIds = [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay].flatMap(item => item.sourceIds).filter(id => id.startsWith("jira:"));
  for (const id of liveIds) if (!observedKeys.has(id.slice(5))) throw new Error(`Rejected unobserved live source ID: ${id}`);
  const path = privateOutputPath(brief.date);
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  await writeFile(path, renderBrief(brief), { mode: 0o600 });
  await chmod(path, 0o600);
  console.log(`PASS — wrote validated private brief to ${path}`);
}

if (process.argv[1]?.endsWith("live.ts")) {
  try {
    const config = await loadConfig();
    const missing = checkLiveConfig(config);
    if (process.argv.includes("--check")) console.log(missing.length ? `OPEN — ${missing.join(", ")}` : "READY — local approvals and configuration are present");
    else await runLive(config);
  } catch (error) {
    console.log(`OPEN — ${error instanceof Error ? error.message : "live configuration unavailable"}`);
    process.exitCode = 2;
  }
}
