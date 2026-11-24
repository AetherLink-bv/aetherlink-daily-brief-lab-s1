import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseBrief } from "./brief.js";
import { renderBrief } from "./render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const SAMPLE = "sample/brief.sample.json";

// Sample-only entry: synthetic JSON -> schema -> renderer -> file. No model, no connector.
export async function writeSampleBrief(outDir = join(root, "out")): Promise<string> {
  const brief = parseBrief(JSON.parse(await readFile(join(root, SAMPLE), "utf8")));
  await mkdir(outDir, { recursive: true });
  const path = join(outDir, "latest.html");
  await writeFile(path, renderBrief(brief), "utf8");
  return path;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv.includes("--sample")) {
    console.error("usage: tsx src/main.ts --sample   (this entry is synthetic-only)");
    process.exit(2);
  }
  const path = await writeSampleBrief();
  console.log(`wrote ${path}`);
  console.log(`source: ${SAMPLE} (synthetic)`);
}
