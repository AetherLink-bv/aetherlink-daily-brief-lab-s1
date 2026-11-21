# Build your personal Daily Brief agent

It is 08:30. Your stand-up starts at 09:00. Bree prepares one private brief from your own permitted work items in the existing, approved Jira MCP connection.

You are the builder and reviewer. Claude Code helps you through the local AI-native SDLC. Each assignment leaves an artifact and a visible check. Missing information stays `OPEN`. Conflicting evidence stays `CONFLICT`.

Local fixtures are synthetic. Use them for tests, recordings, and reproducible evidence. The finished Bree route reads only your permitted work items through the existing approved Jira MCP connection.

## Data and permission rules

- Use Bree privately for your own work. Do not publish the brief or its live output.
- Never add customer data, credentials, connector responses, or live briefs to prompts, fixtures, screenshots, recordings, evidence files, or commits.
- Use only the existing, organisation-approved Jira MCP connection and your own permitted work items.
- Use only the organisation-approved Anthropic via Vertex model route configured for this workshop.
- Do not connect work email. Paste only sanitised, non-sensitive text when an exercise explicitly needs mail-like input.
- Give Bree one exact read-only source tool. Do not give it shell, file-write, messaging, or ticket-update tools.
- Stop when the connector offers write scope, the source contains customer data, or permission is unclear.

## Start once

```bash
npm ci
claude --setting-sources project,user --no-chrome
```

Complete one assignment at a time. Inspect each diff and run the named check yourself before you continue.

| SDLC phase | Artifact and proof |
| --- | --- |
| Plan | Accepted `intent.md` and one synthetic decision line |
| Design | Accepted Dia-to-Bree contract, design, and visual plan |
| Build | Tested full HTML renderer plus one bounded SDK and MCP route |
| Test | Synthetic evaluations, one scripted journey, and separate live status |
| Deploy | A dated private HTML artifact and an approved trigger proposal. Nothing is published. |
| Maintain | One observed result becomes the next intent and check |

## Assignment 1: choose the user and prove one line

Use manual mode. Choose one reader and one decision that the brief should support.

> Read CLAUDE.md, SOLO.md, intent.md, progress.md, and sample/calendar-item.sample.json. Interview me one question at a time until I choose one user and one morning decision. After I approve the wording, update the User and decision section of intent.md and the matching synthetic fixture fields. Write test/mini.test.ts first for one exact line in the form `<start> <title> — decide: <decision>`. Run npm run test:mini and show the expected red failure. Build src/mini.ts, run npm run test:mini and npm run mini, show the green proof and diff, then stop. State clearly that this synthetic line is a learning slice, not the finished agent.

```text
/grilling Challenge whether my chosen user, decision, and boundary are observable. Ask one question at a time. Do not edit files.
```

Done when `npm run mini` prints one traceable decision line.

## Assignment 2: agree the brief contract

Keep the working mini route. Reverse engineer the safe structure of a useful Daily Brief before adding a model or connector.

> Read the accepted intent.md, reference/dia-to-bree.md, reference/brief-example.md, and sample/brief.sample.json. Reverse engineer only the safe structural pattern: title, date, greeting, summary, one move-work-forward action, top todos, new updates, your day, and sources. Draft docs/spec.md with the complete DailyBrief schema. Title and greeting are strings; date uses YYYY-MM-DD. Summary and moveWorkForward are single items. TopTodos, newUpdates, and yourDay are non-empty item arrays. Every item has status READY, OPEN, or CONFLICT, text, and sourceIds. READY and CONFLICT items have at least one source ID; OPEN may have none. Every sourceId resolves in sources, whose entries have id and label. OPEN text starts OPEN; CONFLICT text starts CONFLICT. Stop for my approval. After approval, write test/schema.test.ts first and run npm run test:schema to show the expected red failure. Build src/brief.ts and sample/brief.sample.json until the full valid sample passes. Add one invalid synthetic sample and prove the schema rejects it. Show the red and green evidence and the diff, then stop. Do not build the renderer, SDK route, or connector.

