import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { parseBrief, type DailyBrief, type Item } from "../src/brief.js";
import { renderBrief } from "../src/render.js";

const raw = async (name: string): Promise<unknown> =>
  JSON.parse(await readFile(new URL(`../sample/eval/${name}`, import.meta.url), "utf8"));

// Every case goes through the real schema and the real renderer.
async function load(name: string): Promise<{ brief: DailyBrief; html: string; items: Item[] }> {
  const brief = parseBrief(await raw(name));
  const items = [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay];
  return { brief, html: renderBrief(brief), items };
}

test("eval 1, complete brief: every section is READY, sourced and rendered", async () => {
  const { brief, html, items } = await load("ordinary-brief.json");
  assert.ok(items.every((item) => item.status === "READY"));
  assert.ok(items.every((item) => item.sourceIds.length > 0));
  for (const heading of ["Summary", "Push your work forward", "Top to-dos", "New updates", "Your day", "Sources"]) {
    assert.ok(html.includes(`>${heading}</h2>`), `missing ${heading}`);
  }
  for (const source of brief.sources) assert.ok(html.includes(source.label));
  assert.ok(html.includes(`<p class="tally">${items.length} READY · 0 OPEN · 0 CONFLICT</p>`));
  assert.ok(!html.includes('<li class="item" data-status="OPEN"') && !html.includes('<li class="item" data-status="CONFLICT"'));
});

test("eval 2, missing evidence: affected items are OPEN, unsourced, and claim no agenda", async () => {
  const { html, items, brief } = await load("missing-brief.json");
  const open = items.filter((item) => item.status === "OPEN");
  assert.ok(open.length >= 1, "at least one OPEN item");
  for (const item of open) {
    assert.ok(item.text.startsWith("OPEN"));
    assert.deepEqual(item.sourceIds, []);
  }
  assert.ok(brief.yourDay.every((item) => item.status === "OPEN"), "no calendar source, so no agenda");
  assert.ok(html.includes('<li class="item" data-status="OPEN"'));
  assert.ok(html.includes("Source: No source"));
  assert.ok(!/\b\d{2}:\d{2}\b/.test(html), "no time of day is invented");
  assert.ok(!html.includes("calendar:"), "no calendar source is invented");
  assert.ok(html.includes(`<p class="tally">${items.length - open.length} READY · ${open.length} OPEN · 0 CONFLICT</p>`));
});

test("eval 3, conflicting evidence: affected items are CONFLICT, cite both sides, and choose nothing", async () => {
  const { html, items, brief } = await load("conflict-brief.json");
  const conflict = items.filter((item) => item.status === "CONFLICT");
  assert.ok(conflict.length >= 1, "at least one CONFLICT item");
  for (const item of conflict) {
    assert.ok(item.text.startsWith("CONFLICT"));
    assert.ok(new Set(item.sourceIds).size >= 2, "a conflict cites at least two sources");
  }
  assert.equal(brief.summary.status, "CONFLICT");
  assert.equal(brief.moveWorkForward.status, "CONFLICT", "the brief must not pick a winner for the action");
  assert.ok(html.includes("Onboarding review owner A") && html.includes("Onboarding review owner B"));
  assert.ok(html.includes('<li class="item" data-status="CONFLICT"'));
  assert.match(html, /<p class="tally">\d+ READY · 0 OPEN · [1-9]\d* CONFLICT<\/p>/);
});

test("the legacy mini fixtures are not briefs and are rejected by the schema", async () => {
  for (const name of ["ordinary.json", "missing.json", "conflict.json"]) {
    const data = await raw(name);
    assert.throws(() => parseBrief(data));
  }
});
