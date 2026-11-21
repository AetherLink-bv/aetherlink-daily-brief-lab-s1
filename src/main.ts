import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dailyBriefSchema } from "./brief.js";
import { renderDailyBrief } from "./render.js";

const path = "sample/brief.sample.json";
const input: unknown = JSON.parse(await readFile(path, "utf8"));
const html = renderDailyBrief(dailyBriefSchema.parse(input));
await mkdir("out", { recursive: true });
await writeFile("out/latest.html", html);
console.log("WROTE out/latest.html");
