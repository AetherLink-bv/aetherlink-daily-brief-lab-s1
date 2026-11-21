import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { McpServerStatus, SDKControlInitializeResponse, SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import type { DailyBrief } from "../src/brief.js";
import { buildLiveOptions, loadLiveConfig, runLive, writePrivateBrief, type LiveConfig } from "../src/live.js";

const config: LiveConfig = {
  approvedCorporateConnector: true,
  approvedReadOnlyTool: true,
  authorizedModelAccount: true,
  modelProvider: "vertex",
  user: "Maya",
  decision: "Bring the top blocker to the 09:00 stand-up",
  mcp: {
    server: "jira",
    tool: "mcp__jira__search_issues",
  },
};

function fakeRun(
  messages: () => AsyncGenerator<SDKMessage, void>,
  status: "connected" | "failed" | "needs-auth" = "connected",
  tools: NonNullable<McpServerStatus["tools"]> = [{ name: "search_issues", annotations: { readOnly: true } }],
  onCleanup?: () => void,
  apiProvider: "vertex" | "firstParty" = "vertex",
) {
  return () => {
    const iterator = messages();
    const close = iterator.return.bind(iterator);
    return Object.assign(iterator, {
      initializationResult: async () => ({ account: { apiProvider }, hooks_applied: true }) as unknown as SDKControlInitializeResponse,
      mcpServerStatus: async () => [{ name: "jira", status, tools }],
      return: async (value: void) => {
        onCleanup?.();
        return close(value);
      },
    });
  };
}

function assistantToolMessage(tools: Array<{ id: string; name: string }>): SDKMessage {
  return {
    type: "assistant",
    parent_tool_use_id: null,
    uuid: "00000000-0000-4000-8000-000000000001",
    session_id: "session",
    message: {
      id: "msg",
      type: "message",
      role: "assistant",
      model: "test",
      content: tools.map((tool) => ({ type: "tool_use", ...tool, input: {} })),
      stop_reason: null,
      stop_sequence: null,
      usage: { input_tokens: 0, output_tokens: 0 },
    },
  } as unknown as SDKMessage;
}

function toolResultMessage(id: string, isError = false, content = JSON.stringify({ issues: [{ key: "DEMO-101" }] })): SDKMessage {
  return {
    type: "user",
    parent_tool_use_id: null,
    message: {
      role: "user",
      content: [{ type: "tool_result", tool_use_id: id, content, is_error: isError }],
    },
  } as unknown as SDKMessage;
}

function successMessage(output: unknown): SDKMessage {
  return {
    type: "result",
    subtype: "success",
    is_error: false,
    duration_ms: 1,
    duration_api_ms: 1,
    num_turns: 1,
    result: JSON.stringify(output),
    stop_reason: "end_turn",
    total_cost_usd: 0,
    usage: {},
    modelUsage: {},
    permission_denials: [],
    uuid: "00000000-0000-4000-8000-000000000002",
    session_id: "session",
  } as unknown as SDKMessage;
}

const readyBrief: DailyBrief = {
  title: "Maya's Daily Brief",
  date: "2026-11-21",
  greeting: "Good morning, Maya.",
  summary: { status: "READY", text: "The checkout blocker needs a decision.", sourceIds: ["DEMO-101"] },
  moveWorkForward: { status: "READY", text: "Bring the checkout blocker to the stand-up.", sourceIds: ["DEMO-101"] },
  topTodos: [{ status: "READY", text: "Choose an owner for the blocker.", sourceIds: ["DEMO-101"] }],
  newUpdates: [
    { status: "READY", text: "The issue has a new engineering comment.", sourceIds: ["DEMO-101"] },
    { status: "OPEN", text: "OPEN — email is not connected.", sourceIds: [] },
  ],
  yourDay: [{ status: "OPEN", text: "OPEN — calendar is not connected.", sourceIds: [] }],
  sources: [{ id: "DEMO-101", label: "Jira issue DEMO-101" }],
};

test("builds an isolated SDK session with one approved tool", async () => {
  const options = buildLiveOptions(config);
  assert.deepEqual(options.tools, []);
  assert.deepEqual(options.allowedTools, [config.mcp.tool]);
  assert.equal("mcpServers" in options, false);
  assert.equal("strictMcpConfig" in options, false);
  assert.equal("settingSources" in options, false);
  assert.equal(options.persistSession, false);
  assert.equal(options.permissionMode, "dontAsk");
  assert.equal(typeof options.stderr, "function");
  assert.deepEqual(await options.canUseTool?.(config.mcp.tool, {}, {
    signal: AbortSignal.timeout(100),
    toolUseID: "tool-1",
    requestId: "request-1",
  }), { behavior: "allow" });
  assert.deepEqual(await options.canUseTool?.("Bash", {}, {
    signal: AbortSignal.timeout(100),
    toolUseID: "tool-2",
    requestId: "request-2",
  }), {
    behavior: "deny",
    message: "Bree permits only the configured read-only source tool.",
    interrupt: true,
  });
  const guard = options.hooks?.PreToolUse?.[0]?.hooks[0];
  assert.ok(guard);
  const hookInput = (tool_name: string) => ({
    hook_event_name: "PreToolUse" as const,
    tool_name,
    tool_input: {},
    tool_use_id: "tool",
    session_id: "session",
    transcript_path: "",
    cwd: "/tmp",
    permission_mode: "dontAsk" as const,
  });
  const hookOptions = { signal: AbortSignal.timeout(100) };
  const hookDecision = async (toolName: string) => {
    const output = await guard(hookInput(toolName), "tool", hookOptions);
    assert.ok("hookSpecificOutput" in output);
    const specific = output.hookSpecificOutput;
    assert.equal(specific?.hookEventName, "PreToolUse");
    return specific?.hookEventName === "PreToolUse" ? specific.permissionDecision : undefined;
  };
  assert.equal(await hookDecision(config.mcp.tool), "allow");
  assert.equal(await hookDecision("StructuredOutput"), "deny");
  assert.equal(await hookDecision("mcp__jira__get_issue"), "deny");
  assert.equal(await hookDecision("Bash"), "deny");
});

test("requires explicit approvals, matching MCP alias and the Vertex route", async () => {
  await assert.rejects(loadLiveConfig(".bree.example.json", { CLAUDE_CODE_USE_VERTEX: "1" }), /expected true/);
  const directory = await mkdtemp(join(tmpdir(), "bree-live-test-"));
  const path = join(directory, "config.json");
  try {
    await writeFile(path, JSON.stringify({ ...config, mcp: { server: "other", tool: config.mcp.tool } }));
    await assert.rejects(loadLiveConfig(path, { CLAUDE_CODE_USE_VERTEX: "1" }), /tool must match/);
    await writeFile(path, JSON.stringify(config));
    await assert.rejects(loadLiveConfig(path, {}), /Vertex model route/);
    await assert.rejects(loadLiveConfig(path, { CLAUDE_CODE_USE_VERTEX: "0" }), /Vertex model route/);
    assert.deepEqual(await loadLiveConfig(path, { CLAUDE_CODE_USE_VERTEX: "1" }), { config });
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("accepts validated JSON only after the configured Jira source tool ran", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([{ id: "source-tool", name: config.mcp.tool }]);
    yield toolResultMessage("source-tool");
    yield successMessage(readyBrief);
  };
  const result = await runLive(config, fakeRun(messages), readyBrief.date);
  assert.equal(result.title, "Maya's Daily Brief");
  assert.equal(result.moveWorkForward.sourceIds[0], "DEMO-101");
});

test("rejects output when the approved tool result failed", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([{ id: "source-tool", name: config.mcp.tool }]);
    yield toolResultMessage("source-tool", true);
    yield successMessage(readyBrief);
  };
  await assert.rejects(runLive(config, fakeRun(messages), readyBrief.date), /approved source was not verified/);
});

