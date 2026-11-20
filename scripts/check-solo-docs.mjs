import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const paths = [
  "SOLO.md",
  "docs/prompts.md",
  "README.md",
  "package.json",
  "intent.md",
  "progress.md",
  "docs/gate.md",
  "course/modules/01-what-this-lab-builds.html",
  "course/modules/05-evidence-and-gate.html",
  "course/modules/06-solo-loop.html",
  "course/index.html",
];
const files = Object.fromEntries(await Promise.all(paths.map(async (path) => [path, await readFile(path, "utf8")])));
const prompts = (text) => [...text.matchAll(/^> (.+)$/gm)].map((match) => match[1]);
const assignments = (text) => [...text.matchAll(/^## Assignment ([1-7]) · /gm)].map((match) => Number(match[1]));

assert.deepEqual(prompts(files["docs/prompts.md"]), prompts(files["SOLO.md"]));
assert.equal(prompts(files["SOLO.md"]).length, 6, "A1-A6 have one prompt; A7 is participant-designed");
assert.deepEqual(assignments(files["SOLO.md"]), [1, 2, 3, 4, 5, 6, 7]);

for (const [path, text] of Object.entries(files)) {
  assert.doesNotMatch(text, /pull request|\bPR\b|GitHub Actions|Continuous Integration/i, `${path} must stay local`);
  assert.doesNotMatch(text, /git switch|git checkout step-/i, path);
}

assert.match(files["README.md"], /npm ci\nclaude --setting-sources project,user --strict-mcp-config --no-chrome/);
assert.match(files["README.md"], /Eén lokaal agenda-item wordt eerst één beslisregel/);
assert.match(files["SOLO.md"], /npm run mini/);
assert.match(files["SOLO.md"], /npm run test:schema/);
assert.match(files["SOLO.md"], /npm run brief:sample/);
assert.match(files["SOLO.md"], /npm run test:tool/);
assert.match(files["SOLO.md"], /npm run eval/);
assert.match(files["SOLO.md"], /ordinary\.json.*missing\.json.*conflict\.json/s);
assert.match(files["SOLO.md"], /git worktree add --detach \.\.\/daily-brief-previous HEAD\^/);
assert.match(files["SOLO.md"], /git worktree add --detach \.\.\/daily-brief-current HEAD/);
assert.match(files["SOLO.md"], /No prescribed implementation prompt/);
assert.match(files["intent.md"], /User and decision/);
assert.match(files["progress.md"], /ordinary, missing, conflict/);
assert.match(files["docs/gate.md"], /Local delivery gate/);

const scripts = JSON.parse(files["package.json"]).scripts;
assert.equal(scripts.mini, "tsx src/mini.ts sample/calendar-item.sample.json");
assert.equal(scripts["test:mini"], "tsx --test test/mini.test.ts");
assert.equal(scripts["test:schema"], "tsx --test test/schema.test.ts");
assert.equal(scripts["test:tool"], "tsx --test test/tool.test.ts");
assert.equal(scripts.eval, "tsx --test test/eval.test.ts");

await Promise.all([
  access("sample/calendar-item.sample.json"),
  access("sample/eval/ordinary.json"),
  access("sample/eval/missing.json"),
  access("sample/eval/conflict.json"),
  access("reference/The_Tuesday_Brief_-_September_1.pdf"),
  access("reference/The_Wednesday_Brief_-_August_26.pdf"),
]);

await access(".github/workflows/verify.yml");

const skillPrompts = [
  "/grilling Challenge whether my chosen user, decision, and boundary are observable. Ask one question at a time. Do not edit files.",
  "/eli5 Explain my brief schema and its red-then-green test. Name what each field protects. Do not edit files.",
  "/visual-plan Turn my accepted docs/plan.md into one local HTML page. Do not change the plan.",
  "/verify-this Prove that npm run brief:sample writes out/latest.html from local sample data. Show the exit code and output path.",
  "/show-me Draw the path from sample/calendar-item.sample.json through the one read-only tool to the brief. Only read files.",
  "/verify-this Run npm run eval and compare ordinary, missing, and conflict with docs/spec.md. Mark every mismatch OPEN.",
  "/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the files, decisions, and next proof.",
];
for (const path of ["SOLO.md", "docs/prompts.md"]) {
  const lines = new Set(files[path].split("\n"));
  for (const prompt of skillPrompts) assert.ok(lines.has(prompt), `${path} is missing skill prompt: ${prompt}`);
}
await Promise.all(skillPrompts.map((prompt) => access(join(".claude/skills", prompt.split(" ")[0].slice(1), "SKILL.md"))));

console.log("PASS 7 local assignments align: 6 exact prompts, 1 participant-designed challenge, no participant publication route");