```text
/eli5 Explain my brief contract and its red-then-green test. Name what each field protects. Do not edit files.
```

Done when the valid sample passes and the invalid sample is rejected.

## Assignment 3: design the complete route

Press Shift+Tab until Claude Code shows plan mode. No implementation changes happen in this assignment.

> In plan mode, read the accepted intent.md, docs/spec.md, reference/dia-to-bree.md, AGENTS.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md for the smallest complete Bree route: synthetic fixtures → DailyBrief schema → full HTML renderer, plus one approved read-only MCP tool → Claude Agent SDK → the same schema → dated private HTML under ~/.bree/briefs/. Give every plan step exact root-relative paths, one proof command, and a reversible rollback. Include OPEN sections, host-owned file writing, human approval points, and separate synthetic proof from live source proof. Do not edit files or build. Stop for my approval. After I approve the plan, tell me to return to manual mode. Save only the accepted design documents, show the diff, and stop.

```text
/visual-plan plan Read the accepted intent, specification, design, and plan. Create one offline HTML plan for the complete Bree journey. Show synthetic fixtures, the full DailyBrief schema, HTML renderer, approved source, exact read-only MCP tool, Claude Agent SDK, dated private artifact, OPEN sections, approval points, and evidence after each step. Use synthetic labels and no real work data. Do not change source files or invent commands.
```

Done when another participant can execute the plan without a hidden permission, source, or proof step.

## Assignment 4: build the synthetic product path

Use manual mode. This assignment builds the visible result with synthetic input. It does not call a model or live connector.

> Read the accepted docs/plan.md, docs/spec.md, and reference/dia-to-bree.md. Write test/render.test.ts first and run npm run test:render to show the expected red failure. Build src/render.ts and a sample-only src/main.ts. Render the complete DailyBrief schema as one readable HTML page with title, date, greeting, summary, move-work-forward action, top todos, new updates, your day, sources, and visible OPEN states. Escape long untrusted text and source labels. Run npm run test:render and npm run brief:sample. Prove that out/latest.html contains every section, source provenance, and no invented fact. Ask me for one small house-style change, add its failing test first, make it pass, regenerate the page, show the proof and diff, then stop.

```text
/verify-this Prove that npm run brief:sample writes out/latest.html from synthetic data. Show the exit code, output path, source label, and unavailable-source behavior.
```

Optional, when Impeccable is available:

```text
/impeccable critique Bree's brief view. Read only. Use the accepted specification and existing visual system. Report the three most important hierarchy or accessibility issues, then stop for approval.
```

Optional, after the complete brief passes: follow the decorative image guidance in `reference/dia-to-bree.md`. Ask Claude to add the fixed public photo, useful alt text, and an offline-safe fallback. Treat the image as decoration, not business evidence.

Done when you open `out/latest.html` and trace its decision back to the synthetic input.

## Assignment 5: connect the existing read-only Jira source

Use `/mcp` to inspect the existing approved connection. Do not install a connector or create a token. Keep the synthetic route for tests.

Create the ignored local configuration. Set its three approval flags to `true` only after the connector, read-only tool status, and model route are confirmed. Add the chosen user, decision, and exact Jira read-tool name shown by `/mcp`:

```bash
cp .bree.example.json .bree.local.json
```

> Read the accepted design, plan, DailyBrief contract, AGENTS.md, and the provided Bree config example. Use /mcp to inspect the existing organisation-approved Jira connection and identify one exact read-only tool for my own permitted work items. Do not install a connector or create a token. Write focused tests first for the live configuration boundary, exact allowed tool, schema validation, and private output path. Build the smallest Claude Agent SDK route through the organisation-approved model provider. Permit only that Jira read tool, map available source data into the complete DailyBrief schema, leave unavailable sections OPEN, and reject unvalidated output. Live source IDs must be exact Jira issue keys extracted from the successful structured tool result; reject invented or transformed IDs and unstructured output. The host application may write only the validated HTML artifact to ~/.bree/briefs/YYYY-MM-DD.html with private permissions. Add npm run live:check as the preflight and npm run brief:live as the explicit live run. Deny every other agent tool. Never store raw connector output or expose credentials, customer data, or work email. Run the synthetic tests and live:check, show the SDK boundary and host write boundary, show the diff, and stop before the live run.

