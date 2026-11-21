import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { dailyBriefSchema } from "../src/brief.js";
import { buildVoiceScript, synthesizeVoice, writeVoiceBrief } from "../src/voice.js";

const sample = dailyBriefSchema.parse(JSON.parse(await readFile("sample/brief.sample.json", "utf8")));

test("builds a short script from the summary and top todos", () => {
  const script = buildVoiceScript({
    ...sample,
    topTodos: [
      { status: "OPEN", text: "OPEN — owner is not confirmed.", sourceIds: [] },
      sample.topTodos[1],
    ],
  });

  assert.match(script, /Your 09:00 stand-up/);
  assert.match(script, /OPEN — owner is not confirmed/);
  assert.match(script, /CONFLICT — two owners are named/);
  assert.doesNotMatch(script, /Synthetic Jira|email updates|checkout issue received/);
});

test("rejects a missing key before fetch", async () => {
  let calls = 0;
  const request: typeof fetch = async () => {
    calls += 1;
    return new Response();
  };

  await assert.rejects(synthesizeVoice(sample, "", request), /ELEVENLABS_API_KEY is missing/);
  assert.equal(calls, 0);
});

test("rejects a long script before fetch", async () => {
  let calls = 0;
  const request: typeof fetch = async () => {
    calls += 1;
    return new Response();
  };

  await assert.rejects(
    synthesizeVoice({ ...sample, summary: { ...sample.summary, text: "x".repeat(2_000) } }, "test-key", request),
    /2000 character workshop limit/,
  );
  assert.equal(calls, 0);
});

test("writes a mocked MP3 without changing the HTML artifact", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "bree-voice-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const htmlPath = join(directory, "latest.html");
  const audioPath = join(directory, "brief.mp3");
  await writeFile(htmlPath, "accepted HTML");
  const mp3 = Uint8Array.from([0x49, 0x44, 0x33, 0x04]);

  const request: typeof fetch = async (input, init) => {
    assert.match(String(input), /text-to-speech\/JBFqnCBsd6RMkjVDRZzb/);
    assert.equal(new Headers(init?.headers).get("xi-api-key"), "test-key");
    assert.match(String(init?.body), /CONFLICT/);
    return new Response(mp3, { status: 200, headers: { "content-type": "audio/mpeg" } });
  };

  await writeVoiceBrief(sample, audioPath, "test-key", request);
  assert.deepEqual(new Uint8Array(await readFile(audioPath)), mp3);
  assert.equal(await readFile(htmlPath, "utf8"), "accepted HTML");
});

test("rejects a non-MP3 response without exposing the key", async () => {
  const request: typeof fetch = async () => new Response("not audio", {
    status: 200,
    headers: { "content-type": "audio/mpeg" },
  });

  await assert.rejects(
    synthesizeVoice(sample, "secret-test-key", request),
    (error: Error) => error.message === "ElevenLabs returned invalid MP3 data." && !error.message.includes("secret-test-key"),
  );
});

test("rejects a rate-limit response without exposing details or writing a file", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "bree-voice-429-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const audioPath = join(directory, "brief.mp3");
  const request: typeof fetch = async () => new Response("private response body", {
    status: 429,
    headers: { "content-type": "application/json" },
  });

  await assert.rejects(
    writeVoiceBrief(sample, audioPath, "secret-test-key", request),
    (error: Error) => error.message === "ElevenLabs request failed with status 429."
      && !error.message.includes("secret-test-key")
      && !error.message.includes("private response body"),
  );
  await assert.rejects(readFile(audioPath), { code: "ENOENT" });
});

test("rejects an HTML success response without exposing details or writing a file", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "bree-voice-html-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const audioPath = join(directory, "brief.mp3");
  const request: typeof fetch = async () => new Response("private HTML response", {
    status: 200,
    headers: { "content-type": "text/html" },
  });

  await assert.rejects(
    writeVoiceBrief(sample, audioPath, "secret-test-key", request),
    (error: Error) => error.message === "ElevenLabs returned a non-audio response."
      && !error.message.includes("secret-test-key")
      && !error.message.includes("private HTML response"),
  );
  await assert.rejects(readFile(audioPath), { code: "ENOENT" });
});
