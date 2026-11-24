import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseBrief, type DailyBrief } from "../src/brief.js";
import {
  briefPath,
  buildQueryOptions,
  checkLiveConfig,
  extractIssueKeys,
  makeCanUseTool,
  readServerDefinition,
  validateLiveBrief,
  writePrivateBrief,
} from "../src/live.js";

// Synthetic names for tests only. The real tool name comes from /mcp and lives in the ignored .bree.local.json.
const TOOL = "mcp__jira__synthetic_search_own_issues";
const READY_CONFIG = {
  approvedCorporateConnector: true,
  approvedReadOnlyTool: true,
  authorizedModelAccount: true,
  modelProvider: "vertex",
  user: "Maya",
  decision: "Bring the top blocker to the 09:00 stand-up",
  mcp: { server: "jira", tool: TOOL },
};

const tmp = () => mkdtemp(join(tmpdir(), "bree-live-"));
const sample = async (): Promise<DailyBrief> =>
  parseBrief(JSON.parse(await readFile(new URL("../sample/brief.sample.json", import.meta.url), "utf8")));

async function liveBrief(): Promise<DailyBrief> {
  return parseBrief({
    title: "Maya's Daily Brief",
    date: "2026-11-24",
    greeting: "Good morning, Maya.",
    summary: { status: "READY", text: "One synthetic blocker is open.", sourceIds: ["DEMO-101"] },
    moveWorkForward: { status: "READY", text: "Bring DEMO-101 to the stand-up.", sourceIds: ["DEMO-101"] },
    topTodos: [{ status: "READY", text: "Read DEMO-101.", sourceIds: ["DEMO-101"] }],
    newUpdates: [{ status: "OPEN", text: "OPEN — no update source answered.", sourceIds: [] }],
    yourDay: [{ status: "OPEN", text: "OPEN — no calendar source is connected.", sourceIds: [] }],
    sources: [{ id: "DEMO-101", label: "Synthetic Jira issue" }],
  });
}

// ---- live configuration boundary -------------------------------------------------------------

test("the shipped example config is OPEN with one reason per missing approval and the placeholder tool", async () => {
  const example = JSON.parse(await readFile(new URL("../.bree.example.json", import.meta.url), "utf8"));
  const result = checkLiveConfig(example, {});
  assert.equal(result.status, "OPEN");
  const text = (result as { reasons: string[] }).reasons.join("\n");
  for (const needle of ["approvedCorporateConnector", "approvedReadOnlyTool", "authorizedModelAccount", "REPLACE_WITH", "AETHERLINK_JIRA_MCP_CONFIG"]) {
    assert.ok(text.includes(needle), `reason missing: ${needle}`);
  }
});

test("a missing config is OPEN, not an error", () => {
  const result = checkLiveConfig(undefined, {});
  assert.equal(result.status, "OPEN");
  assert.match((result as { reasons: string[] }).reasons.join("\n"), /\.bree\.local\.json/);
});

test("READY needs all three approvals, a well-formed tool for the named server, vertex, and an existing MCP config file", async () => {
  const dir = await tmp();
  const file = join(dir, "mcp.json");
  await writeFile(file, JSON.stringify({ mcpServers: { jira: { command: "synthetic" } } }));
  assert.deepEqual(checkLiveConfig(READY_CONFIG, { AETHERLINK_JIRA_MCP_CONFIG: file }), { status: "READY" });
  for (const key of ["approvedCorporateConnector", "approvedReadOnlyTool", "authorizedModelAccount"]) {
    assert.equal(checkLiveConfig({ ...READY_CONFIG, [key]: false }, { AETHERLINK_JIRA_MCP_CONFIG: file }).status, "OPEN");
  }
  assert.equal(checkLiveConfig({ ...READY_CONFIG, modelProvider: "anthropic" }, { AETHERLINK_JIRA_MCP_CONFIG: file }).status, "OPEN");
  assert.equal(checkLiveConfig({ ...READY_CONFIG, mcp: { server: "jira", tool: "mcp__other__read" } }, { AETHERLINK_JIRA_MCP_CONFIG: file }).status, "OPEN");
  assert.equal(checkLiveConfig(READY_CONFIG, { AETHERLINK_JIRA_MCP_CONFIG: join(dir, "missing.json") }).status, "OPEN");
  assert.equal(checkLiveConfig(READY_CONFIG, {}).status, "OPEN");
});

test("a truthy string is not an approval: flags must be the boolean true", async () => {
  const dir = await tmp();
  const file = join(dir, "mcp.json");
  await writeFile(file, "{}");
  assert.equal(checkLiveConfig({ ...READY_CONFIG, approvedReadOnlyTool: "true" }, { AETHERLINK_JIRA_MCP_CONFIG: file }).status, "OPEN");
});

// ---- exact allowed tool -----------------------------------------------------------------------

test("canUseTool allows exactly the approved tool", async () => {
  const canUse = makeCanUseTool(TOOL);
  const signal = new AbortController().signal;
  const allowed = await canUse(TOOL, { jql: "synthetic" }, { signal, toolUseID: "t1" });
  assert.equal(allowed.behavior, "allow");
});

