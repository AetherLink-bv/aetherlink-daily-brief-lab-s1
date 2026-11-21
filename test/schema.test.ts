import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { agendaSchema, dailyBriefSchema } from "../src/brief.js";

test("accepts the complete sample", async () => {
  assert.equal(agendaSchema.parse(JSON.parse(await readFile("sample/calendar-item.sample.json", "utf8"))).items.length, 1);
});

test("rejects an item without start", async () => {
  const result = agendaSchema.safeParse(JSON.parse(await readFile("sample/calendar-item.invalid.json", "utf8")));
  assert.equal(result.success, false);
  if (!result.success) assert.equal(result.error.issues[0]?.path.join("."), "items.0.start");
});

test("accepts the full daily brief fixture", async () => {
  const brief = dailyBriefSchema.parse(JSON.parse(await readFile("sample/brief.sample.json", "utf8")));
  assert.equal(brief.topTodos.length, 2);
  assert.equal(brief.newUpdates[1]?.status, "OPEN");
  assert.equal(brief.topTodos[1]?.status, "CONFLICT");
});

test("rejects impossible dates and unknown source IDs", async () => {
  const brief = JSON.parse(await readFile("sample/brief.sample.json", "utf8"));
  assert.equal(dailyBriefSchema.safeParse({ ...brief, date: "2026-99-99" }).success, false);
  assert.equal(dailyBriefSchema.safeParse({
    ...brief,
    summary: { ...brief.summary, sourceIds: ["jira:MISSING"] },
  }).success, false);
});

test("rejects duplicate source IDs", async () => {
  const brief = JSON.parse(await readFile("sample/brief.sample.json", "utf8"));
  assert.equal(dailyBriefSchema.safeParse({
    ...brief,
    sources: [...brief.sources, { id: brief.sources[0].id, label: "Conflicting label" }],
  }).success, false);
});
