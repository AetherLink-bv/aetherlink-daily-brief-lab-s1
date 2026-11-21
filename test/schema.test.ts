import assert from "node:assert/strict";
import { test } from "node:test";
import sample from "../sample/brief.sample.json" with { type: "json" };
import { parseDailyBrief } from "../src/brief.js";

test("accepts the complete sample", () => assert.equal(parseDailyBrief(sample).title, "The Wednesday Brief"));

test("rejects an invalid unresolved source", () => {
  const invalid = structuredClone(sample);
  invalid.summary.sourceIds = ["jira:UNKNOWN"];
  assert.throws(() => parseDailyBrief(invalid), /Unresolved source ID/);
});

test("accepts a fully OPEN brief with no sources", () => {
  const open = structuredClone(sample);
  open.summary = { status: "OPEN", text: "OPEN — no summary evidence", sourceIds: [] };
  open.moveWorkForward = { status: "OPEN", text: "OPEN — no action evidence", sourceIds: [] };
  open.topTodos = [{ status: "OPEN", text: "OPEN — no todo evidence", sourceIds: [] }];
  open.newUpdates = [{ status: "OPEN", text: "OPEN — no update evidence", sourceIds: [] }];
  open.yourDay = [{ status: "OPEN", text: "OPEN — no day evidence", sourceIds: [] }];
  open.sources = [];
  assert.deepEqual(parseDailyBrief(open).sources, []);
});
