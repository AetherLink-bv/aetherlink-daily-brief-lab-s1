import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseBrief, type DailyBrief } from "../src/brief.js";
import { VOICE_ID, buildScript, synthesizeBrief } from "../src/voice.js";

const KEY = "test-key-not-real-1234";
// A tiny fake MP3: an ID3 tag header followed by bytes. Tests never spend credits.
const MP3 = Buffer.concat([Buffer.from("ID3\x04\x00\x00\x00\x00\x00\x00", "binary"), Buffer.alloc(600, 1)]);

const sample = async (): Promise<DailyBrief> =>
  parseBrief(JSON.parse(await readFile(new URL("../sample/brief.sample.json", import.meta.url), "utf8")));

type Call = { url: string; init: RequestInit };
function mockFetch(respond: () => Response): { fetchImpl: typeof fetch; calls: Call[] } {
  const calls: Call[] = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return respond();
  }) as typeof fetch;
  return { fetchImpl, calls };
}
const audio = (body: Uint8Array = MP3, type = "audio/mpeg") => () => new Response(new Blob([body as BlobPart]), { status: 200, headers: { "content-type": type } });
const tmp = () => mkdtemp(join(tmpdir(), "bree-voice-"));

test("a missing key is rejected before any request", async () => {
  const { fetchImpl, calls } = mockFetch(audio());
  await assert.rejects(synthesizeBrief(await sample(), { outDir: await tmp(), apiKey: undefined, fetchImpl }), /ELEVENLABS_API_KEY/);
  await assert.rejects(synthesizeBrief(await sample(), { outDir: await tmp(), apiKey: "", fetchImpl }), /ELEVENLABS_API_KEY/);
  assert.equal(calls.length, 0);
});

test("a script over 2000 characters is rejected before any request", async () => {
  const brief = await sample();
  brief.summary.text = "A".repeat(2001);
  const { fetchImpl, calls } = mockFetch(audio());
  await assert.rejects(synthesizeBrief(brief, { outDir: await tmp(), apiKey: KEY, fetchImpl }), /2000/);
  assert.equal(calls.length, 0);
});

test("a mocked MP3 response is written to brief.mp3 with the right request", async () => {
  const dir = await tmp();
  const brief = await sample();
  const { fetchImpl, calls } = mockFetch(audio());
  const path = await synthesizeBrief(brief, { outDir: dir, apiKey: KEY, fetchImpl });
  assert.equal(path, join(dir, "brief.mp3"));
  assert.deepEqual(await readFile(path), MP3);
  assert.equal(calls.length, 1);
  const call = calls[0]!;
  assert.ok(call.url.startsWith(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`));
  assert.equal(VOICE_ID, "JBFqnCBsd6RMkjVDRZzb");
  assert.equal(call.init.method, "POST");
  assert.equal((call.init.headers as Record<string, string>)["xi-api-key"], KEY);
  const body = JSON.parse(call.init.body as string);
  assert.equal(body.text, buildScript(brief));
  assert.equal(typeof body.model_id, "string");
});

test("only the summary and top to-dos are sent: no source labels, no ids, no other sections", async () => {
  const brief = await sample();
  const script = buildScript(brief);
  assert.ok(script.includes(brief.summary.text));
  for (const todo of brief.topTodos) assert.ok(script.includes(todo.text));
  for (const other of [brief.moveWorkForward, ...brief.newUpdates, ...brief.yourDay]) assert.ok(!script.includes(other.text));
  for (const source of brief.sources) {
    assert.ok(!script.includes(source.label));
    assert.ok(!script.includes(source.id));
  }
});

test("OPEN and CONFLICT are spoken exactly, never softened", async () => {
  const brief = await sample();
  brief.topTodos = [
    { status: "OPEN", text: "OPEN — the owner of the follow-up is not known.", sourceIds: [] },
    { status: "CONFLICT", text: "CONFLICT — two owners are named.", sourceIds: ["jira:DEMO-102"] },
  ];
  const script = buildScript(brief);
  assert.ok(script.includes("OPEN — the owner of the follow-up is not known."));
  assert.ok(script.includes("CONFLICT — two owners are named."));
  assert.equal(buildScript(await sample()).includes("CONFLICT — two owners are named for the onboarding review."), true);
});

test("invalid audio is rejected, nothing is written, and the error leaks neither the key nor the text", async () => {
  const brief = await sample();
  const cases: Array<[string, () => Response]> = [
    ["wrong content type", audio(MP3, "text/html")],
    ["not an mp3", audio(new TextEncoder().encode("<html>not audio</html>".repeat(40)))],
    ["empty body", audio(new Uint8Array())],
    ["http 401", () => new Response("denied", { status: 401 })],
    ["http 429", () => new Response("slow down", { status: 429 })],
  ];
  for (const [label, respond] of cases) {
    const dir = await tmp();
    const { fetchImpl } = mockFetch(respond);
    const error = await synthesizeBrief(brief, { outDir: dir, apiKey: KEY, fetchImpl }).then(
      () => assert.fail(`${label} must be rejected`),
      (e: Error) => e,
    );
    assert.ok(!error.message.includes(KEY), `${label}: key leaked`);
    assert.ok(!error.message.includes(brief.summary.text), `${label}: text leaked`);
    await assert.rejects(stat(join(dir, "brief.mp3")), `${label}: no file may be written`);
  }
});

test("a failed network call is rejected without leaking the key", async () => {
  const fetchImpl = (async () => {
    throw new Error(`connect failed for ${KEY}`);
  }) as typeof fetch;
  const error = await synthesizeBrief(await sample(), { outDir: await tmp(), apiKey: KEY, fetchImpl }).then(
    () => assert.fail("must reject"),
    (e: Error) => e,
  );
  assert.ok(!error.message.includes(KEY));
});

test("out/latest.html is untouched by the voice route", async () => {
  const dir = await tmp();
  await writeFile(join(dir, "latest.html"), "<html>existing brief</html>");
  const before = createHash("sha256").update(await readFile(join(dir, "latest.html"))).digest("hex");
  await synthesizeBrief(await sample(), { outDir: dir, apiKey: KEY, fetchImpl: mockFetch(audio()).fetchImpl });
  const after = createHash("sha256").update(await readFile(join(dir, "latest.html"))).digest("hex");
  assert.equal(after, before);
});

test("an unvalidated brief is not spoken", async () => {
  await assert.rejects(synthesizeBrief({ title: "x" } as unknown as DailyBrief, { outDir: await tmp(), apiKey: KEY, fetchImpl: mockFetch(audio()).fetchImpl }));
});
