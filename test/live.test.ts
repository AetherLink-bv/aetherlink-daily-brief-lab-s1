import assert from "node:assert/strict";
import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import sample from "../sample/brief.sample.json" with { type: "json" };
import { buildSdkOptions, checkLiveConfig, privateOutputPath, runLive, type BreeConfig } from "../src/live.js";

const ready = { approvedCorporateConnector: true, approvedReadOnlyTool: true, authorizedModelAccount: true, modelProvider: "vertex", user: "Maya", decision: "Choose blocker", mcp: { server: "jira", tool: "mcp__jira__search_my_issues", configPath: "/approved/jira.json" } } satisfies BreeConfig;

test("permits exactly one read-only tool and denies every other tool", async () => {
  const options = buildSdkOptions(ready, { jira: { command: "approved-jira" } });
  assert.deepEqual(options.tools, []);
  assert.deepEqual(options.allowedTools, [ready.mcp.tool]);
  assert.equal(options.strictMcpConfig, true);
  assert.deepEqual(options.settingSources, []);
  const allowed = await options.canUseTool!(ready.mcp.tool, {}, {} as never);
  const denied = await options.canUseTool!("Bash", {}, {} as never);
  assert.ok(allowed && denied);
  assert.equal(allowed.behavior, "allow");
  assert.equal(denied.behavior, "deny");
});

test("preflight names missing approval and placeholder tool", () => {
  assert.match(checkLiveConfig({ ...ready, approvedReadOnlyTool: false }).join(" "), /read-only tool approval/);
  assert.match(checkLiveConfig({ ...ready, mcp: { ...ready.mcp, tool: "mcp__jira__REPLACE_WITH_EXACT_READ_ONLY_TOOL_FROM_MCP" } }).join(" "), /exact Jira tool/);
});

test("private artifact path rejects traversal-like dates", () => {
  assert.match(privateOutputPath("2026-11-21"), /\.bree\/briefs\/2026-11-21\.html$/);
  assert.throws(() => privateOutputPath("../../escape"), /Invalid brief date/);
});

test("full live boundary accepts only exact keys from successful structured output", async () => {
  const output = join(await mkdtemp(join(tmpdir(), "bree-live-")), "brief.html");
  const liveBrief = structuredClone(sample);
  liveBrief.summary.sourceIds = ["jira:DEMO-101"];
  liveBrief.moveWorkForward.sourceIds = ["jira:DEMO-101"];
  liveBrief.topTodos = [liveBrief.topTodos[0]!];
  liveBrief.newUpdates = [{ status: "OPEN", text: "OPEN — no new update", sourceIds: [] }];
  liveBrief.yourDay = [{ status: "OPEN", text: "OPEN — calendar is unavailable", sourceIds: [] }];
  liveBrief.sources = [{ id: "jira:DEMO-101", label: "Approved Jira item" }];
  const messages = [
    { type: "assistant", message: { content: [{ type: "tool_use", id: "call-1", name: ready.mcp.tool }] } },
    { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "call-1", is_error: false, structuredContent: { issues: [{ key: "DEMO-101" }] } }] } },
    { type: "result", subtype: "success", result: JSON.stringify(liveBrief) }
  ];
  const result = await runLive(ready, { query: async function* () { yield* messages; }, mcpServers: { jira: { command: "approved-jira" } }, vertexEnabled: true, outputPath: output });
  assert.equal(result, output);
  assert.match(await readFile(output, "utf8"), /Approved Jira item/);
  assert.equal((await stat(output)).mode & 0o777, 0o600);
});

test("rejects keys from prose, failed calls, other calls, and unlisted sources", async () => {
  const candidate = structuredClone(sample);
  candidate.sources = [{ id: "jira:DEMO-101", label: "Unproven" }];
  candidate.summary.sourceIds = ["jira:DEMO-101"];
  candidate.moveWorkForward.sourceIds = ["jira:DEMO-101"];
  candidate.topTodos = [{ status: "OPEN", text: "OPEN — no todo evidence", sourceIds: [] }];
  candidate.newUpdates = [{ status: "OPEN", text: "OPEN — no update evidence", sourceIds: [] }];
  candidate.yourDay = [{ status: "OPEN", text: "OPEN — no day evidence", sourceIds: [] }];
  const messages = [
    { type: "assistant", message: { content: [{ type: "text", text: "DEMO-101" }, { type: "tool_use", id: "other", name: "Bash" }, { type: "tool_use", id: "call-1", name: ready.mcp.tool }] } },
    { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "call-1", is_error: true, structuredContent: { issues: [{ key: "DEMO-101" }] } }, { type: "tool_result", tool_use_id: "other", is_error: false, structuredContent: { issues: [{ key: "DEMO-101" }] } }] } },
    { type: "result", subtype: "success", result: JSON.stringify(candidate) }
  ];
  await assert.rejects(() => runLive(ready, { query: async function* () { yield* messages; }, mcpServers: { jira: { command: "approved-jira" } }, vertexEnabled: true, outputPath: join(tmpdir(), "must-not-write.html") }), /Unpermitted live source ID/);
});

test("fails closed before query when Vertex is unavailable", async () => {
  let queried = false;
  await assert.rejects(() => runLive(ready, { query: async function* () { queried = true; }, mcpServers: { jira: { command: "approved-jira" } }, vertexEnabled: false, outputPath: join(tmpdir(), "must-not-write.html") }), /Vertex/);
  assert.equal(queried, false);
});
