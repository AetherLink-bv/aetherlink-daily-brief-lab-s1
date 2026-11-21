import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildBrief } from "../src/brief.js";

const load = async (name: string): Promise<unknown> => JSON.parse(await readFile(`sample/eval/${name}.json`, "utf8"));

test("ordinary input produces the expected decision line", async () => {
  const result = buildBrief(await load("ordinary"));
  assert.equal(result.status, "ordinary");
  assert.equal(result.line, "09:00 Daily stand-up — decide: Bring the top blocker");
  assert.equal(result.source, "synthetic:ordinary#CAL-101");
});

test("missing input is explicit and invents nothing", async () => {
  const result = buildBrief(await load("missing"));
  assert.deepEqual(result, { status: "open", user: "Maya", line: "OPEN — no agenda item available", source: "synthetic:missing" });
});

test("conflicting input is explicit and chooses nothing", async () => {
  const result = buildBrief(await load("conflict"));
  assert.deepEqual(result, { status: "conflict", user: "Maya", line: "CONFLICT — 2 agenda items share a start time", source: "synthetic:conflict" });
});