test("canUseTool denies every unexpected tool, including near misses", async () => {
  const canUse = makeCanUseTool(TOOL);
  const signal = new AbortController().signal;
  for (const name of [
    "Bash", "Write", "Edit", "Read", "WebFetch", "Task",
    "mcp__jira__synthetic_update_issue",
    `${TOOL}_x`, `x${TOOL}`, TOOL.toUpperCase(), ` ${TOOL}`, "mcp__other__synthetic_search_own_issues", "",
  ]) {
    const result = await canUse(name, {}, { signal, toolUseID: "t" });
    assert.equal(result.behavior, "deny", `must deny ${JSON.stringify(name)}`);
  }
});

test("SDK options: no built-in tools, strict MCP config, only the selected server, one allowed tool, no inherited settings, no session on disk", async () => {
  const options = buildQueryOptions({ server: "jira", tool: TOOL, serverDefinition: { command: "synthetic" } as never });
  assert.deepEqual(options.tools, []);
  assert.equal(options.strictMcpConfig, true);
  assert.deepEqual(Object.keys(options.mcpServers ?? {}), ["jira"]);
  assert.deepEqual(options.allowedTools, [TOOL]);
  assert.equal(typeof options.canUseTool, "function");
  assert.deepEqual(options.settingSources, []);
  assert.equal(options.persistSession, false);
  assert.equal(options.outputFormat?.type, "json_schema");
});

test("readServerDefinition reads only the selected server from the config file", async () => {
  const dir = await tmp();
  const file = join(dir, "mcp.json");
  await writeFile(file, JSON.stringify({ mcpServers: { jira: { command: "synthetic-jira" }, mail: { command: "synthetic-mail" } } }));
  assert.deepEqual(readServerDefinition(file, "jira"), { command: "synthetic-jira" });
  assert.throws(() => readServerDefinition(file, "confluence"), /not defined/);
});

// ---- tool result and source ID rejection ------------------------------------------------------

test("a successful structured result yields exact issue keys", () => {
  const keys = extractIssueKeys({ isError: false, content: JSON.stringify({ issues: [{ key: "DEMO-101" }, { key: "DEMO-102" }] }) });
  assert.deepEqual(keys, ["DEMO-101", "DEMO-102"]);
  assert.deepEqual(extractIssueKeys({ content: { issues: [] } }), []);
});

test("a failed tool result is rejected", () => {
  assert.throws(() => extractIssueKeys({ isError: true, content: JSON.stringify({ issues: [{ key: "DEMO-101" }] }) }), /failed/);
});

test("an unstructured tool result is rejected", () => {
  for (const content of ["plain text answer", "", "{not json", JSON.stringify({ result: "ok" }), JSON.stringify({ issues: "DEMO-101" }), JSON.stringify({ issues: [{ id: "1" }] }), JSON.stringify({ issues: [{ key: "not a key" }] })]) {
    assert.throws(() => extractIssueKeys({ isError: false, content }), /unstructured|structured/, `must reject ${content}`);
  }
});

test("an unknown source ID is rejected", async () => {
  const brief = await liveBrief();
  assert.equal(validateLiveBrief(brief, ["DEMO-101"]).sources.length, 1);
  assert.throws(() => validateLiveBrief(brief, ["DEMO-999"]), /unknown source/i);
  assert.throws(() => validateLiveBrief(brief, []), /unknown source/i);
});

test("a source ID that is not an exact key (synthetic prefixes, calendar) is rejected live", async () => {
  const brief = await sample();
  assert.throws(() => validateLiveBrief(brief, ["DEMO-101", "DEMO-102"]), /unknown source/i);
});

test("unvalidated model output is rejected before anything is rendered", () => {
  assert.throws(() => validateLiveBrief({ title: "only a title" }, ["DEMO-101"]));
  assert.throws(() => validateLiveBrief("<html>model wrote a page</html>", ["DEMO-101"]));
});

// ---- private output path ----------------------------------------------------------------------

test("the artifact path is ~/.bree/briefs/YYYY-MM-DD.html", () => {
  assert.equal(briefPath("2026-11-24", "/home/maya"), join("/home/maya", ".bree", "briefs", "2026-11-24.html"));
});

test("the artifact path rejects anything that is not a plain date", () => {
  for (const date of ["../../etc/passwd", "2026-11-24/../x", "2026-1-1", "", "2026-11-24.html"]) {
    assert.throws(() => briefPath(date, "/home/maya"), /date/i, `must reject ${date}`);
  }
});

test("the host writes the validated HTML with private permissions", async () => {
  const home = await tmp();
  const path = await writePrivateBrief(await liveBrief(), { home, repoRoot: process.cwd() });
  assert.equal(path, join(home, ".bree", "briefs", "2026-11-24.html"));
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  assert.equal((await stat(join(home, ".bree", "briefs"))).mode & 0o777, 0o700);
  const html = await readFile(path, "utf8");
  assert.ok(html.includes("One synthetic blocker is open."));
  assert.ok(html.includes("OPEN — no calendar source is connected."));
});

test("the host refuses to write inside the repository", async () => {
  const home = await tmp();
  await assert.rejects(writePrivateBrief(await liveBrief(), { home, repoRoot: home }), /repository/i);
});
