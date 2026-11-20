# Bouw zelfstandig een lokale daily brief

Werk in de repository-root. Voer één opdracht tegelijk uit. Bekijk de diff en het echte bewijs voordat je commit.

## Start eenmaal

```bash
npm ci
claude --setting-sources project,user --strict-mcp-config --no-chrome
```

## Assignment 1 · Kies de gebruiker en bouw één beslisregel

Gebruik manual mode. Kies zelf wie de regel leest en welke beslissing die persoon vóór een afspraak neemt.

> Read CLAUDE.md, SOLO.md, intent.md, progress.md, and sample/calendar-item.sample.json. Interview me one question at a time until I choose one user and one morning decision. After I approve the wording, update the User and decision section of intent.md and the matching user and decision fields in sample/calendar-item.sample.json. Then write test/mini.test.ts first for one exact line in the form `<start> <title> — decide: <decision>`. Run npm run test:mini and show the expected red failure. Build src/mini.ts, run npm run test:mini and npm run mini, show the green proof and diff, then stop. Use only the local fixture.

```text
/grilling Challenge whether my chosen user, decision, and boundary are observable. Ask one question at a time. Do not edit files.
```

Klaar wanneer `npm run mini` precies één beslisregel toont.

## Assignment 2 · Maak het briefschema rood en daarna groen

Gebruik manual mode. Behoud het werkende mini-pad.

> Read the accepted intent.md, the two PDFs named in reference/README.md, and sample/calendar-item.sample.json. Draft docs/spec.md with the complete local brief schema and explicit rules for ordinary, missing, and conflicting input. Stop for my approval. After approval, write test/schema.test.ts first and run npm run test:schema to show the expected red failure. Build src/brief.ts and sample/brief.sample.json until npm run test:schema passes. Add one invalid local sample and prove the schema rejects it. Show the red and green evidence and the diff, then stop. Do not build the renderer or a tool.

```text
/eli5 Explain my brief schema and its red-then-green test. Name what each field protects. Do not edit files.
```

Klaar wanneer `npm run test:schema` groen is en de ongeldige invoer wordt afgewezen.

## Assignment 3 · Leg ontwerp en plan vast

Druk op Shift+Tab totdat Claude Code `plan mode on` toont.

> In plan mode, read intent.md, docs/spec.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md for the smallest local route from one agenda fixture to one HTML brief. Give every plan step exact root-relative paths, one proof command, and a reversible rollback. The design must allow exactly one read-only source tool and no network, shell, or write capability. Do not edit files or build. Stop for my approval. After I approve the plan, tell me to press Shift+Tab until manual mode is on. Then save only the approved design documents, challenge one assumption with a case I choose, show the diff, and stop.

```text
/visual-plan Turn my accepted docs/plan.md into one local HTML page. Do not change the plan.
```

Klaar wanneer een ander het plan kan uitvoeren zonder een verborgen stap.

## Assignment 4 · Render de lokale voorbeeldbrief

Gebruik manual mode. Gebruik geen modelcall of netwerk.

> Read my accepted docs/plan.md and docs/spec.md. Write test/render.test.ts first and run npm run test:render to show the expected red failure. Then build src/render.ts and a sample-only src/main.ts. Escape untrusted text. Run npm run test:render and npm run brief:sample. Prove that out/latest.html contains the chosen user, the decision line, and no invented fact. Ask me for one small house-style change, add its failing test first, make it pass, regenerate the page, show the proof and diff, then stop.

```text
/verify-this Prove that npm run brief:sample writes out/latest.html from local sample data. Show the exit code and output path.
```

Open `out/latest.html` en controleer het zichtbare resultaat.

## Assignment 5 · Voeg één read-only tool toe en spoor de fout op

Gebruik manual mode. Behoud de offline voorbeeldroute.

> Read the accepted design, plan, and schema. Write test/tool.test.ts first for exactly one read-only `readAgenda` tool that reads a local JSON fixture. Run npm run test:tool and show the expected red failure. Build src/sources.ts and src/agent.ts as a local agent path: instruction, controlled test-model choice, tool call, and answer. Give it no network, shell, or write capability. Add sample/calendar-item.invalid.json with the `start` field missing. Prove that the failing test names `start`, then return an explicit source error and make npm run test:tool pass. Prove the tool contract, not model quality. Show the data path, proof, and diff, then stop.

```text
/show-me Draw the path from sample/calendar-item.sample.json through the one read-only tool to the brief. Only read files.
```

Klaar wanneer de tool alleen leest en de fout het ontbrekende veld noemt.

Commit het geaccepteerde A5-resultaat. A6 gebruikt die commit als werkende vorige versie.

## Assignment 6 · Evalueer en lever lokaal op

Gebruik manual mode. Noteer alleen bewijs dat je echt uitvoert.

> Read docs/spec.md and the fixtures sample/eval/ordinary.json, sample/eval/missing.json, and sample/eval/conflict.json. Write test/eval.test.ts for three outcomes: an ordinary decision line, explicit OPEN without invented facts, and explicit CONFLICT without silently choosing. Run npm run eval and fix only mismatches with the accepted spec. Then run npm run typecheck, npm test, npm run eval, and npm run brief:sample. Record commands, exit codes, and one output line in docs/evidence.md. Mark anything not run OPEN. Show the evidence diff and stop for my approval. Do not publish anything.

```text
/verify-this Run npm run eval and compare ordinary, missing, and conflict with docs/spec.md. Mark every mismatch OPEN.
```

Commit alleen het geaccepteerde A6-resultaat. Test daarna de vorige en huidige commit in twee tijdelijke worktrees:

```bash
git worktree add --detach ../daily-brief-previous HEAD^
git worktree add --detach ../daily-brief-current HEAD
(cd ../daily-brief-previous && npm ci && npm run typecheck && npm test && npm run brief:sample)
(cd ../daily-brief-current && npm ci && npm run typecheck && npm test && npm run eval && npm run brief:sample)
open ../daily-brief-previous/out/latest.html
open ../daily-brief-current/out/latest.html
```

De vorige worktree is de echte herstelproef. Vergelijk de twee resultaten. Verwijder daarna alleen de tijdelijke worktrees:

```bash
git worktree remove ../daily-brief-previous
git worktree remove ../daily-brief-current
git worktree list
```

Klaar wanneer beide versies draaien en de tijdelijke worktrees veilig zijn verwijderd.

## Assignment 7 · Bouw een nieuwe kleine lokale toepassing

No prescribed implementation prompt. Jij kiest een nieuw probleem en begrenst de opdracht.

1. Kies één gebruiker en één kleine beslissing.
2. Kies één lokale invoer en één zichtbaar resultaat.
3. Schrijf `challenge/README.md` met de grens en één foutgeval.
4. Schrijf eerst een rode test.
5. Bouw de kleinste uitbreiding die de test groen maakt.
6. Toon de uitvoer en inspecteer de diff.
7. Commit alleen wat je zelf hebt geaccepteerd.

Gebruik geen account, netwerk, shelltool of schrijftool in de toepassing.

## Vastgelopen of van laptop gewisseld?

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the files, decisions, and next proof.
```
