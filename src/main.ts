import { mkdir, readFile, writeFile } from "node:fs/promises";
import sample from "../sample/brief.sample.json" with { type: "json" };
import { renderBrief } from "./render.js";

await mkdir("out", { recursive: true });
await writeFile("out/latest.html", renderBrief(sample), "utf8");
const output = await readFile("out/latest.html", "utf8");
console.log(`Wrote out/latest.html (${output.length} bytes) from synthetic data`);
