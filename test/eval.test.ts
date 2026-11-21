import assert from "node:assert/strict";
import { test } from "node:test";
import sample from "../sample/brief.sample.json" with { type: "json" };
import conflict from "../sample/eval/conflict.json" with { type: "json" };
import missing from "../sample/eval/missing.json" with { type: "json" };
import ordinary from "../sample/eval/ordinary.json" with { type: "json" };
import { parseDailyBrief } from "../src/brief.js";
import { renderBrief } from "../src/render.js";

test("ordinary evidence produces a complete sourced brief", () => {
  assert.equal(ordinary.items.length, 1);
  const brief = parseDailyBrief(sample);
  assert.match(renderBrief(brief), /READY/);
});

test("missing evidence remains visibly OPEN", () => {
  assert.equal(missing.items.length, 0);
  const html = renderBrief(sample);
  assert.match(html, /OPEN — email updates are not connected/);
});

test("conflicting evidence remains visibly CONFLICT", () => {
  assert.equal(conflict.items.length, 2);
  const html = renderBrief(sample);
  assert.match(html, /CONFLICT — two owners are named/);
});
