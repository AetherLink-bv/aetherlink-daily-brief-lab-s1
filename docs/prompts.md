# Exacte Claude Code-prompts

Deze zes prompts zijn bytegelijk aan A1 tot en met A6 in `SOLO.md`. A7 heeft bewust geen vaste implementatieprompt.

## Assignment 1 · Kies de gebruiker en bouw één beslisregel

> Read CLAUDE.md, SOLO.md, intent.md, progress.md, and sample/calendar-item.sample.json. Interview me one question at a time until I choose one user and one morning decision. After I approve the wording, update the User and decision section of intent.md and the matching user and decision fields in sample/calendar-item.sample.json. Then write test/mini.test.ts first for one exact line in the form `<start> <title> — decide: <decision>`. Run npm run test:mini and show the expected red failure. Build src/mini.ts, run npm run test:mini and npm run mini, show the green proof and diff, then stop. Use only the local fixture.

```text
/grilling Challenge whether my chosen user, decision, and boundary are observable. Ask one question at a time. Do not edit files.
```

## Assignment 2 · Maak het briefschema rood en daarna groen

> Read the accepted intent.md, the two PDFs named in reference/README.md, and sample/calendar-item.sample.json. Draft docs/spec.md with the complete local brief schema and explicit rules for ordinary, missing, and conflicting input. Stop for my approval. After approval, write test/schema.test.ts first and run npm run test:schema to show the expected red failure. Build src/brief.ts and sample/brief.sample.json until npm run test:schema passes. Add one invalid local sample and prove the schema rejects it. Show the red and green evidence and the diff, then stop. Do not build the renderer or a tool.

```text
/eli5 Explain my brief schema and its red-then-green test. Name what each field protects. Do not edit files.
```

## Assignment 3 · Leg ontwerp en plan vast

> In plan mode, read intent.md, docs/spec.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md for the smallest local route from one agenda fixture to one HTML brief. Give every plan step exact root-relative paths, one proof command, and a reversible rollback. The design must allow exactly one read-only source tool and no network, shell, or write capability. Do not edit files or build. Stop for my approval. After I approve the plan, tell me to press Shift+Tab until manual mode is on. Then save only the approved design documents, challenge one assumption with a case I choose, show the diff, and stop.

```text
/visual-plan Turn my accepted docs/plan.md into one local HTML page. Do not change the plan.
```

## Assignment 4 · Render de lokale voorbeeldbrief

> Read my accepted docs/plan.md and docs/spec.md. Write test/render.test.ts first and run npm run test:render to show the expected red failure. Then build src/render.ts and a sample-only src/main.ts. Escape untrusted text. Run npm run test:render and npm run brief:sample. Prove that out/latest.html contains the chosen user, the decision line, and no invented fact. Ask me for one small house-style change, add its failing test first, make it pass, regenerate the page, show the proof and diff, then stop.

```text
/verify-this Prove that npm run brief:sample writes out/latest.html from local sample data. Show the exit code and output path.
```

## Assignment 5 · Voeg één read-only tool toe en spoor de fout op

> Read the accepted design, plan, and schema. Write test/tool.test.ts first for exactly one read-only `readAgenda` tool that reads a local JSON fixture. Run npm run test:tool and show the expected red failure. Build src/sources.ts and src/agent.ts as a local agent path: instruction, controlled test-model choice, tool call, and answer. Give it no network, shell, or write capability. Add sample/calendar-item.invalid.json with the `start` field missing. Prove that the failing test names `start`, then return an explicit source error and make npm run test:tool pass. Prove the tool contract, not model quality. Show the data path, proof, and diff, then stop.

```text
/show-me Draw the path from sample/calendar-item.sample.json through the one read-only tool to the brief. Only read files.
```

## Assignment 6 · Evalueer en lever lokaal op

> Read docs/spec.md and the fixtures sample/eval/ordinary.json, sample/eval/missing.json, and sample/eval/conflict.json. Write test/eval.test.ts for three outcomes: an ordinary decision line, explicit OPEN without invented facts, and explicit CONFLICT without silently choosing. Run npm run eval and fix only mismatches with the accepted spec. Then run npm run typecheck, npm test, npm run eval, and npm run brief:sample. Record commands, exit codes, and one output line in docs/evidence.md. Mark anything not run OPEN. Show the evidence diff and stop for my approval. Do not publish anything.

```text
/verify-this Run npm run eval and compare ordinary, missing, and conflict with docs/spec.md. Mark every mismatch OPEN.
```

## Handoff

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the files, decisions, and next proof.
```