test("rejects duplicate or unexpected MCP source calls", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([
      { id: "source-tool", name: config.mcp.tool },
      { id: "other-tool", name: "mcp__jira__get_issue" },
    ]);
    yield toolResultMessage("source-tool");
    yield toolResultMessage("other-tool");
    yield successMessage(readyBrief);
  };
  await assert.rejects(runLive(config, fakeRun(messages), readyBrief.date), /approved source was not verified/);
});

test("rejects READY items without source references", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([{ id: "source-tool", name: config.mcp.tool }]);
    yield toolResultMessage("source-tool");
    yield successMessage({ ...readyBrief, summary: { ...readyBrief.summary, sourceIds: [] } });
  };
  await assert.rejects(runLive(config, fakeRun(messages), readyBrief.date), /READY and CONFLICT items require/);
});

test("rejects source references absent from the source list", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([{ id: "source-tool", name: config.mcp.tool }]);
    yield toolResultMessage("source-tool");
    yield successMessage({ ...readyBrief, summary: { ...readyBrief.summary, sourceIds: ["MISSING-999"] } });
  };
  await assert.rejects(runLive(config, fakeRun(messages), readyBrief.date), /unknown source ID/);
});

test("rejects a cited source ID absent from the approved tool result", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([{ id: "source-tool", name: config.mcp.tool }]);
    yield toolResultMessage("source-tool", false, "Unstructured Jira text mentions DEMO-101");
    yield successMessage(readyBrief);
  };
  await assert.rejects(runLive(config, fakeRun(messages), readyBrief.date), /not present in the approved source result/);
});

