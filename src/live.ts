import { query, type CanUseTool, type Options } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "node:fs";
import { chmod, mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { z } from "zod";
import { DailyBriefSchema, parseBrief, type DailyBrief } from "./brief.js";
import { renderBrief } from "./render.js";

const root = fileURLToPath(new URL("..", import.meta.url));

// Exit codes for `npm run live:check`: READY is 0. OPEN is 3, so a script can never mistake it for READY.
export const EXIT_OPEN = 3;

// ---- 1. configuration boundary (local only, contacts no source) -----------------------------------

export type CheckResult = { status: "READY" } | { status: "OPEN"; reasons: string[] };

const localConfig = z.object({
  user: z.string().trim().min(1, "user is missing"),
  decision: z.string().trim().min(1, "decision is missing"),
  mcp: z.object({
    server: z.literal("jira"),
    tool: z.string().regex(/^mcp__jira__[A-Za-z0-9_-]+$/, "use the exact Jira read tool from /mcp")
      .refine(name => !name.includes("REPLACE_WITH"), "replace the placeholder with the exact Jira read tool from /mcp"),
  }),
});

export function checkLiveConfig(config: unknown): CheckResult {
  if (config == null) return { status: "OPEN", reasons: [".bree.local.json is missing or unreadable"] };
  const result = localConfig.safeParse(config);
  return result.success ? { status: "READY" } : {
    status: "OPEN", reasons: result.error.issues.map(issue => issue.path.join(".") + ": " + issue.message),
  };
}

function loadLocalConfig(): unknown {
  try {
    return JSON.parse(readFileSync(join(root, ".bree.local.json"), "utf8"));
  } catch {
    return undefined;
  }
}

// ---- 2. exact tool, SDK options -----------------------------------------------------------------

export function makeCanUseTool(allowed: string): CanUseTool {
  return async (toolName, input) =>
    toolName === allowed
      ? { behavior: "allow", updatedInput: input }
      : { behavior: "deny", message: `Only ${allowed} is permitted in Bree.` };
}

export function buildQueryOptions(tool: string): Options {
  return {
    cwd: root,
    tools: [],
    settingSources: ["user", "local"],
    allowedTools: [tool],
    canUseTool: makeCanUseTool(tool),
    hooks: { PreToolUse: [{ hooks: [async input =>
      input.hook_event_name === "PreToolUse" && input.tool_name === tool ? {} : {
        hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny" },
      },
    ] }] },
    persistSession: false,
    permissionMode: "default",
    maxTurns: 6,
  };
}

// ---- 3. tool result and validation -------------------------------------------------------------

const ISSUE_KEY = /^[A-Z][A-Z0-9]+-\d+$/;

export function extractIssueKeys(result: { isError?: boolean; content: unknown }): string[] {
  if (result.isError) throw new Error("tool result failed");
  let data: unknown = result.content;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      throw new Error("tool result is unstructured (not JSON)");
    }
  }
  const issues = (data as { issues?: unknown } | null)?.issues;
  if (!Array.isArray(issues)) throw new Error("tool result is not structured (no issues array)");
  return issues.map((issue) => {
    const key = (issue as { key?: unknown } | null)?.key;
    if (typeof key !== "string" || !ISSUE_KEY.test(key)) throw new Error("tool result is not structured (issue without an exact key)");
    return key;
  });
}

export function validateLiveBrief(data: unknown, issueKeys: string[]): DailyBrief {
  const brief = parseBrief(data);
  const known = new Set(issueKeys);
  for (const source of brief.sources) {
    if (!known.has(source.id)) throw new Error(`unknown source ID in model output: ${source.id}`);
  }
  return brief;
}

// ---- 4. host-owned private output --------------------------------------------------------------

export function briefPath(date: string, home: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("date must be YYYY-MM-DD");
  return join(home, ".bree", "briefs", `${date}.html`);
}

