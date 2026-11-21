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

test("renders the fixed decorative illustration with a visible fallback", () => {
  const html = renderBrief(sample);
  assert.match(html, /src="https:\/\/picsum\.photos\/seed\/bree-morning\/1200\/400"/);
  assert.match(html, /alt=""/);
  assert.match(html, /referrerpolicy="no-referrer"/);
  assert.match(html, /onerror="this\.hidden=true"/);
  assert.match(html, /The brief remains available if the illustration cannot load\./);
});

test("escapes untrusted text and source labels", () => {
  const unsafe = structuredClone(sample);
  unsafe.summary.text = "<script>alert(1)</script>";
  unsafe.sources[0]!.label = "<img src=x onerror=alert(1)>";
  const html = renderBrief(unsafe);
  assert.doesNotMatch(html, /<script>|<img src=x/);
  assert.match(html, /&lt;script&gt;/);
});
