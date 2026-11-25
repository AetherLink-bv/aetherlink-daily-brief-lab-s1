import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

await import(new URL("../.claude/skills/visual-plan/scripts/check-local-skill-dependencies.mjs", import.meta.url));

const paths = [
  "SOLO.md",
  "docs/prompts.md",
  "docs/voice-extension.md",
  "README.md",
  "intent.md",
  "docs/spec.md",
  "docs/design.md",
  "docs/plan.md",
  "reference/dia-to-bree.md",
  "reference/solo-details.md",
  "package.json",
  "package-lock.json",
  ".gitignore",
  "AGENTS.md",
  "course/index.html",
];
const files = Object.fromEntries(await Promise.all(paths.map(async (path) => [path, await readFile(path, "utf8")])));
// The prompts are short. The exact requirements of each part are in reference/solo-details.md.
const solo = `${files["SOLO.md"]}\n${files["reference/solo-details.md"]}`;
const packageJson = JSON.parse(files["package.json"]);
const lock = JSON.parse(files["package-lock.json"]);
assert.equal(packageJson.allowScripts[`esbuild@${lock.packages["node_modules/esbuild"].version}`], true);
assert.equal(packageJson.allowScripts.fsevents, false);
const prompts = (text) => [...text.matchAll(/^> (.+)$/gm)].map((match) => match[1]);
const assignments = (text) => [...text.matchAll(/^## Assignment ([1-7]): /gm)].map((match) => Number(match[1]));
const promptCountsByAssignment = (text) => {
  const headings = [...text.matchAll(/^## Assignment ([1-7]): .+$/gm)];
  return Object.fromEntries(headings.map((heading, index) => {
    const start = heading.index;
    const end = headings[index + 1]?.index ?? text.length;
    return [Number(heading[1]), prompts(text.slice(start, end)).length];
  }));
};
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

assert.deepEqual(prompts(files["docs/prompts.md"]), prompts(files["SOLO.md"]));
assert.equal(prompts(files["SOLO.md"]).length, 12, "A1-A6 have twelve canonical prompt parts; A7 is participant-designed");
assert.deepEqual(promptCountsByAssignment(files["SOLO.md"]), {1: 2, 2: 2, 3: 1, 4: 2, 5: 2, 6: 3, 7: 0});
assert.deepEqual(assignments(files["SOLO.md"]), [1, 2, 3, 4, 5, 6, 7]);

for (const [path, text] of Object.entries(files)) {
  assert.doesNotMatch(text, /git switch|git checkout step-/i, path);
}

assert.match(files["README.md"], /existing approved Jira MCP connection/);
assert.match(files["README.md"], /Do not connect work email/);
assert.match(files["README.md"], /organisation-approved Anthropic via Vertex model route/);
assert.match(files["README.md"], /Node\.js 20\.12 or newer/);
assert.match(files["README.md"], /--setting-sources project,user --permission-mode default --strict-mcp-config --no-chrome/);
assert.match(files["README.md"], /claude mcp add --transport http jira https:\/\/mcpjira\.kazan\.ai\.worldline-solutions\.com\/mcp/);
assert.match(files["SOLO.md"], /claude mcp add --transport http jira /);
// Every tracked text file, not only the files above: the course modules and CLAUDE.md teach the route too.
const tracked = execFileSync("git", ["ls-files", "*.md", "*.html"], {encoding: "utf8"}).split("\n").filter(Boolean);
for (const path of tracked) assert.doesNotMatch(await readFile(path, "utf8"), /AETHERLINK_JIRA_MCP_CONFIG|--mcp-config/, `${path}: the Jira route is claude mcp add plus /mcp, not a private config path`);
assert.match(files["SOLO.md"], /\.bree\.local\.json.*not.*MCP server configuration/is);
assert.match(solo, /settingSources \['local'\]/);
assert.match(solo, /PreToolUse hook/);
assert.match(solo, /built-in tools to none/);
assert.match(solo, /canUseTool/);
assert.match(files["SOLO.md"], /\/mcp/);
assert.match(files["SOLO.md"], /npm run brief:live/);
assert.match(files["SOLO.md"], /\/visual-plan/);
assert.match(files["SOLO.md"], /create-verification-skill/);
assert.match(solo, /sample\/brief\.sample\.json/);
assert.match(solo, /Summary and moveWorkForward are single items/);
assert.match(solo, /TopTodos, newUpdates, and yourDay are non-empty item arrays/);
assert.match(solo, /READY and CONFLICT items have at least one source ID; OPEN may have none/);
assert.match(solo, /Accept only exact Jira keys .* as live source IDs/);
assert.match(solo, /~\/\.bree\/briefs\/YYYY-MM-DD\.html/);
assert.match(files["SOLO.md"], /do not install or activate a scheduler/);
assert.match(files["SOLO.md"], /git worktree add --detach \.\.\/daily-brief-previous HEAD\^/);
assert.match(files["docs/spec.md"], /`summary` \| content item \|/);
assert.match(files["docs/spec.md"], /`moveWorkForward` \| content item \|/);
assert.match(files["reference/dia-to-bree.md"], /Missing evidence is OPEN; disagreement is CONFLICT/);
assert.match(files["reference/dia-to-bree.md"], /https:\/\/picsum\.photos\/seed\/bree-morning\/1200\/400/);
assert.match(solo, /stable visible fallback text/);
assert.match(files["SOLO.md"], /Never reconstruct historical raw logs or record live connector contents/);
assert.match(files["reference/dia-to-bree.md"], /not AI-generated, a source, or business evidence/);

// A participant rewrites intent.md, docs/spec.md, docs/design.md and docs/plan.md, so only the files they do not rewrite must keep the link.
for (const path of ["README.md", "SOLO.md", "docs/prompts.md", "course/index.html"]) {
  assert.match(files[path], /voice-extension\.md/, `${path} must link to the optional voice extension`);
}

const voiceGuide = files["docs/voice-extension.md"];
assert.match(voiceGuide, /optional/i);
assert.match(voiceGuide, /synthetic/i);
assert.match(voiceGuide, /Never read `~\/\.bree\/briefs\/` or live connector output/);
assert.match(voiceGuide, /your own ElevenLabs account and key/i);
assert.match(voiceGuide, /Do not use a trainer's shared key/i);
assert.match(voiceGuide, /\.env\.local/);
assert.match(voiceGuide, /Never paste the key into Claude Code, chat/i);
assert.match(voiceGuide, /raw work data out of the request/i);
assert.match(files[".gitignore"], /^\.env\.\*$/m, ".env.local must be ignored");
assert.match(files["README.md"], /not required to complete Day 5/i);
assert.match(files["SOLO.md"], /optional/i);

for (const path of ["SOLO.md", "docs/prompts.md", "README.md", "docs/spec.md", "reference/dia-to-bree.md"]) {
  assert.doesNotMatch(files[path], /sample\/daily-brief\.sample\.json|private terminal brief|terminal-only result/i, path);
}

// Only Assignment 1 fills intent.md, and its prompt names one section. A placeholder anywhere else is never filled.
assert.doesNotMatch(files["intent.md"].replace(/^### User and decision$[\s\S]*?(?=^## )/m, ""), /TEMPLATE/, "intent.md has a TEMPLATE placeholder outside the User and decision section");

const scripts = JSON.parse(files["package.json"]).scripts;
for (const name of ["mini", "test:mini", "test:schema", "test:render", "eval", "test:live", "live:check", "brief:live", "test:voice", "brief:voice"]) {
  assert.ok(scripts[name], `package.json is missing ${name}`);
}

// The optional voice extension tells a participant to make both files, so they may exist. They exist together.
assert.equal(await exists("src/voice.ts"), await exists("test/voice.test.ts"), "src/voice.ts and test/voice.test.ts exist together");

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


// Every short prompt that names a section finds that section in the details file.
for (const [, section] of files["SOLO.md"].matchAll(/reference\/solo-details\.md, section (A\d(?: Part \d)?)/g)) {
  assert.match(files["reference/solo-details.md"], new RegExp(`^## ${section}$`, "m"), `no section ${section} in reference/solo-details.md`);
}
for (const prompt of prompts(files["SOLO.md"])) assert.ok(prompt.split(/\s+/).length <= 75, `a SOLO prompt is longer than 75 words: ${prompt.slice(0, 40)}`);
// Every SOLO prompt has the six lines of the Day 1 template, in that order.
for (const prompt of prompts(files["SOLO.md"])) assert.match(prompt, /^Goal: .+ Context: .+ Constraints: .+ Done when: .+ Output: .+ Check: .+$/, `not the six-line template: ${prompt.slice(0, 40)}`);
// Every prompt names its section. A requirement that a prompt moved to the details file is in that prompt's section.
const sectionOf = name => (files["reference/solo-details.md"].split(/^## /m).find(part => part.startsWith(`${name}\n`)) ?? "");
for (const prompt of prompts(files["SOLO.md"])) assert.match(prompt, /reference\/solo-details\.md, section A\d(?: Part \d)?/, `a SOLO prompt names no section: ${prompt.slice(0, 40)}`);
for (const [section, needs] of Object.entries({
  "A2 Part 1": [/Summary and moveWorkForward are single items/, /TopTodos, newUpdates, and yourDay are non-empty item arrays/, /READY and CONFLICT items have at least one source ID; OPEN may have none/],
  "A4 Part 1": [/https:\/\/picsum\.photos\/seed\/bree-morning\/1200\/400/, /referrerpolicy="no-referrer"/, /stable visible fallback text/],
  "A5 Part 2": [/settingSources \['local'\]/, /built-in tools to none/, /canUseTool/, /PreToolUse hook/, /Accept only exact Jira keys .* as live source IDs/, /~\/\.bree\/briefs\/YYYY-MM-DD\.html/, /exits with code 0 for READY and code 3 for OPEN/],
})) for (const need of needs) assert.match(sectionOf(section), need, `${section} must hold ${need}`);
console.log("PASS — seven assignments, twelve canonical prompt parts, core DailyBrief route, and optional synthetic voice extension align");
