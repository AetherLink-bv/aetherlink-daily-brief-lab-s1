import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { query, type McpServerConfig, type Options } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { parseDailyBrief } from "./brief.js";
import { renderBrief } from "./render.js";

const configSchema = z.object({ approvedCorporateConnector: z.boolean(), approvedReadOnlyTool: z.boolean(), authorizedModelAccount: z.boolean(), modelProvider: z.literal("vertex"), user: z.string(), decision: z.string(), mcp: z.object({ server: z.literal("jira"), tool: z.string() }) });
export type BreeConfig = z.infer<typeof configSchema>;
type LiveQuery = AsyncIterable<unknown> & { initializationResult(): Promise<{ account: { apiProvider?: string } }>; close(): void };
type QueryLike = (args: { prompt: string; options: Options }) => LiveQuery;
type LiveDependencies = { query: QueryLike; mcpServers: Record<string, McpServerConfig>; expectedDate: string; outputPath: string };

export function checkLiveConfig(input: unknown): string[] {
  const parsed = configSchema.safeParse(input);
  if (!parsed.success) return ["valid local configuration"];
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

const record = (value: unknown): Record<string, unknown> | undefined => typeof value === "object" && value !== null ? value as Record<string, unknown> : undefined;
const contentBlocks = (message: unknown): unknown[] => {
  const envelope = record(message);
  const inner = record(envelope?.message);
  return Array.isArray(inner?.content) ? inner.content : [];
};
const resultJson = (block: Record<string, unknown>): unknown => {
  const content = block.content;
  const text = typeof content === "string" ? content : Array.isArray(content) && content.length === 1 && record(content[0])?.type === "text" ? record(content[0])?.text : undefined;
  if (typeof text !== "string") return undefined;
  try { return JSON.parse(text); } catch { return undefined; }
};

export async function runLive(config: BreeConfig, dependencies: LiveDependencies): Promise<string> {
  const missing = checkLiveConfig(config);
  if (missing.length) throw new Error(`OPEN — ${missing.join(", ")}`);
  if (Object.keys(dependencies.mcpServers).length !== 1 || !dependencies.mcpServers.jira) throw new Error("OPEN — Jira-only MCP configuration is unavailable");

  const chosenCalls = new Set<string>();
  const permittedKeys = new Set<string>();
  let unexpectedToolCall = false;
  let candidate: unknown;
  const stream = dependencies.query({
    prompt: `Use only ${config.mcp.tool}. Return only one complete DailyBrief JSON object for ${config.user}'s decision: ${config.decision}. Keep unavailable sections OPEN.`,
    options: { ...buildSdkOptions(config, dependencies.mcpServers), maxTurns: 2 }
  });
  const initialization = await stream.initializationResult();
  if (initialization.account.apiProvider !== "vertex") {
    stream.close();
    throw new Error("OPEN — SDK initialized with a non-Vertex provider");
  }
  for await (const message of stream) {
    const envelope = record(message);
    if (envelope?.type === "assistant") for (const value of contentBlocks(message)) {
      const block = record(value);
      if (block?.type !== "tool_use") continue;
      if (block.name === config.mcp.tool && typeof block.id === "string") chosenCalls.add(block.id);
      else unexpectedToolCall = true;
    }
    if (envelope?.type === "user") for (const value of contentBlocks(message)) {
      const block = record(value);
      if (!block || block.type !== "tool_result" || block.is_error === true || typeof block.tool_use_id !== "string" || !chosenCalls.has(block.tool_use_id)) continue;
      const structured = record(resultJson(block));
      const issues = structured?.issues;
      if (!Array.isArray(issues)) continue;
      for (const value of issues) {
        const issue = record(value);
        if (typeof issue?.key === "string" && /^[A-Z][A-Z0-9]+-\d+$/.test(issue.key)) permittedKeys.add(issue.key);
      }
    }
    if (envelope?.type === "result" && envelope.subtype === "success" && typeof envelope.result === "string") candidate = JSON.parse(envelope.result);
  }

  if (unexpectedToolCall) throw new Error("Rejected unexpected tool call");
  const brief = parseDailyBrief(candidate);
  if (brief.date !== dependencies.expectedDate) throw new Error("Brief date does not match the host expected date");
  const permittedIds = permittedKeys;
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

async function loadJiraServer(path: string): Promise<Record<string, McpServerConfig>> {
  const parsed = JSON.parse(await readFile(path, "utf8"));
  const jira = parsed.mcpServers?.jira ?? parsed.jira;
  if (!jira || typeof jira !== "object") throw new Error("approved MCP config has no Jira server");
  return { jira };
}

if (process.argv[1]?.endsWith("live.ts")) {
  try {
    const config = await loadConfig();
    const missing = checkLiveConfig(config);
    const mcpPath = process.env.AETHERLINK_JIRA_MCP_CONFIG;
    const mcpServers = missing.length || !mcpPath ? {} : await loadJiraServer(mcpPath);
    if (process.argv.includes("--check")) {
      const open = [...missing, !mcpPath && "AETHERLINK_JIRA_MCP_CONFIG", !mcpServers.jira && "approved Jira-only MCP config"].filter((item): item is string => Boolean(item));
      console.log(open.length ? `OPEN — ${open.join(", ")}` : "READY — local approvals and configuration are present");
      if (open.length) process.exitCode = 2;
    } else {
      const expectedDate = new Date().toLocaleDateString("sv-SE");
      const path = await runLive(config, { query, mcpServers, expectedDate, outputPath: privateOutputPath(expectedDate) });
      console.log(`PASS — wrote validated private brief to ${path}`);
    }
  } catch (error) {
    console.log(process.argv.includes("--check") ? "OPEN — approved local live configuration is unavailable" : "OPEN — live execution or validation failed");
    process.exitCode = 2;
  }
}
