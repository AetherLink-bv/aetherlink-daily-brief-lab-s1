import assert from "node:assert/strict";
import childProcess from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, stat } from "node:fs/promises";
import os, { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { isPrivateWindowsAcl, PrivateOutputError } from "../src/private-windows.js";
import { parseBrief, type DailyBrief } from "../src/brief.js";
import {
  briefPath,
  buildQueryOptions,
  checkLiveConfig,
  extractIssueKeys,
  makeCanUseTool,
  runLive,
  validateLiveBrief,
  writePrivateBrief,
} from "../src/live.js";

// Synthetic names for tests only. The real tool name comes from /mcp and lives in the ignored .bree.local.json.
const TOOL = "mcp__jira__synthetic_search_own_issues";
const READY_CONFIG = {
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

test("the example stays OPEN until the participant enters the exact Jira tool", async () => {
  const example = JSON.parse(await readFile(new URL("../.bree.example.json", import.meta.url), "utf8"));
  const result = checkLiveConfig(example);
  assert.equal(result.status, "OPEN");
  if (result.status === "OPEN") assert.match(result.reasons.join("\n"), /placeholder/);
});

test("READY needs a local Jira tool, a user and a decision", () => {
  assert.deepEqual(checkLiveConfig(READY_CONFIG), { status: "READY" });
  for (const config of [
    undefined, null, [],
    { ...READY_CONFIG, user: "   " }, { ...READY_CONFIG, decision: 1 },
    { ...READY_CONFIG, mcp: null },
    { ...READY_CONFIG, mcp: { server: "other", tool: "mcp__other__read" } },
    { ...READY_CONFIG, mcp: { server: "jira", tool: "mcp__other__read" } },
    { ...READY_CONFIG, mcp: { server: "jira", tool: "mcp__jira__*" } },
  ]) assert.equal(checkLiveConfig(config).status, "OPEN");
});

test("local preflight checks the name; the participant verifies read-only permission in /mcp", () => {
  const mcp = { server: "jira", tool: "mcp__jira__synthetic_update_issue" };
  assert.deepEqual(checkLiveConfig({ ...READY_CONFIG, mcp }), { status: "READY" });
});

// ---- exact allowed tool -----------------------------------------------------------------------

test("canUseTool allows exactly the approved tool", async () => {
  const canUse = makeCanUseTool(TOOL);
  const signal = new AbortController().signal;
  const allowed = await canUse(TOOL, { jql: "synthetic" }, { signal, toolUseID: "t1", requestId: "r1" });
  assert.equal(allowed?.behavior, "allow");
});

test("canUseTool denies every unexpected tool, including near misses", async () => {
  const canUse = makeCanUseTool(TOOL);
  const signal = new AbortController().signal;
  for (const name of [
    "Bash", "Write", "Edit", "Read", "WebFetch", "Task",
    "mcp__jira__synthetic_update_issue",
    `${TOOL}_x`, `x${TOOL}`, TOOL.toUpperCase(), ` ${TOOL}`, "mcp__other__synthetic_search_own_issues", "",
  ]) {
    const result = await canUse(name, {}, { signal, toolUseID: "t", requestId: "r" });
    assert.equal(result?.behavior, "deny", `must deny ${JSON.stringify(name)}`);
  }
});

test("Worldline SDK loads user and local settings and denies unexpected tools before use", async () => {
  const options = buildQueryOptions(TOOL);
  assert.deepEqual(options.tools, []);
  assert.deepEqual(options.settingSources, ["user", "local"]);
  assert.equal(options.strictMcpConfig, undefined);
  assert.equal(options.mcpServers, undefined);
  assert.deepEqual(options.allowedTools, [TOOL]);
  assert.equal(options.persistSession, false);
  const hook = options.hooks?.PreToolUse?.[0]?.hooks[0];
  assert.ok(hook);
  for (const name of [TOOL, "Bash", "mcp__jira__write", "mcp__other__read"]) {
    const result = await hook({
      hook_event_name: "PreToolUse", session_id: "test", cwd: "/tmp",
      transcript_path: "", tool_name: name, tool_input: {}, tool_use_id: "test",
    }, "test", { signal: new AbortController().signal });
    assert.deepEqual(result, name === TOOL ? {} : {
      hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny" },
    });
  }
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

test("the host writes the validated HTML with POSIX permissions", { skip: process.platform === "win32" }, async () => {
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

test("Windows privacy needs a DACL with only the reader, SYSTEM or local administrators", () => {
  const user = "S-1-5-21-11-22-33-1001";
  const system = "S-1-5-18";
  const acl = { owner: user, aces: [
    { kind: "AccessAllowed", sid: user }, { kind: "AccessAllowed", sid: system },
    { kind: "AccessAllowed", sid: "S-1-5-32-544" },
    { kind: "AccessDenied", sid: "S-1-1-0" },
  ] };
  assert.equal(isPrivateWindowsAcl(user, acl), true);
  for (const invalid of [
    null, {}, { ...acl, owner: "S-1-1-0" }, { ...acl, aces: null },
    { ...acl, aces: [{ kind: "AccessAllowed", sid: "S-1-5-32-545" }] },
    { ...acl, aces: [{ kind: "AccessAllowedCallback", sid: user }] },
    { ...acl, aces: [{ kind: "AccessAllowed", sid: user }, {}] },
  ]) assert.equal(isPrivateWindowsAcl(user, invalid), false);
});

test("unverified Windows output stops before the first model call", async t => {
  t.mock.method(os, "platform", () => "win32");
  t.mock.method(os, "homedir", () => join(tmpdir(), "outside-real-profile"));
  let calls = 0;
  const fakeQuery = () => { calls++; throw new Error("Unexpected SDK call"); };
  await assert.rejects(runLive({ ...READY_CONFIG, mcp: { server: "jira", tool: TOOL } }, fakeQuery), PrivateOutputError);
  assert.equal(calls, 0);
});

test("a broad ACL on an existing dated page stops Windows before any model call", async t => {
  const user = "S-1-5-21-11-22-33-1001";
  const safe = { owner: user, aces: [{ kind: "AccessAllowed", sid: user }] };
  const shared = { owner: user, aces: [{ kind: "AccessAllowed", sid: "S-1-1-0" }] };
  t.mock.method(os, "platform", () => "win32");
  t.mock.method(childProcess, "execFileSync", () => JSON.stringify({ user, records: [safe, safe, shared] }));
  const fakeQuery = t.mock.fn(() => { throw new Error("Unexpected SDK call"); });
  await assert.rejects(runLive({ ...READY_CONFIG, mcp: { server: "jira", tool: TOOL } }, fakeQuery), PrivateOutputError);
  assert.equal(fakeQuery.mock.callCount(), 0);
});

test("verified Windows permissions publish a synthetic page only after staging is checked", async t => {
  const home = await tmp();
  const dir = join(home, ".bree", "briefs");
  await mkdir(dir, { recursive: true });
  const user = "S-1-5-21-11-22-33-1001";
  const record = { owner: user, aces: [{ kind: "AccessAllowed", sid: user }] };
  const checks: number[] = [];
  t.mock.method(os, "platform", () => "win32");
  t.mock.method(childProcess, "execFileSync", (_exe: string, args: string[]) => {
    const size = args.includes("-StagedPath") ? 3 : 2;
    checks.push(size);
    return JSON.stringify({ user, records: Array(size).fill(record) });
  });
  const path = await writePrivateBrief(await liveBrief(), { home });
  assert.deepEqual(checks, [2, 3, 3]);
  assert.deepEqual(await readdir(dir), ["2026-11-24.html"]);
  assert.match(await readFile(path, "utf8"), /One synthetic blocker/);
});
