import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const entries = await readdir("test", { withFileTypes: true });
const tests = entries
  .filter(entry => entry.isFile() && entry.name.endsWith(".test.ts"))
  .map(entry => join("test", entry.name))
  .sort();

if (tests.length === 0) throw new Error("No test/*.test.ts files found.");
const run = spawnSync(process.execPath, ["--import", "tsx", "--test", "--test-concurrency=2", ...tests], {
  stdio: "inherit"
});
if (run.error) throw run.error;
process.exitCode = run.status ?? 1;
