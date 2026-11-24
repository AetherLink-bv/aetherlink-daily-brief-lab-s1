import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { DailyBriefSchema, parseBrief } from "../src/brief.js";

const load = async (path: string): Promise<any> =>
  JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));

const clone = <T>(value: T): T => structuredClone(value);
const rejects = (data: unknown) => assert.equal(DailyBriefSchema.safeParse(data).success, false);

test("the full valid synthetic sample passes", async () => {
  const brief = parseBrief(await load("sample/brief.sample.json"));
  assert.equal(brief.date, "2026-11-18");
  assert.equal(brief.sources.length, 3);
});

test("the invalid synthetic sample is rejected for an unresolved source ID", async () => {
  const result = DailyBriefSchema.safeParse(await load("sample/brief.invalid.sample.json"));
  assert.equal(result.success, false);
  assert.match(JSON.stringify(result.error?.issues), /jira:DEMO-999/);
});

test("a brief without a required section is rejected", async () => {
  const brief = await load("sample/brief.sample.json");
  for (const key of Object.keys(brief)) {
    const copy = clone(brief);
    delete copy[key];
    rejects(copy);
  }
});

test("an unknown extra field is rejected", async () => {
  rejects({ ...(await load("sample/brief.sample.json")), mood: "cheerful" });
});

test("date must be YYYY-MM-DD", async () => {
  const brief = await load("sample/brief.sample.json");
  for (const date of ["18-11-2026", "2026/11/18", "2026-11-18T09:00", ""]) rejects({ ...brief, date });
});

test("the three lists must not be empty", async () => {
  const brief = await load("sample/brief.sample.json");
  for (const key of ["topTodos", "newUpdates", "yourDay"]) rejects({ ...brief, [key]: [] });
});

test("summary and moveWorkForward are single items, not arrays", async () => {
  const brief = await load("sample/brief.sample.json");
  rejects({ ...brief, summary: [brief.summary] });
  rejects({ ...brief, moveWorkForward: [brief.moveWorkForward] });
});

test("an item with an unknown status is rejected", async () => {
  const brief = await load("sample/brief.sample.json");
  rejects({ ...brief, summary: { ...brief.summary, status: "DONE" } });
});

test("READY and CONFLICT items need at least one source ID; OPEN may have none", async () => {
  const brief = await load("sample/brief.sample.json");
  rejects({ ...brief, summary: { ...brief.summary, sourceIds: [] } });
  rejects({
    ...brief,
    summary: { status: "CONFLICT", text: "CONFLICT — owners disagree.", sourceIds: [] },
  });
  assert.equal(
    DailyBriefSchema.safeParse({
      ...brief,
      summary: { status: "OPEN", text: "OPEN — no source answered.", sourceIds: [] },
    }).success,
    true,
  );
});

test("OPEN text starts with OPEN and CONFLICT text starts with CONFLICT", async () => {
  const brief = await load("sample/brief.sample.json");
  rejects({ ...brief, summary: { status: "OPEN", text: "Nothing known.", sourceIds: [] } });
  rejects({ ...brief, summary: { status: "CONFLICT", text: "Owners differ.", sourceIds: ["jira:DEMO-102"] } });
});

test("every sourceId must resolve in sources, in every section", async () => {
  const brief = await load("sample/brief.sample.json");
  const bad = clone(brief);
  bad.yourDay[0].sourceIds = ["calendar:NOPE"];
  rejects(bad);
  const bad2 = clone(brief);
  bad2.topTodos[1].sourceIds = ["jira:DEMO-102", "jira:UNKNOWN"];
  rejects(bad2);
});

test("sources entries need a non-empty id and label", async () => {
  const brief = await load("sample/brief.sample.json");
  rejects({ ...brief, sources: [{ id: "jira:DEMO-101" }] });
  rejects({ ...brief, sources: [{ id: "", label: "x" }] });
});

test("parseBrief throws on invalid input", async () => {
  assert.throws(() => parseBrief({}));
});
