import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dailyBriefSchema } from "../src/brief.js";
import { renderBrief, renderDailyBrief } from "../src/render.js";

test("renders the visible result and escapes text", () => {
  const html = renderBrief({ status: "ordinary", user: "<Maya>", line: "09:00 Stand-up — decide: Bring blocker", source: "synthetic:<calendar>" });
  assert.match(html, /&lt;Maya&gt;/);
  assert.match(html, /Bring blocker/);
  assert.match(html, /Source: synthetic:&lt;calendar&gt;/);
  assert.doesNotMatch(html, /<Maya>/);
});

test("renders the complete editorial brief with OPEN, CONFLICT and escaped sources", () => {
  const input = dailyBriefSchema.parse(JSON.parse(readFileSync("sample/brief.sample.json", "utf8")));
  const html = renderDailyBrief({
    ...input,
    greeting: "Good morning, <Maya>.",
    sources: input.sources.map((source, index) => index === 0 ? { ...source, label: "Synthetic <Jira> issue" } : source),
  });
  for (const heading of ["Move your work forward", "Top to-dos", "New updates", "Your day", "Sources"]) {
    assert.match(html, new RegExp(heading));
  }
  assert.match(html, /OPEN — email updates are not connected/);
  assert.match(html, /CONFLICT — two owners are named/);
  assert.match(html, /jira:DEMO-101/);
  assert.match(html, /Good morning, &lt;Maya&gt;/);
  assert.match(html, /Synthetic &lt;Jira&gt; issue/);
  assert.doesNotMatch(html, /<Maya>/);
});

test("renders the fixed public illustration without leaking a referrer or relying on the image", () => {
  const input = dailyBriefSchema.parse(JSON.parse(readFileSync("sample/brief.sample.json", "utf8")));
  const html = renderDailyBrief(input);

  assert.match(html, /https:\/\/picsum\.photos\/seed\/bree-morning\/1200\/400/);
  assert.match(html, /alt=""/);
  assert.match(html, /referrerpolicy="no-referrer"/);
  assert.match(html, /Morning focus\. Your complete brief remains below\./);
  assert.doesNotMatch(html, /onerror=/);
  assert.doesNotMatch(html, /picsum[^"']*(?:DEMO|Maya|2026-)/i);
});

test("keeps unavailable sections OPEN when no source is available", () => {
  const openItem = { status: "OPEN" as const, text: "OPEN — approved source unavailable.", sourceIds: [] };
  const html = renderDailyBrief(dailyBriefSchema.parse({
    title: "The Friday Brief",
    date: "2026-11-20",
    greeting: "Good morning, Maya.",
    summary: openItem,
    moveWorkForward: openItem,
    topTodos: [openItem],
    newUpdates: [openItem],
    yourDay: [openItem],
    sources: [],
  }));
  assert.match(html, /OPEN — approved source unavailable/);
  assert.match(html, /OPEN — no verified source was available/);
  assert.doesNotMatch(html, /09:00|stand-up|Jira issue/);
});
