import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnvFile } from "node:process";
import { dailyBriefSchema, type DailyBrief } from "./brief.js";

const voiceUrl = "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb?output_format=mp3_44100_128";

export function buildVoiceScript(input: unknown): string {
  const brief = dailyBriefSchema.parse(input);
  return ["Here is your daily brief.", `Summary. ${brief.summary.text}`, "Top priorities.", ...brief.topTodos.map((item) => item.text)].join(" ");
}

function isMp3(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && (
    (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33)
    || (bytes[0] === 0xff && ((bytes[1] ?? 0) & 0xe0) === 0xe0)
  );
}

export async function synthesizeVoice(
  input: unknown,
  apiKey: string | undefined,
  request: typeof fetch = fetch,
): Promise<Uint8Array> {
  const brief: DailyBrief = dailyBriefSchema.parse(input);
  if (!apiKey?.trim()) throw new Error("ELEVENLABS_API_KEY is missing.");
  const script = buildVoiceScript(brief);
  if (script.length > 2_000) throw new Error("Voice script exceeds the 2000 character workshop limit.");

  let response: Response;
  try {
    response = await request(voiceUrl, {
      method: "POST",
      headers: {
        accept: "audio/mpeg",
        "content-type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({ text: script, model_id: "eleven_multilingual_v2" }),
    });
  } catch {
    throw new Error("ElevenLabs request failed.");
  }

  if (!response.ok) throw new Error(`ElevenLabs request failed with status ${response.status}.`);
  if (!response.headers.get("content-type")?.toLowerCase().startsWith("audio/")) {
    throw new Error("ElevenLabs returned a non-audio response.");
  }

  const audio = new Uint8Array(await response.arrayBuffer());
  if (!isMp3(audio)) throw new Error("ElevenLabs returned invalid MP3 data.");
  return audio;
}

export async function writeVoiceBrief(
  input: unknown,
  outputPath: string,
  apiKey: string | undefined,
  request: typeof fetch = fetch,
): Promise<void> {
  const audio = await synthesizeVoice(input, apiKey, request);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, audio);
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  try {
    try {
      loadEnvFile(".env.local");
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
    const input: unknown = JSON.parse(await readFile("sample/brief.sample.json", "utf8"));
    await writeVoiceBrief(input, "out/brief.mp3", process.env.ELEVENLABS_API_KEY);
    console.log("WROTE out/brief.mp3");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Voice generation failed.");
    process.exitCode = 1;
  }
}
