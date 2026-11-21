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
