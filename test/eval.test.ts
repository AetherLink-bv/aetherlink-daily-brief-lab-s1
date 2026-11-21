import assert from "node:assert/strict";
import { test } from "node:test";
import conflict from "../sample/eval/conflict-brief.json" with { type: "json" };
import missing from "../sample/eval/missing-brief.json" with { type: "json" };
import ordinary from "../sample/eval/ordinary-brief.json" with { type: "json" };
import { parseDailyBrief } from "../src/brief.js";
import { renderBrief } from "../src/render.js";

test("ordinary fixture is a complete READY brief with resolved sources", () => {
  const brief = parseDailyBrief(ordinary);
  assert.equal(brief.summary.status, "READY");
  assert.deepEqual(brief.summary.sourceIds, ["jira:DEMO-101", "calendar:CAL-001"]);
  assert.match(renderBrief(brief), /checkout blocker is the main decision/);
});

test("missing fixture keeps the unavailable calendar section OPEN", () => {
  const brief = parseDailyBrief(missing);
  assert.equal(brief.yourDay[0]!.status, "OPEN");
  assert.deepEqual(brief.yourDay[0]!.sourceIds, []);
  assert.match(renderBrief(brief), /OPEN — calendar source unavailable/);
});

test("conflict fixture preserves both exact source IDs", () => {
  const brief = parseDailyBrief(conflict);
  assert.equal(brief.moveWorkForward.status, "CONFLICT");
  assert.deepEqual(brief.moveWorkForward.sourceIds, ["jira:DEMO-102", "jira:DEMO-103"]);
  assert.match(renderBrief(brief), /Jira lists two different owners/);
});

test("ordinary fixture rejects an unknown source reference", () => {
  const invalid = structuredClone(ordinary);
  invalid.summary.sourceIds = ["jira:UNKNOWN-999"];
  assert.throws(() => parseDailyBrief(invalid), /Unresolved source ID/);
});

test("missing fixture rejects a READY item without evidence", () => {
  const invalid = structuredClone(missing);
  invalid.yourDay[0]!.status = "READY";
  assert.throws(() => parseDailyBrief(invalid), /needs a source ID/);
});

test("conflict fixture rejects text without the CONFLICT label", () => {
  const invalid = structuredClone(conflict);
  invalid.moveWorkForward.text = "Two owners are named.";
  assert.throws(() => parseDailyBrief(invalid), /must start CONFLICT/);
});
