import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSdkOptions, checkLiveConfig, privateOutputPath, type BreeConfig } from "../src/live.js";

const ready = { approvedCorporateConnector: true, approvedReadOnlyTool: true, authorizedModelAccount: true, modelProvider: "vertex", user: "Maya", decision: "Choose blocker", mcp: { server: "jira", tool: "mcp__jira__search_my_issues" } } satisfies BreeConfig;

test("permits exactly one read-only tool and no built-ins", () => {
  assert.deepEqual(buildSdkOptions(ready), { allowedTools: [ready.mcp.tool], tools: [ready.mcp.tool], permissionMode: "default" });
});

test("preflight names missing approval and placeholder tool", () => {
  assert.match(checkLiveConfig({ ...ready, approvedReadOnlyTool: false }).join(" "), /read-only tool approval/);
  assert.match(checkLiveConfig({ ...ready, mcp: { server: "jira", tool: "mcp__jira__REPLACE_WITH_EXACT_READ_ONLY_TOOL_FROM_MCP" } }).join(" "), /exact Jira tool/);
});

test("private artifact path is dated outside the repository", () => assert.match(privateOutputPath("2026-11-21"), /\.bree\/briefs\/2026-11-21\.html$/));
