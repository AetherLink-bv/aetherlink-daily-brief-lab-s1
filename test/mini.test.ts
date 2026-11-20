import assert from "node:assert/strict";
import test from "node:test";
import { mini } from "../src/mini.js";

test("one agenda item becomes one decision line", async () => {
  assert.equal(await mini("sample/calendar-item.sample.json"), "09:00 Daily stand-up — decide: Bring the top blocker");
});
