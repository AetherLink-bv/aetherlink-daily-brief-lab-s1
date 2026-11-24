import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseBrief, type DailyBrief } from "./brief.js";

// Optional, synthetic-only voice route. Reads only the validated sample; sends only summary and top to-dos.
export const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
export const MODEL_ID = "eleven_multilingual_v2";
export const MAX_SCRIPT = 2000;

const root = fileURLToPath(new URL("..", import.meta.url));

// OPEN and CONFLICT texts already start with those words (schema rule); they are spoken exactly as written.
export function buildScript(brief: DailyBrief): string {
  return [brief.summary.text, ...brief.topTodos.map((item) => item.text)].join("\n");
}

function looksLikeMp3(bytes: Uint8Array): boolean {
  if (bytes.length < 128) return false;
  const id3 = bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33;
  const frame = bytes[0] === 0xff && ((bytes[1] ?? 0) & 0xe0) === 0xe0;
  return id3 || frame;
}

export interface VoiceOptions {
  outDir: string;
  apiKey: string | undefined;
  fetchImpl?: typeof fetch;
}

// Errors never contain the key, the request text or the response body.
export async function synthesizeBrief(input: DailyBrief, options: VoiceOptions): Promise<string> {
  if (!options.apiKey) throw new Error("ELEVENLABS_API_KEY is missing");
  const brief = parseBrief(input);
  const script = buildScript(brief);
  if (script.length > MAX_SCRIPT) throw new Error(`script is ${script.length} characters; the limit is ${MAX_SCRIPT}`);

  let response: Response;
  try {
    response = await (options.fetchImpl ?? fetch)(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": options.apiKey, "content-type": "application/json", accept: "audio/mpeg" },
        body: JSON.stringify({ text: script, model_id: MODEL_ID }),
      },
    );
  } catch {
    throw new Error("the text-to-speech request failed before a response arrived");
  }
  if (!response.ok) throw new Error(`the text-to-speech request failed with HTTP ${response.status}`);
  if (!(response.headers.get("content-type") ?? "").startsWith("audio/")) throw new Error("the response is not audio");
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!looksLikeMp3(bytes)) throw new Error("the response is not a valid MP3");

  await mkdir(options.outDir, { recursive: true });
  const path = join(options.outDir, "brief.mp3");
  await writeFile(path, bytes);
  return path;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.loadEnvFile(join(root, ".env.local")); // the key stays in the ignored local file
  } catch {
    // no .env.local: synthesizeBrief reports the missing key
  }
  const brief = parseBrief(JSON.parse(await readFile(join(root, "sample/brief.sample.json"), "utf8")));
  try {
    const path = await synthesizeBrief(brief, { outDir: join(root, "out"), apiKey: process.env.ELEVENLABS_API_KEY });
    console.log(`wrote ${path} (synthetic input: sample/brief.sample.json)`);
  } catch (error) {
    console.error(`OPEN — no audio written: ${error instanceof Error ? error.message : "unknown error"}`);
    process.exitCode = 1;
  }
}
