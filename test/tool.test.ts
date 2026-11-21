import assert from "node:assert/strict";
import { test } from "node:test";
import fixture from "../sample/outlook-email.sample.json" with { type: "json" };
import { summarizeSyntheticRequest } from "../src/outlook.js";

test("summarises one synthetic request through a tool-free mocked SDK query", async () => {
  let options: any;
  const result = await summarizeSyntheticRequest(fixture, async function* (args) {
    options = args.options;
    yield { type: "result", subtype: "success", result: JSON.stringify({ messageId: "MAIL-DEMO-001", summary: "Review the fictional workshop outline.", action: "Note one unclear instruction.", dueAt: "15:00", sourceId: "MAIL-DEMO-001" }) };
  });
  assert.deepEqual(options.tools, []);
  assert.deepEqual(options.allowedTools, []);
  assert.equal(options.strictMcpConfig, true);
  assert.deepEqual(options.mcpServers, {});
  assert.equal(result.dueAt, "15:00");
  assert.equal(result.sourceId, fixture.messageId);
});

test("rejects a source ID the fixture did not provide", async () => {
  await assert.rejects(() => summarizeSyntheticRequest(fixture, async function* () {
    yield { type: "result", subtype: "success", result: JSON.stringify({ messageId: "MAIL-DEMO-001", summary: "Invented", action: "Invented", dueAt: "15:00", sourceId: "MAIL-LIVE-999" }) };
  }), /source ID/);
});

test("rejects a deadline the fixture did not provide", async () => {
  await assert.rejects(() => summarizeSyntheticRequest(fixture, async function* () {
    yield { type: "result", subtype: "success", result: JSON.stringify({ messageId: "MAIL-DEMO-001", summary: "Review", action: "Note one issue", dueAt: "23:59", sourceId: "MAIL-DEMO-001" }) };
  }), /deadline/);
});
