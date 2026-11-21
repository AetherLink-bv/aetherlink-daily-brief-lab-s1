import assert from "node:assert/strict";
import { test } from "node:test";
import sample from "../sample/brief.sample.json" with { type: "json" };
import { renderBrief } from "../src/render.js";

test("renders every brief section and provenance", () => {
  const html = renderBrief(sample);
  for (const heading of ["Summary", "Push your work forward", "Top to-dos", "New updates", "Your day", "Sources"]) assert.match(html, new RegExp(heading));
  assert.match(html, /Synthetic Jira issue: Checkout blocker/);
  assert.match(html, /class="status open"[^>]*>OPEN/);
});

test("escapes untrusted text and source labels", () => {
  const unsafe = structuredClone(sample);
  unsafe.summary.text = "<script>alert(1)</script>";
  unsafe.sources[0]!.label = "<img src=x onerror=alert(1)>";
  const html = renderBrief(unsafe);
  assert.doesNotMatch(html, /<script>|<img src=x/);
  assert.match(html, /&lt;script&gt;/);
});
