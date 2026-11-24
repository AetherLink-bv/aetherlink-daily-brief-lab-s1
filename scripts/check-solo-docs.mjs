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
  "package.json",
  "package-lock.json",
  ".gitignore",
  "AGENTS.md",
  "course/index.html",
];
const files = Object.fromEntries(await Promise.all(paths.map(async (path) => [path, await readFile(path, "utf8")])));
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
assert.match(files["README.md"], /AETHERLINK_JIRA_MCP_CONFIG/);
assert.match(files["README.md"], /--strict-mcp-config --mcp-config "\$AETHERLINK_JIRA_MCP_CONFIG"/);
assert.match(files["SOLO.md"], /AETHERLINK_JIRA_MCP_CONFIG/);
assert.match(files["SOLO.md"], /\.bree\.local\.json.*not.*MCP server configuration/is);
assert.match(files["SOLO.md"], /mcpServers option/);
assert.match(files["SOLO.md"], /built-in tools to none/);
assert.match(files["SOLO.md"], /canUseTool/);
assert.match(files["SOLO.md"], /\/mcp/);
assert.match(files["SOLO.md"], /npm run brief:live/);
assert.match(files["SOLO.md"], /\/visual-plan/);
assert.match(files["SOLO.md"], /create-verification-skill/);
assert.match(files["SOLO.md"], /sample\/brief\.sample\.json/);
assert.match(files["SOLO.md"], /Summary and moveWorkForward are single items/);
assert.match(files["SOLO.md"], /TopTodos, newUpdates, and yourDay are non-empty item arrays/);
assert.match(files["SOLO.md"], /READY and CONFLICT items have at least one source ID; OPEN may have none/);
assert.match(files["SOLO.md"], /Accept only exact Jira keys .* as live source IDs/);
assert.match(files["SOLO.md"], /~\/\.bree\/briefs\/YYYY-MM-DD\.html/);
assert.match(files["SOLO.md"], /do not install or activate a scheduler/);
assert.match(files["SOLO.md"], /git worktree add --detach \.\.\/daily-brief-previous HEAD\^/);
assert.match(files["docs/spec.md"], /`summary` \| content item \|/);
assert.match(files["docs/spec.md"], /`moveWorkForward` \| content item \|/);
assert.match(files["reference/dia-to-bree.md"], /Missing evidence is OPEN; disagreement is CONFLICT/);
assert.match(files["reference/dia-to-bree.md"], /https:\/\/picsum\.photos\/seed\/bree-morning\/1200\/400/);
assert.match(files["SOLO.md"], /stable visible fallback text/);
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
const [intentBefore, intentChoice = "", ...intentAfter] = files["intent.md"].split(/^### User and decision$|^## Success checks$/m);
assert.doesNotMatch(intentBefore + intentAfter.join(""), /TEMPLATE/, "intent.md has a TEMPLATE placeholder outside the User and decision section");

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

console.log("PASS — seven assignments, twelve canonical prompt parts, core DailyBrief route, and optional synthetic voice extension align");
