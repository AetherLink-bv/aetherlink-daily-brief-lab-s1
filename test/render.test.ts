import assert from "node:assert/strict";
import test from "node:test";
import { renderBrief } from "../src/render.js";

test("renders the visible result and escapes text", () => {
  const html = renderBrief({ status: "ordinary", user: "<Maya>", line: "09:00 Stand-up — decide: Bring blocker" });
  assert.match(html, /&lt;Maya&gt;/);
  assert.match(html, /Bring blocker/);
  assert.doesNotMatch(html, /<Maya>/);
});
