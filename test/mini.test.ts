import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { miniLine } from "../src/mini.js";

const EXPECTED = "09:00 Daily stand-up — decide: Bring the top blocker";

test("miniLine formats <start> <title> — decide: <decision>", () => {
  const line = miniLine({
    user: "Maya",
    items: [{ id: "CAL-001", start: "09:00", title: "Daily stand-up", decision: "Bring the top blocker" }],
  });
  assert.equal(line, EXPECTED);
});

test("the accepted synthetic fixture produces the exact line", async () => {
  const data = JSON.parse(await readFile(new URL("../sample/calendar-item.sample.json", import.meta.url), "utf8"));
  assert.equal(miniLine(data), EXPECTED);
});

test("an empty item list is OPEN and invents no line", () => {
  assert.equal(miniLine({ user: "Maya", items: [] }), "OPEN — no calendar item in the fixture");
});
