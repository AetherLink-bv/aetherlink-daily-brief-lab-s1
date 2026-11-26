import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, rmdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
process.chdir(root);
const evidence = process.argv[2] ? resolve(process.argv[2]) : join(mkdtempSync(join(tmpdir(), "bree-")), "evidence.txt");
const hadOut = existsSync("out");
const previousPage = existsSync("out/latest.html") ? readFileSync("out/latest.html") : undefined;
let passed = true;

function record(text) {
  appendFileSync(evidence, text + "\n");
}

function run(label, program, args, allowed = [0]) {
  const result = spawnSync(program, args, { encoding: "utf8" });
  record(`$ ${label}\n${result.stdout ?? ""}${result.stderr ?? ""}exit=${result.status ?? "unavailable"}`);
  if (!allowed.includes(result.status)) {
    console.error(`FAILED: ${label}`);
    passed = false;
  }
}

function npm(...args) {
  const script = process.env.npm_execpath;
  if (!script) throw new Error("Start the journey with npm run verify:journey.");
  run(`npm ${args.join(" ")}`, process.execPath, [script, ...args], args.includes("live:check") ? [0, 3] : [0]);
}

record("## Launch");
if (!existsSync("node_modules")) npm("ci");
record("## Doctor");
run("node --version", process.execPath, ["--version"]);
run("git rev-parse --short HEAD", "git", ["rev-parse", "--short", "HEAD"]);
run("git status --short", "git", ["status", "--short"]);
run("git check-ignore -v out/latest.html", "git", ["check-ignore", "-v", "out/latest.html"]);
record(existsSync(".bree.local.json") ? "local config present" : "local config absent");

try {
  record("## Drive");
  npm("run", "brief:sample");
  const html = readFileSync("out/latest.html", "utf8");
  for (const title of ["Summary", "Push your work forward", "Top to-dos", "New updates", "Your day", "Sources"]) {
    if (!html.includes(`>${title}</h2>`)) throw new Error(`Section missing: ${title}`);
    record(`section present: ${title}`);
  }
  for (const script of ["test:render", "test:schema", "eval", "test:live", "live:check"]) npm("run", script);
} catch (error) {
  record(error.message);
  passed = false;
} finally {
  record("## Cleanup");
  if (previousPage) writeFileSync("out/latest.html", previousPage);
  else rmSync("out/latest.html", { force: true });
  if (!hadOut && existsSync("out") && readdirSync("out").length === 0) rmdirSync("out");
}

console.log(`evidence file: ${evidence}`);
passed = passed && statSync(evidence).size > 0;
const verdict = `journey result: ${passed ? "PASS" : "FAIL"}`;
record(verdict);
console.log(verdict);
process.exitCode = passed ? 0 : 1;
