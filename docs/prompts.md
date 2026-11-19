# Claude Code prompts for the seven assignments

These seven prompts match [SOLO.md](../SOLO.md) exactly. Paste one prompt per assignment.

## Assignment 1 · Write down what the brief must do

> Read CLAUDE.md, SOLO.md, and the templates. Interview me one question at a time. Draft intent.md with one outcome, three observable checks, owners, a hard boundary, and one OPEN. Challenge my weakest check with one concrete counterexample. Revise only after my answer. Show the diff and stop for my review. Do not implement code.

```text
/grilling Grill me on my intent.md, one question at a time. Focus on the checks a neighbour cannot observe. Do not edit files.
```

## Assignment 2 · Make the schema test fail, then pass

> Read my accepted intent.md and reference/. Draft docs/spec.md with one quoted example per field, then stop for my approval. After I approve it, write test/schema.test.ts and run it to show the expected red failure. Stop so I can inspect and commit the red test. After I confirm, build src/brief.ts and sample/brief.sample.json until the test passes. Ask me for one invalid sample and prove the schema rejects it. Show the test output and diff. Do not build a renderer or tools.

```text
/eli5 Explain my schema and test/schema.test.ts as for an intelligent beginner: what each field checks and why the test was red first. Do not edit files.
```

## Assignment 3 · Agree on the design and the plan

> In plan mode, read intent.md, docs/spec.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md. Give every plan step an exact path, proof command, and rollback. Do not edit files or build. Stop for my approval. After I approve the plan, save only those design documents, challenge one assumption with a case I choose, show the revised diff, and stop.

```text
/visual-plan Turn my accepted docs/plan.md into one HTML page I can read in the browser. Do not change the plan.
```

## Assignment 4 · Render the brief from sample data

> Use my accepted docs/plan.md. Write test/render.test.ts and show the expected red failure. Then build src/render.ts and a sample-only src/main.ts. Escape untrusted text. Run npm run brief:sample and show out/latest.html. Ask me to choose one house-style change. Add its failing test first, make it pass, regenerate the page, and show the diff. Use no API key or model call. Stop for my inspection.

```text
/verify-this Prove that npm run brief:sample writes out/latest.html without a model call. Show the command, exit code and one line of output.
```

## Assignment 5 · Give the agent one read-only tool

> Read my accepted plan and schema. Build src/agent.ts, src/sources.ts, and test/agent.test.ts for one read-only tool. Connect src/main.ts to the agent for the live brief command. Preserve brief:sample without model calls. Give the brief agent no shell or write tools. Prove the tool wiring and one missing-source case I choose with tests. With credentials, run the brief and trace each factual claim to run.log. Without credentials, run the sample and mark the live check OPEN. Never print tokens. Show the proof and diff, then stop.

```text
/show-me Draw how one source reaches the brief: src/sources.ts, the tool in src/agent.ts, and src/main.ts. Only read, change nothing.
```

## Assignment 6 · Record the evidence

> Run the existing typecheck, test, and brief:sample scripts. Record every command, exit code, and one output line in docs/evidence.md. Link docs/evidence/latest-1440x900.png. Mark unrun checks OPEN. Do not change code to hide a failure. Ask my reviewer to rerun one command. Record the reviewer's actual name and result only after the rerun. Show the evidence diff and stop.

```text
/verify-this Rerun the three commands in docs/evidence.md and compare each exit code with what is written. Mark any difference OPEN.
```

## Assignment 7 · Decide the gate and prepare the PR

> Read intent.md, the current diff, and docs/evidence.md. Draft docs/gate.md with evidence links and proposed FAIL or OPEN entries for missing checks. Leave every PASS decision to me. Prepare a PR title, description, and inactive weekday schedule. Show the diff and stop for my gate decision. Do not commit, push, open a PR, merge, deploy, or activate the schedule.

```text
/review-and-ship Review my work against intent.md and docs/gate.md. Run the tests. Prepare the PR, but stop before you open it and before any merge.
```

## Stuck or switching laptop?

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the files, decisions, and next proof.
```
