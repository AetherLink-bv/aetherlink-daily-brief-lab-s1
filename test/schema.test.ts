import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { agendaSchema } from "../src/brief.js";

test("accepts the complete sample", async () => {
  assert.equal(agendaSchema.parse(JSON.parse(await readFile("sample/brief.sample.json", "utf8"))).items.length, 1);
});

test("rejects an item without start", async () => {
  const result = agendaSchema.safeParse(JSON.parse(await readFile("sample/calendar-item.invalid.json", "utf8")));
  assert.equal(result.success, false);
  if (!result.success) assert.equal(result.error.issues[0]?.path.join("."), "items.0.start");
});