Run the preflight:

```bash
npm run live:check
```

If it reports `OPEN`, record the missing approval or configuration. When it passes, run this privately and do not record the artifact contents:

```bash
npm run brief:live
```

Done when synthetic tests pass, the SDK boundary allows exactly one tool, and the dated private HTML status is honestly recorded as `PASS` or `OPEN`.

## Assignment 6: make the proof repeatable

Use synthetic data for recorded evidence. Treat live connector verification as a separate private check.

> Read docs/spec.md, the synthetic evaluation fixtures, package.json, and the current application routes. Write test/eval.test.ts for a complete brief, missing evidence with OPEN items, and conflicting evidence with CONFLICT items. Run npm run eval and fix only mismatches with the accepted spec. Then use the project-local create-verification-skill to generate .claude/skills/verify-bree/ from commands, routes, selectors, and outputs that exist in this repository. Its feature map must cover every synthetic HTML section, long-text escaping, resolved sourceIds, OPEN and CONFLICT behavior, the dated private artifact path, and the private live preflight without storing live contents. Run one complete synthetic user journey through launch, doctor, drive, evidence, and cleanup. Then run npm run typecheck, npm test, npm run eval, npm run brief:sample, and npm run live:check. Record real commands and exit codes in docs/evidence.md. Propose one organisation-approved local daily trigger with its command, working directory, logs, rollback, and owner, but do not install or activate a scheduler. Mark the live connector and dated artifact OPEN unless you privately ran them with approved access. Show the evidence diff and stop for approval. Do not publish anything.

```text
/create-verification-skill Inspect this repository and create .claude/skills/verify-bree/. Use only commands, routes, and harnesses that exist here. Map the synthetic brief, unavailable-source result, and private live preflight. Never connect an account, write through a connector, or store live work data in evidence. Run one synthetic journey end to end. Keep the skill DRAFT if any launch, doctor, drive, evidence, or cleanup step is unproven.
```

Commit only the accepted result. Test the previous and current commits in temporary worktrees:

```bash
git worktree add --detach ../daily-brief-previous HEAD^
git worktree add --detach ../daily-brief-current HEAD
(cd ../daily-brief-previous && npm ci && npm run typecheck && npm test && npm run brief:sample)
(cd ../daily-brief-current && npm ci && npm run typecheck && npm test && npm run eval && npm run brief:sample)
git worktree remove ../daily-brief-previous
git worktree remove ../daily-brief-current
git worktree list
```

Done when both synthetic versions run, one scripted journey preserves its evidence, and live proof remains separate.

## Close the loop

Choose one result you observed. Add `## Next iteration` to `intent.md` with the command, one safe output signal, remaining risk, one improvement, and one check. Never copy live source content into the file.

## Assignment 7: build your own small agent

There is no prescribed implementation prompt. Apply the same loop to one new personal use case.

Choose one mission:

- Jira: find today's top blocker.
- GitLab: find one merge request that needs review.
- Confluence: retrieve one agreed decision with context.
- Mock Outlook: summarise one synthetic work request from `sample/outlook-email.sample.json`.

Start with one approved source and one owner-confirmed read-only tool. Add another source only after the first mission is proven.

The mock Outlook mission is different. It uses the synthetic fixture only. It does not connect Outlook or read work email.

1. Choose one user, one decision, one mission, and one organisation-approved read-only source.
2. Define a synthetic fixture with the same shape for repeatable tests.
3. Write the intent, contract, design, and visual plan.
4. Write a red test before implementation.
5. Build the smallest bounded SDK route.
6. Prove one synthetic journey and record live access separately.
7. Inspect the diff and keep all live data outside the repository.

## Continue in a fresh session

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the accepted artifacts, files, decisions, permission status, and next proof. Do not include live data or credentials.
```
