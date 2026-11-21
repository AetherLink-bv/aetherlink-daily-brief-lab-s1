import assert from "node:assert/strict";
import test from "node:test";
import { runAgent } from "../src/agent.js";

test("controlled model calls only readAgenda and returns an answer", async () => {
  const result = await runAgent("Prepare my decision line", "sample/calendar-item.sample.json");
  assert.equal(result.status, "ordinary");
  assert.match(result.line, /Bring the top blocker/);
});

test("source error names the missing start field", async () => {
  await assert.rejects(runAgent("Prepare my decision line", "sample/calendar-item.invalid.json"), /SOURCE_ERROR: items\.0\.start/);
});
