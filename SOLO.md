# Build the daily brief with Claude Code

Build one daily brief through seven assignments. You choose the requirements, inspect every result, and approve every decision.
Claude Code may edit files and run commands after your approval. The brief agent gets no shell or write tools.

## Start once

Clone the starter and open Claude Code from the repository root. Do not create or change a branch yet.

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
npm ci
claude --setting-sources project,user --strict-mcp-config --no-chrome
```

`main` is intentionally unsolved. It contains the templates, package skeleton, reference briefs, and project skills.
Commit only work you accepted. Assignment 7 publishes the accepted commits to a new remote branch without changing your local branch.

Never paste credentials into a prompt or commit them. Assignments 1 through 4 work without credentials.
Missing credentials leave the live check in Assignment 5 OPEN. Keep `npm run brief:sample` working throughout the exercise.

## How every assignment works

1. Check the required Claude Code mode.
2. Paste the one assignment prompt.
3. Inspect the named proof and the diff.
4. Approve or revise the result.
5. Commit only accepted work.
6. Append the observed proof to `progress.md`.

Use VERIFIED only after a reviewer reruns the check. Use FAIL for a failed check. Use OPEN for a check that did not run.

## Assignment 1 · Write down what the brief must do

Use manual mode. Start with the templates.

> Read CLAUDE.md, SOLO.md, and the templates. Interview me one question at a time. Draft intent.md with one outcome, three observable checks, owners, a hard boundary, and one OPEN. Challenge my weakest check with one concrete counterexample. Revise only after my answer. Show the diff and stop for my review. Do not implement code.

Optional project skill:

```text
/grilling Grill me on my intent.md, one question at a time. Focus on the checks a neighbour cannot observe. Do not edit files.
```

Done when a facilitator accepts the boundary and all three checks are observable.

## Assignment 2 · Make the schema test fail, then pass

Use manual mode. Start with the accepted intent and `reference/`.

> Read my accepted intent.md and reference/. Draft docs/spec.md with one quoted example per field, then stop for my approval. After I approve it, write test/schema.test.ts and run it to show the expected red failure. Stop so I can inspect and commit the red test. After I confirm, build src/brief.ts and sample/brief.sample.json until the test passes. Ask me for one invalid sample and prove the schema rejects it. Show the test output and diff. Do not build a renderer or tools.

Optional project skill:

```text
/eli5 Explain my schema and test/schema.test.ts as for an intelligent beginner: what each field checks and why the test was red first. Do not edit files.
```

Done when the red test is committed first, the schema tests pass, and the invalid sample is rejected.

## Assignment 3 · Agree on the design and the plan

Press Shift+Tab until Claude Code shows `plan mode on`.

> In plan mode, read intent.md, docs/spec.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md. Give every plan step an exact path, proof command, and rollback. Do not edit files or build. Stop for my approval. After I approve the plan, tell me to press Shift+Tab until manual mode is on. Then save only those design documents, challenge one assumption with a case I choose, show the revised diff, and stop.

Optional project skill:

```text
/visual-plan Turn my accepted docs/plan.md into one HTML page I can read in the browser. Do not change the plan.
```

Done when a neighbour can follow the plan and name the proof for every step.

## Assignment 4 · Render the brief from sample data

Return to manual mode. Use no API key or model call.

> Use my accepted docs/plan.md. Write test/render.test.ts and show the expected red failure. Then build src/render.ts and a sample-only src/main.ts. Escape untrusted text. Run npm run brief:sample and show out/latest.html. Ask me to choose one house-style change. Add its failing test first, make it pass, regenerate the page, and show the diff. Use no API key or model call. Stop for my inspection.

Optional project skill:

```text
/verify-this Prove that npm run brief:sample writes out/latest.html without a model call. Show the command, exit code and one line of output.
```

Open `out/latest.html`. Save a 1440×900 screenshot as `docs/evidence/latest-1440x900.png`.

## Assignment 5 · Give the agent one read-only tool

Use manual mode. Preserve the offline sample route.

> Read my accepted plan and schema. Build src/agent.ts, src/sources.ts, and test/agent.test.ts for one read-only tool. Connect src/main.ts to the agent for the live brief command. Preserve brief:sample without model calls. Give the brief agent no shell or write tools. Prove the tool wiring and one missing-source case I choose with tests. With credentials, run the brief and trace each factual claim to run.log. Without credentials, run the sample and mark the live check OPEN. Never print tokens. Show the proof and diff, then stop.

Optional project skill:

```text
/show-me Draw how one source reaches the brief: src/sources.ts, the tool in src/agent.ts, and src/main.ts. Only read, change nothing.
```

With credentials, run `npm run brief 2> run.log`. Without credentials, keep the live result OPEN.

## Assignment 6 · Record the evidence

Use manual mode. Record only commands you actually ran.

> Run the existing typecheck, test, and brief:sample scripts. Record every command, exit code, and one output line in docs/evidence.md. Link docs/evidence/latest-1440x900.png. Mark unrun checks OPEN. Do not change code to hide a failure. Ask my reviewer to rerun one command. Record the reviewer's actual name and result only after the rerun. Show the evidence diff and stop.

Optional project skill:

```text
/verify-this Rerun the three commands in docs/evidence.md and compare each exit code with what is written. Mark any difference OPEN.
```

Done when the evidence contains three real command results, the screenshot, and one independent rerun.

## Assignment 7 · Decide the gate and prepare the PR

Use manual mode. You make every PASS decision.

> Read intent.md, the current diff, and docs/evidence.md. Draft docs/gate.md with evidence links and proposed FAIL or OPEN entries for missing checks. Leave every PASS decision to me. Prepare a PR title, description, and inactive weekday schedule. Show the diff and stop for my gate decision. Do not commit, push, open a PR, merge, deploy, or activate the schedule.

Optional project skill:

```text
/review-and-ship Review my work against intent.md and docs/gate.md. Run the tests. Prepare the PR, but stop before you open it and before any merge.
```

After the human gate approves publication, commit the accepted Assignment 7 files. Then replace `<firstname>` and use one route.

If you can write to the classroom repository:

```bash
BRANCH="my/<firstname>"
git push origin "HEAD:refs/heads/$BRANCH"
gh pr create --repo AetherLink-bv/aetherlink-daily-brief-lab-s1 --base main --head "$BRANCH"
```

If `origin` is not writable, publish through your fork:

```bash
BRANCH="my/<firstname>"
gh repo fork AetherLink-bv/aetherlink-daily-brief-lab-s1 --remote --remote-name fork --clone=false
git push fork "HEAD:refs/heads/$BRANCH"
OWNER=$(gh api user --jq .login)
gh pr create --repo AetherLink-bv/aetherlink-daily-brief-lab-s1 --base main --head "$OWNER:$BRANCH"
```

Both routes leave the local branch unchanged. Stop before merge, deployment, or schedule activation.

## Stuck or switching laptop?

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the files, decisions, and next proof.
```

Open the rendered page and read the gate yourself. Keep the schema, renderer, read-only tool, evidence, and PR traceable to your accepted commits.