export async function writePrivateBrief(brief: DailyBrief, where: { home?: string; repoRoot?: string } = {}): Promise<string> {
  const home = where.home ?? homedir();
  const repoRoot = resolve(where.repoRoot ?? root);
  const path = resolve(briefPath(brief.date, home));
  if (path === repoRoot || path.startsWith(repoRoot + sep)) throw new Error("refusing to write inside the repository");
  const dir = resolve(path, "..");
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await chmod(resolve(dir, ".."), 0o700);
  await chmod(dir, 0o700);
  await writeFile(path, renderBrief(brief), { mode: 0o600 });
  await chmod(path, 0o600);
  return path;
}

// ---- 5. the live run (a person starts it; never part of the tests) -----------------------------

function textOf(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((block) => (block as { text?: string }).text ?? "").join("");
  return "";
}

export async function runLive(config: z.infer<typeof localConfig>): Promise<string> {
  const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD in local time
  const options = buildQueryOptions(config.mcp.tool);
  options.systemPrompt =
    "You write one private Daily Brief. Use only the one permitted read-only tool, only for the user's own work items. " +
    "Never state a fact the tool result does not contain. Use an exact issue key as every source id. " +
    "A section with no evidence gets an OPEN item whose text starts with OPEN. Disagreeing evidence is a CONFLICT item whose text starts with CONFLICT. " +
    "Describe the work; do not decide for the reader. Return only a JSON object matching this schema: " +
    JSON.stringify(z.toJSONSchema(DailyBriefSchema));
  const prompt =
    `Make the Daily Brief for ${config.user}, date ${today}. The decision this brief supports: ${config.decision}. ` +
    `Read the user's own open work items with ${config.mcp.tool} and fill every DailyBrief section.`;

  const toolUseIds = new Set<string>();
  let issueKeys: string[] | undefined;
  let structured: unknown;
  for await (const message of query({ prompt, options })) {
    const content = (message as { message?: { content?: unknown } }).message?.content;
    if (message.type === "assistant" && Array.isArray(content)) {
      for (const block of content as { type: string; id?: string; name?: string }[]) {
        if (block.type === "tool_use" && block.name === config.mcp.tool && block.id) toolUseIds.add(block.id);
      }
    }
    if (message.type === "user" && Array.isArray(content)) {
      for (const block of content as { type: string; tool_use_id?: string; is_error?: boolean; content?: unknown }[]) {
        if (block.type === "tool_result" && block.tool_use_id && toolUseIds.has(block.tool_use_id)) {
          issueKeys = extractIssueKeys({ isError: block.is_error === true, content: textOf(block.content) });
        }
      }
    }
    if (message.type === "result") {
      if (message.subtype !== "success") throw new Error(`the model run ended with: ${message.subtype}`);
      structured = JSON.parse(message.result);
    }
  }
  if (!issueKeys) throw new Error("the approved tool returned no successful structured result");
  const brief = validateLiveBrief(structured, issueKeys);
  if (brief.date !== today) throw new Error("model output date is not today's date");
  return writePrivateBrief(brief);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = loadLocalConfig();
  const check = checkLiveConfig(config);
  if (process.argv.includes("--check")) {
    // Local preflight only: reads .bree.local.json. Contacts nothing.
    if (check.status === "READY") {
      console.log("READY — Jira tool name, user and decision are configured. Before a live run, confirm in /mcp that the tool is read-only. This check does not contact Jira.");
    } else {
      console.log("OPEN — live source proof is not ready:");
      for (const reason of check.reasons) console.log(`- ${reason}`);
      process.exitCode = EXIT_OPEN;
    }
  } else if (check.status !== "READY") {
    console.log("OPEN — not running the live route:");
    for (const reason of check.reasons) console.log(`- ${reason}`);
    process.exitCode = EXIT_OPEN;
  } else {
    try {
      const path = await runLive(localConfig.parse(config));
      console.log(`PASS — private brief written to ${path}`);
    } catch (error) {
      // Print the error class only: messages could echo connector or model content.
      console.log(`OPEN — live run did not produce a validated brief (${error instanceof Error ? error.name : "unknown error"}).`);
      process.exitCode = EXIT_OPEN;
    }
  }
}
