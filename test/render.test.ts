import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseBrief, type DailyBrief } from "../src/brief.js";
import { writeSampleBrief } from "../src/main.js";
import { renderBrief } from "../src/render.js";

const sample = async (): Promise<DailyBrief> =>
  parseBrief(JSON.parse(await readFile(new URL("../sample/brief.sample.json", import.meta.url), "utf8")));

test("renders every section of the complete DailyBrief", async () => {
  const brief = await sample();
  const html = renderBrief(brief);
  for (const heading of ["Summary", "Push your work forward", "Top to-dos", "New updates", "Your day", "Sources"]) {
    assert.ok(html.includes(`>${heading}</h2>`), `missing section heading ${heading}`);
  }
  assert.ok(html.includes("<h1>The Wednesday Brief</h1>"));
  assert.ok(html.includes("2026-11-18"));
  assert.ok(html.includes("Good morning, Maya."));
  const items = [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay];
  for (const item of items) assert.ok(html.includes(item.text), `missing item text: ${item.text}`);
});

test("shows provenance: every source label and id, and the sources each item cites", async () => {
  const brief = await sample();
  const html = renderBrief(brief);
  for (const source of brief.sources) {
    assert.ok(html.includes(source.label), `missing label ${source.label}`);
    assert.ok(html.includes(source.id), `missing id ${source.id}`);
  }
  assert.ok(html.includes("Synthetic Jira issue: Checkout blocker"));
});

test("shows READY, CONFLICT and OPEN states visibly", async () => {
  const html = renderBrief(await sample());
  assert.match(html, /<li class="item" data-status="READY"/);
  assert.match(html, /<li class="item" data-status="CONFLICT"/);
  assert.match(html, /<li class="item" data-status="OPEN"/);
  assert.match(html, /<span class="status">OPEN<\/span>/);
  assert.ok(html.includes("OPEN — email updates are not connected in this workshop."));
});

test("escapes untrusted text and source labels", async () => {
  const brief = await sample();
  const evil = `<script>alert("x")</script> & "q" 'a'`;
  brief.summary.text = evil;
  brief.sources[0]!.label = `<img src=x onerror=alert(1)>`;
  brief.title = `<b>title</b>`;
  const html = renderBrief(brief);
  assert.ok(!html.includes("<script>alert"));
  assert.ok(!html.includes("<img src=x"));
  assert.ok(!html.includes("<b>title</b>"));
  assert.ok(html.includes("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &quot;q&quot; &#39;a&#39;"));
});

test("long unbroken text cannot overflow the page", async () => {
  const brief = await sample();
  brief.topTodos[0]!.text = "A".repeat(5000);
  const html = renderBrief(brief);
  assert.ok(html.includes("A".repeat(5000)));
  assert.match(html, /overflow-wrap:\s*anywhere/);
});

test("has the fixed public illustration with an empty alt, no referrer and visible fallback text", async () => {
  const html = renderBrief(await sample());
  assert.ok(html.includes('src="https://picsum.photos/seed/bree-morning/1200/400"'));
  assert.ok(html.includes('alt=""'));
  assert.ok(html.includes('referrerpolicy="no-referrer"'));
  assert.match(html, /<figcaption>[^<]*Decorative photo[^<]*<\/figcaption>/);
  assert.equal(html.match(/https:\/\/picsum\.photos/g)?.length, 1);
});

test("the illustration URL carries no work data and the page runs no script", async () => {
  const html = renderBrief(await sample());
  assert.ok(!/picsum\.photos[^"']*\?/.test(html));
  assert.ok(!/<script/i.test(html));
});

test("invented facts: only brief text, labels and ids appear in the body", async () => {
  const brief = await sample();
  brief.sources = [{ id: "S-1", label: "Only label" }];
  for (const item of [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay]) {
    item.sourceIds = item.status === "OPEN" ? [] : ["S-1"];
  }
  const html = renderBrief(brief);
  assert.ok(!html.includes("DEMO-"));
  assert.ok(!html.includes("CAL-001"));
});

test("house style: a tally line under the greeting counts items by state", async () => {
  const brief = await sample();
  const html = renderBrief(brief);
  assert.match(html, /<p class="greeting">Good morning, Maya\.<\/p>\s*<p class="tally">5 READY · 1 OPEN · 1 CONFLICT<\/p>/);
  brief.newUpdates[1] = { status: "READY", text: "A sourced update.", sourceIds: ["jira:DEMO-101"] };
  brief.topTodos[1] = { status: "READY", text: "A sourced todo.", sourceIds: ["jira:DEMO-101"] };
  assert.ok(renderBrief(brief).includes('<p class="tally">7 READY · 0 OPEN · 0 CONFLICT</p>'));
});

test("an unvalidated brief is not rendered", () => {
  assert.throws(() => renderBrief({} as unknown as DailyBrief));
});

test("writeSampleBrief writes out/latest.html from the synthetic sample", async () => {
  const dir = await mkdtemp(join(tmpdir(), "bree-"));
  const path = await writeSampleBrief(dir);
  assert.equal(path, join(dir, "latest.html"));
  const html = await readFile(path, "utf8");
  assert.ok(html.includes("Synthetic calendar event: Daily stand-up"));
});
