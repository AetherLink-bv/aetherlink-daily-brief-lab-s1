import assert from "node:assert/strict";
import { test } from "node:test";
import fixture from "../sample/calendar-item.sample.json" with { type: "json" };
import { decisionLine } from "../src/mini.js";

test("prints one traceable decision line", () => {
  assert.equal(decisionLine(fixture.items[0]!), "09:00 Daily stand-up — decide: Choose which blocker to bring to the 09:00 stand-up");
});
