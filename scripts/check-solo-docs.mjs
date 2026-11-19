import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const paths = [
  "SOLO.md",
  "docs/prompts.md",
  "README.md",
  "course/modules/01-what-this-lab-builds.html",
  "course/modules/06-solo-loop.html",
  "course/index.html",
];
const files = Object.fromEntries(await Promise.all(paths.map(async (path) => [path, await readFile(path, "utf8")])));
const prompts = (text) => [...text.matchAll(/^> (.+)$/gm)].map((match) => match[1]);

assert.deepEqual(prompts(files["docs/prompts.md"]), prompts(files["SOLO.md"]));
assert.equal(prompts(files["SOLO.md"]).length, 7);

for (const [path, text] of Object.entries(files)) {
  assert.doesNotMatch(text, /git checkout step-/i, path);
  assert.doesNotMatch(text, /git switch/i, path);
}

assert.match(files["README.md"], /npm ci\nclaude --setting-sources project,user --strict-mcp-config --no-chrome/);
assert.match(files["SOLO.md"], /git push origin "HEAD:refs\/heads\/\$BRANCH"/);
assert.match(files["SOLO.md"], /gh repo fork AetherLink-bv\/aetherlink-daily-brief-lab-s1 --remote --remote-name fork --clone=false/);
assert.match(files["SOLO.md"], /gh pr create --repo AetherLink-bv\/aetherlink-daily-brief-lab-s1 --base main --head "\$OWNER:\$BRANCH"/);
assert.match(files["SOLO.md"], /After the human gate approves publication, commit the accepted Assignment 7 files/);

assert.match(files["SOLO.md"], /Connect src\/main\.ts to the agent for the live brief command\. Preserve brief:sample without model calls/);
assert.match(files["SOLO.md"], /Without credentials, run the sample and mark the live check OPEN/);
assert.match(files["README.md"], /The_Tuesday_Brief_-_September_1\.pdf/);
assert.match(files["README.md"], /The_Wednesday_Brief_-_August_26\.pdf/);
assert.match(files["course/modules/01-what-this-lab-builds.html"], /live wiring in `src\/main\.ts`/);
assert.match(files["course/modules/01-what-this-lab-builds.html"], /inactive schedule, PR preview/);
assert.doesNotMatch(files["course/modules/01-what-this-lab-builds.html"], /gitlab-ci\.example\.yml/);

await Promise.all([
  access(".github/workflows/verify.yml"),
  access("reference/The_Tuesday_Brief_-_September_1.pdf"),
  access("reference/The_Wednesday_Brief_-_August_26.pdf"),
  access("reference/The_Wednesday_Brief_-_October_7.pdf"),
]);

// Every SOLO step names one skill prompt; both files must carry each one verbatim.
const skillPrompts = [
  "/grilling Grill me on my intent.md, one question at a time. Focus on the checks a neighbour cannot observe. Do not edit files.",
  "/eli5 Explain my schema and test/schema.test.ts as for an intelligent beginner: what each field checks and why the test was red first. Do not edit files.",
  "/visual-plan Turn my accepted docs/plan.md into one HTML page I can read in the browser. Do not change the plan.",
  "/verify-this Prove that npm run brief:sample writes out/latest.html without a model call. Show the command, exit code and one line of output.",
  "/show-me Draw how one source reaches the brief: src/sources.ts, the tool in src/agent.ts, and src/main.ts. Only read, change nothing.",
  "/verify-this Rerun the three commands in docs/evidence.md and compare each exit code with what is written. Mark any difference OPEN.",
  "/review-and-ship Review my work against intent.md and docs/gate.md. Run the tests. Prepare the PR, but stop before you open it and before any merge.",
  "/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the files, decisions, and next proof.",
];
for (const path of ["SOLO.md", "docs/prompts.md"]) {
  const lines = new Set(files[path].split("\n"));
  for (const prompt of skillPrompts) assert.ok(lines.has(prompt), `${path} is missing skill prompt: ${prompt}`);
}
await Promise.all(skillPrompts.map((prompt) => access(join(".claude/skills", prompt.split(" ")[0].slice(1), "SKILL.md"))));

console.log("PASS 7 assignment prompts stay aligned; start needs no branch switch; A7 can publish through origin or a fork");
