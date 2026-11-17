# Claude Code prompts for the seven SOLO steps

These prompts match [SOLO.md](../SOLO.md). Start with the build prompt. Inspect the result before you use the improvement prompt.

## Prepare your branch

> Read README.md, CLAUDE.md, and SOLO.md. Check the documented Node version and package scripts. Preserve existing work. Prepare my own branch and install the documented dependencies after I approve the commands. Report the starting files and any blockers. Do not implement a solution yet.

## Morning route through step 4

Use this prompt for the morning block, A1 to A4. Stop after step 4 for lunch. After lunch, complete A5 to A7 with the step 5 to 7 prompts below.

> Read SOLO.md, AGENTS.md and progress.md in the daily-brief repo. Help me build steps 1–4 with Claude Code, one step at a time. Interview me for intent.md; ask before edits. Show a red schema test, then build the schema. Stay in plan mode until I accept. Build the sample renderer with a red-to-green test and render out/latest.html without a model call. Ask me to choose one style variation. Show its diff and test result. Run commands yourself and stop after each step for my review. Do not copy solved tags or add live credentials.

## Assignment 1 · Write down what the brief must do

Build prompt:

> Read CLAUDE.md, SOLO.md, and the templates on my branch. Interview me one question at a time. Draft intent.md with one outcome, three observable checks, owners, a hard boundary, and one OPEN. Stop for my review. Do not implement code.

Improvement prompt:

> Challenge my weakest check with one concrete counterexample. Revise only intent.md after my answer. Show the diff and stop.

Skill prompt: `/grilling` asks you one hard question at a time until the weak spots in your plan show.

```text
/grilling Grill me on my intent.md, one question at a time. Focus on the checks a neighbour cannot observe. Do not edit files.
```

## Assignment 2 · Make the schema test fail, then pass

Build prompt:

> Read my accepted intent.md and reference/. Propose docs/spec.md with one quoted example per field. After I accept, write test/schema.test.ts and run it to show the expected red failure. Stop so I can inspect and commit the test. Then build src/brief.ts and sample/brief.sample.json until that test passes. Do not build a renderer or tools.

Improvement prompt:

> Add one invalid sample of my choice to test/schema.test.ts. Prove the schema rejects it. Show the spec row, test output, and diff. Stop before SOLO 3.

Skill prompt: `/eli5` explains code in plain words for a smart beginner, without hiding how it works.

```text
/eli5 Explain my schema and test/schema.test.ts as for an intelligent beginner: what each field checks and why the test was red first. Do not edit files.
```

## Assignment 3 · Agree on the design and the plan

Build prompt:

> In plan mode, read intent.md, docs/spec.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md. Name exact paths, one proof command and rollback per step. Do not edit files or build. Stop for my acceptance.

Improvement prompt:

> After I accept the plan, save only those design documents. Challenge one assumption with the case I choose. Show the revised plan and diff. Stop before building.

Skill prompt: `/visual-plan` turns a text plan into one self-contained HTML page you open in the browser.

```text
/visual-plan Turn my accepted docs/plan.md into one HTML page I can read in the browser. Do not change the plan.
```

## Assignment 4 · Render the brief from sample data

Build prompt:

> Use my accepted docs/plan.md. First write test/render.test.ts and show the expected red failure. Then build src/render.ts and a sample-only src/main.ts. Escape untrusted text. Run the sample script and show out/latest.html. Use no API key or model call. Stop for my inspection.

Improvement prompt:

> Change one house-style rule I choose. Add a failing test first, then make it pass. Regenerate out/latest.html and show the diff. Stop so I can inspect the page and save a 1440×900 screenshot.

Skill prompt: `/verify-this` runs a real command to prove a claim and reports what it saw.

```text
/verify-this Prove that npm run brief:sample writes out/latest.html without a model call. Show the command, exit code and one line of output.
```

## Assignment 5 · Give the agent one read-only tool

Build prompt:

> Read my accepted plan and schema. Build src/agent.ts, src/sources.ts, and test/agent.test.ts for one read-only tool. Connect src/main.ts to the agent for the live brief command while preserving brief:sample without model calls. Reuse tool() and guarded() if present. Give the brief-agent no shell or write tools. Prove the tool wiring and missing-source behavior with tests. Keep the sample path working. Stop for my review.

Improvement prompt:

> Test one missing-source case I choose. Show the diff and observed test output. With configured credentials, run the brief and trace each factual claim to run.log. Without credentials, run the sample and mark the live check OPEN. Never print tokens. Stop for my inspection.

Skill prompt: `/show-me` draws a small diagram or code sketch so you can see how parts connect.

```text
/show-me Draw how one source reaches the brief: src/sources.ts, the tool in src/agent.ts, and src/main.ts. Only read, change nothing.
```

## Assignment 6 · Record the evidence

Build prompt:

> Run the existing typecheck, test, and brief:sample scripts. Record each actual command, exit code, and one output line in docs/evidence.md. Link my screenshot under docs/evidence/. Mark unrun checks OPEN. Do not change implementation to hide a failure. Stop for my review.

Improvement prompt:

> Check the evidence against the extra case I choose. Show missing proof as OPEN. Stop while my reviewer reruns one command and compares the output. Record their actual name and result only afterward.

Skill prompt: `/verify-this` runs a real command to prove a claim and reports what it saw.

```text
/verify-this Rerun the three commands in docs/evidence.md and compare each exit code with what is written. Mark any difference OPEN.
```

## Assignment 7 · Decide the gate and prepare the PR

Build prompt:

> Read intent.md, the diff, and docs/evidence.md. Draft docs/gate.md with evidence links and proposed FAIL or OPEN entries for missing checks. Leave PASS decisions to me. Prepare a PR description and weekday schedule without activating it. Do not merge, deploy, or publish. Stop for my decision.

Improvement prompt:

> Use the OPEN item I choose to propose one new acceptance check. Show the gate diff and PR preview. After I decide the gate and approve publication, open the PR. Stop before merge or deployment.

Skill prompt: `/review-and-ship` reviews your branch, runs the checks, and prepares the PR for you to open.

```text
/review-and-ship Review my branch against intent.md and docs/gate.md. Run the tests. Prepare the PR, but stop before you open it and before any merge.
```

## Stuck or switching laptop?

`/handoff` writes a prompt that a fresh Claude Code session can paste in to continue your work.

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current step. Name the step, the files, and the next proof.
```