test("does not treat an issue key inside a JSON error message as source evidence", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([{ id: "source-tool", name: config.mcp.tool }]);
    yield toolResultMessage("source-tool", false, JSON.stringify({ error: "Issue DEMO-101 was not found" }));
    yield successMessage(readyBrief);
  };
  await assert.rejects(runLive(config, fakeRun(messages), readyBrief.date), /not present in the approved source result/);
});

test("rejects a model-provided date that differs from the host date", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield assistantToolMessage([{ id: "source-tool", name: config.mcp.tool }]);
    yield toolResultMessage("source-tool");
    yield successMessage(readyBrief);
  };
  await assert.rejects(runLive(config, fakeRun(messages), "2026-11-22"), /did not match the host date/);
});

test("rejects output when no structured result exists", async () => {
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {
    yield {
      type: "result",
      subtype: "error_during_execution",
      is_error: true,
      duration_ms: 1,
      duration_api_ms: 1,
      num_turns: 1,
      stop_reason: null,
      total_cost_usd: 0,
      usage: {},
      modelUsage: {},
      permission_denials: [],
      errors: ["private upstream detail"],
      uuid: "00000000-0000-4000-8000-000000000003",
      session_id: "session",
    } as unknown as SDKMessage;
  };
  await assert.rejects(runLive(config, fakeRun(messages), readyBrief.date), /approved source was not verified/);
});

test("fails OPEN and closes the SDK query when the inherited MCP source is unavailable", async () => {
  let cleanedUp = false;
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {};
  await assert.rejects(
    runLive(config, fakeRun(messages, "needs-auth", [], () => { cleanedUp = true; })),
    /not connected or verified/,
  );
  assert.equal(cleanedUp, true);
});

test("rejects and closes an MCP tool without read-only annotations", async () => {
  let cleanedUp = false;
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {};
  await assert.rejects(
    runLive(config, fakeRun(messages, "connected", [{ name: "search_issues", annotations: { readOnly: false } }], () => { cleanedUp = true; })),
    /read-only source/,
  );
  assert.equal(cleanedUp, true);
});

test("rejects a personal model route and closes the SDK query", async () => {
  let cleanedUp = false;
  const messages = async function* (): AsyncGenerator<SDKMessage, void> {};
  await assert.rejects(
    runLive(config, fakeRun(messages, "connected", [{ name: "search_issues" }], () => { cleanedUp = true; }, "firstParty")),
    /Vertex route/,
  );
  assert.equal(cleanedUp, true);
});

test("writes one private dated HTML artifact and safely replaces a same-day run", async () => {
  const parent = await mkdtemp(join(tmpdir(), "bree-private-test-"));
  const directory = join(parent, "briefs");
  try {
    const firstPath = await writePrivateBrief(readyBrief, directory);
    assert.equal(firstPath, join(directory, "2026-11-21.html"));
    const replacement = {
      ...readyBrief,
      greeting: "Good morning, Maya <script>alert(1)</script>.",
      sources: [{ id: "DEMO-101", label: "Jira <private> issue" }],
    };
    const secondPath = await writePrivateBrief(replacement, directory);
    assert.equal(secondPath, firstPath);
    const html = await readFile(secondPath, "utf8");
    assert.match(html, /Move your work forward/);
    assert.match(html, /Top to-dos/);
    assert.match(html, /New updates/);
    assert.match(html, /Your day/);
    assert.match(html, /Sources/);
    assert.match(html, /OPEN — calendar is not connected/);
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(html, /Jira &lt;private&gt; issue/);
    if (process.platform !== "win32") {
      assert.equal((await stat(directory)).mode & 0o777, 0o700);
      assert.equal((await stat(secondPath)).mode & 0o777, 0o600);
    }
  } finally {
    await rm(parent, { recursive: true });
  }
});
