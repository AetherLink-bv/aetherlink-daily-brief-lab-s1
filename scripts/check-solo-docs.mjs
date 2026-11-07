import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

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
assert.equal(prompts(files["SOLO.md"]).length, 15);

for (const [path, text] of Object.entries(files)) {
  assert.doesNotMatch(text, /git checkout step-/i, path);
}

assert.match(files["SOLO.md"], /Connect src\/main\.ts to the agent for the live brief command while preserving brief:sample without model calls/);
assert.match(files["SOLO.md"], /Without credentials, run the sample and mark the live check OPEN/);
assert.match(files["README.md"], /The_Tuesday_Brief_-_September_1\.pdf/);
assert.match(files["README.md"], /The_Wednesday_Brief_-_August_26\.pdf/);
assert.match(files["course/modules/01-what-this-lab-builds.html"], /live wiring in `src\/main\.ts`/);
assert.match(files["course/modules/01-what-this-lab-builds.html"], /inactive schedule, PR preview/);
assert.doesNotMatch(files["course/modules/01-what-this-lab-builds.html"], /gitlab-ci\.example\.yml/);

await Promise.all([
  access("reference/The_Tuesday_Brief_-_September_1.pdf"),
  access("reference/The_Wednesday_Brief_-_August_26.pdf"),
  access("reference/The_Wednesday_Brief_-_October_7.pdf"),
]);

console.log("PASS 15 prompt-first SOLO instructions stay aligned");
