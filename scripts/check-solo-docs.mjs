import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const paths = [
  "SOLO.md",
  "docs/prompts.md",
  "README.md",
  "docs/spec.md",
  "reference/dia-to-bree.md",
  "package.json",
  "AGENTS.md",
  "course/index.html",
];
const files = Object.fromEntries(await Promise.all(paths.map(async (path) => [path, await readFile(path, "utf8")])));
const prompts = (text) => [...text.matchAll(/^> (.+)$/gm)].map((match) => match[1]);
const assignments = (text) => [...text.matchAll(/^## Assignment ([1-7]): /gm)].map((match) => Number(match[1]));

assert.deepEqual(prompts(files["docs/prompts.md"]), prompts(files["SOLO.md"]));
assert.equal(prompts(files["SOLO.md"]).length, 6, "A1-A6 have one exact prompt; A7 is participant-designed");
assert.deepEqual(assignments(files["SOLO.md"]), [1, 2, 3, 4, 5, 6, 7]);

for (const [path, text] of Object.entries(files)) {
  assert.doesNotMatch(text, /git switch|git checkout step-/i, path);
}

assert.match(files["README.md"], /existing approved Jira MCP connection/);
assert.match(files["README.md"], /Do not connect work email/);
assert.match(files["README.md"], /organisation-approved Anthropic via Vertex model route/);
assert.match(files["SOLO.md"], /\/mcp/);
assert.match(files["SOLO.md"], /npm run brief:live/);
assert.match(files["SOLO.md"], /\/visual-plan/);
assert.match(files["SOLO.md"], /create-verification-skill/);
assert.match(files["SOLO.md"], /sample\/brief\.sample\.json/);
assert.match(files["SOLO.md"], /Summary and moveWorkForward are single items/);
assert.match(files["SOLO.md"], /TopTodos, newUpdates, and yourDay are non-empty item arrays/);
assert.match(files["SOLO.md"], /READY and CONFLICT items have at least one source ID; OPEN may have none/);
assert.match(files["SOLO.md"], /Live source IDs must be exact Jira issue keys/);
assert.match(files["SOLO.md"], /~\/\.bree\/briefs\/YYYY-MM-DD\.html/);
assert.match(files["SOLO.md"], /do not install or activate a scheduler/);
assert.match(files["SOLO.md"], /git worktree add --detach \.\.\/daily-brief-previous HEAD\^/);
assert.match(files["docs/spec.md"], /`summary` \| content item \|/);
assert.match(files["docs/spec.md"], /`moveWorkForward` \| content item \|/);
assert.match(files["reference/dia-to-bree.md"], /Missing evidence is OPEN; disagreement is CONFLICT/);
assert.match(files["reference/dia-to-bree.md"], /https:\/\/picsum\.photos\/id\/1015\/1200\/400/);
assert.match(files["reference/dia-to-bree.md"], /not AI-generated, a source, or business evidence/);

for (const path of ["SOLO.md", "docs/prompts.md", "README.md", "docs/spec.md", "reference/dia-to-bree.md"]) {
  assert.doesNotMatch(files[path], /sample\/daily-brief\.sample\.json|private terminal brief|terminal-only result/i, path);
}

const scripts = JSON.parse(files["package.json"]).scripts;
for (const name of ["mini", "test:mini", "test:schema", "test:render", "eval", "test:live", "live:check", "brief:live"]) {
  assert.ok(scripts[name], `package.json is missing ${name}`);
}

await Promise.all([
  access(".bree.example.json"),
  access("sample/calendar-item.sample.json"),
  access("sample/brief.sample.json"),
  access("sample/outlook-email.sample.json"),
  access("sample/eval/ordinary.json"),
  access("sample/eval/missing.json"),
  access("sample/eval/conflict.json"),
  access(".claude/skills/visual-plan/SKILL.md"),
  access(".claude/skills/create-verification-skill/SKILL.md"),
  access(".claude/skills/LICENSES/MIT-pstack.txt"),
  access("reference/dia-to-bree.md"),
  access("reference/brief-example.md"),
]);

console.log("PASS — seven assignments, six canonical prompts, full DailyBrief contract, private dated output, and two core project skills align");
