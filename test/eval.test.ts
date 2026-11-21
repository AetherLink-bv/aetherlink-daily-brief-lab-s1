import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildBrief, dailyBriefSchema } from "../src/brief.js";
import { renderDailyBrief } from "../src/render.js";

const load = async (name: string): Promise<unknown> => JSON.parse(await readFile(`sample/eval/${name}.json`, "utf8"));
const loadFullBrief = async () => dailyBriefSchema.parse(JSON.parse(await readFile("sample/brief.sample.json", "utf8")));

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

test("complete daily brief renders every section and its source references", async () => {
  const html = renderDailyBrief(await loadFullBrief());
  for (const heading of ["Today in short", "Move your work forward", "Top to-dos", "New updates", "Your day", "Sources"]) {
    assert.match(html, new RegExp(heading));
  }
  assert.match(html, /jira:DEMO-101/);
  assert.match(html, /calendar:CAL-001/);
});

test("unavailable full brief stays OPEN and invents no agenda", async () => {
  const brief = await loadFullBrief();
  const openItem = { status: "OPEN" as const, text: "OPEN — approved source unavailable.", sourceIds: [] };
  const html = renderDailyBrief(dailyBriefSchema.parse({
    ...brief,
    summary: openItem,
    moveWorkForward: openItem,
    topTodos: [openItem],
    newUpdates: [openItem],
    yourDay: [openItem],
    sources: [],
  }));
  assert.match(html, /OPEN — approved source unavailable/);
  assert.match(html, /OPEN — no verified source was available/);
  assert.doesNotMatch(html, /09:00|Daily stand-up|jira:DEMO/);
});

test("conflicting full brief preserves the conflict without forcing a resolution", async () => {
  const brief = await loadFullBrief();
  const html = renderDailyBrief(dailyBriefSchema.parse({
    ...brief,
    moveWorkForward: {
      status: "CONFLICT",
      text: "CONFLICT — Jira lists two different owners; review both before deciding.",
      sourceIds: ["jira:DEMO-102"],
    },
  }));
  assert.match(html, /CONFLICT — Jira lists two different owners/);
  assert.match(html, /jira:DEMO-102/);
  assert.doesNotMatch(html, /conflict resolved|owner selected/i);
});
