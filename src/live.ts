import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { query, type McpServerConfig, type Options } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { parseDailyBrief } from "./brief.js";
import { renderBrief } from "./render.js";

const configSchema = z.object({ approvedCorporateConnector: z.boolean(), approvedReadOnlyTool: z.boolean(), authorizedModelAccount: z.boolean(), modelProvider: z.literal("vertex"), user: z.string(), decision: z.string(), mcp: z.object({ server: z.literal("jira"), tool: z.string(), configPath: z.string().min(1) }) });
export type BreeConfig = z.infer<typeof configSchema>;
type QueryLike = (args: { prompt: string; options: Options }) => AsyncIterable<any>;
type LiveDependencies = { query: QueryLike; mcpServers: Record<string, McpServerConfig>; vertexEnabled: boolean; outputPath: string };

export function checkLiveConfig(input: unknown): string[] {
  const parsed = configSchema.safeParse(input);
  if (!parsed.success) return ["valid local configuration including the approved MCP config path"];
  const config = parsed.data;
  return [!config.approvedCorporateConnector && "corporate connector approval", !config.approvedReadOnlyTool && "read-only tool approval", !config.authorizedModelAccount && "authorized Vertex model account", (!config.mcp.tool.startsWith("mcp__jira__") || config.mcp.tool.includes("REPLACE_")) && "exact Jira tool from /mcp"].filter((item): item is string => Boolean(item));
}

export function buildSdkOptions(config: BreeConfig, mcpServers: Record<string, McpServerConfig>): Options {
  return {
    allowedTools: [config.mcp.tool], tools: [], permissionMode: "default", strictMcpConfig: true,
    settingSources: [], mcpServers,
    canUseTool: async (toolName, input) => toolName === config.mcp.tool
      ? { behavior: "allow", updatedInput: input }
      : { behavior: "deny", message: `Bree denies tool ${toolName}`, interrupt: true }
  };
}

export function privateOutputPath(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Invalid brief date");
  const root = resolve(homedir(), ".bree", "briefs");
  const path = resolve(root, `${date}.html`);
  if (!path.startsWith(`${root}/`)) throw new Error("Private output path escaped its root");
  return path;
}

const contentBlocks = (message: any): any[] => Array.isArray(message?.message?.content) ? message.message.content : [];

export async function runLive(config: BreeConfig, dependencies: LiveDependencies): Promise<string> {
  const missing = checkLiveConfig(config);
  if (missing.length) throw new Error(`OPEN — ${missing.join(", ")}`);
  if (!dependencies.vertexEnabled) throw new Error("OPEN — approved Vertex route is unavailable");
  if (Object.keys(dependencies.mcpServers).length !== 1 || !dependencies.mcpServers.jira) throw new Error("OPEN — Jira-only MCP configuration is unavailable");

  const chosenCalls = new Set<string>();
  const permittedKeys = new Set<string>();
  let candidate: unknown;
  const stream = dependencies.query({
    prompt: `Use only ${config.mcp.tool}. Return only one complete DailyBrief JSON object for ${config.user}'s decision: ${config.decision}. Keep unavailable sections OPEN.`,
    options: { ...buildSdkOptions(config, dependencies.mcpServers), maxTurns: 2 }
  });
  for await (const message of stream) {
    if (message.type === "assistant") for (const block of contentBlocks(message)) if (block.type === "tool_use" && block.name === config.mcp.tool && typeof block.id === "string") chosenCalls.add(block.id);
    if (message.type === "user") for (const block of contentBlocks(message)) {
      if (block.type !== "tool_result" || block.is_error || !chosenCalls.has(block.tool_use_id)) continue;
      const issues = block.structuredContent?.issues;
      if (!Array.isArray(issues)) continue;
      for (const issue of issues) if (typeof issue?.key === "string" && /^[A-Z][A-Z0-9]+-\d+$/.test(issue.key)) permittedKeys.add(issue.key);
    }
    if (message.type === "result" && message.subtype === "success") candidate = JSON.parse(message.result);
  }

  const brief = parseDailyBrief(candidate);
  const permittedIds = new Set([...permittedKeys].map(key => `jira:${key}`));
  for (const source of brief.sources) if (!permittedIds.has(source.id)) throw new Error(`Unpermitted live source ID: ${source.id}`);
  for (const item of [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay]) {
    for (const id of item.sourceIds) if (!permittedIds.has(id)) throw new Error(`Unpermitted live source ID: ${id}`);
  }

  await mkdir(dirname(dependencies.outputPath), { recursive: true, mode: 0o700 });
  await writeFile(dependencies.outputPath, renderBrief(brief), { mode: 0o600 });
  await chmod(dependencies.outputPath, 0o600);
  return dependencies.outputPath;
}

async function loadConfig(): Promise<BreeConfig> {
  return configSchema.parse(JSON.parse(await readFile(".bree.local.json", "utf8")));
}

async function loadJiraServer(config: BreeConfig): Promise<Record<string, McpServerConfig>> {
  const parsed = JSON.parse(await readFile(config.mcp.configPath, "utf8"));
  const jira = parsed.mcpServers?.jira ?? parsed.jira;
  if (!jira || typeof jira !== "object") throw new Error("approved MCP config has no Jira server");
  return { jira };
}

if (process.argv[1]?.endsWith("live.ts")) {
  try {
    const config = await loadConfig();
    const missing = checkLiveConfig(config);
    const mcpServers = missing.length ? {} : await loadJiraServer(config);
    const vertexEnabled = process.env.CLAUDE_CODE_USE_VERTEX === "1";
    if (process.argv.includes("--check")) {
      const open = [...missing, !vertexEnabled && "approved Vertex route", !mcpServers.jira && "approved Jira-only MCP config"].filter((item): item is string => Boolean(item));
      console.log(open.length ? `OPEN — ${open.join(", ")}` : "READY — local approvals and configuration are present");
      if (open.length) process.exitCode = 2;
    } else {
      const path = await runLive(config, { query, mcpServers, vertexEnabled, outputPath: privateOutputPath(new Date().toISOString().slice(0, 10)) });
      console.log(`PASS — wrote validated private brief to ${path}`);
    }
  } catch (error) {
    console.log(`OPEN — ${error instanceof Error ? error.message : "live configuration unavailable"}`);
    process.exitCode = 2;
  }
}
