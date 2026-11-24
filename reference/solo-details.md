# SOLO details

The prompts in `SOLO.md` use the six lines of Day 1: Goal, Context, Constraints, Done when, Output, Check. They are short.
This file holds the exact requirements of each part. Claude Code reads the section that the prompt names.

The sentences below are the requirements of the long prompts that were used until November 2026.

## A1 Part 1

- Read intent.md, progress.md, and sample/calendar-item.sample.json.
- Interview me one question at a time until I choose one user and one morning decision.
- After I approve the wording, update the User and decision section of intent.md and the matching synthetic fixture fields.
- Show the diff and stop.

## A1 Part 2

- Read the accepted intent.md and sample/calendar-item.sample.json.
- Write test/mini.test.ts first for one exact line in the form `<start> <title> — decide: <decision>`.
- Run npm run test:mini and show the expected red failure.
- Build src/mini.ts.
- Run npm run test:mini and npm run mini.
- Show the green proof and diff, then stop.
- State clearly that this synthetic line is a learning slice, not the finished agent.

## A2 Part 1

- Read the accepted intent.md, reference/dia-to-bree.md, reference/brief-example.md, and sample/brief.sample.json.
- Reverse engineer only the safe structural pattern: title, date, greeting, summary, one move-work-forward action, top todos, new updates, your day, and sources.
- Draft docs/spec.md with the complete DailyBrief schema.
- Title and greeting are strings; date uses YYYY-MM-DD.
- Summary and moveWorkForward are single items.
- TopTodos, newUpdates, and yourDay are non-empty item arrays.
- Every item has status READY, OPEN, or CONFLICT, text, and sourceIds.
- READY and CONFLICT items have at least one source ID; OPEN may have none.
- Every sourceId resolves in sources, whose entries have id and label.
- OPEN text starts OPEN; CONFLICT text starts CONFLICT.
- Stop for my approval.

## A2 Part 2

- After I approve docs/spec.md, write test/schema.test.ts first and run npm run test:schema to show the expected red failure.
- Build src/brief.ts and sample/brief.sample.json until the full valid sample passes.
- Add one invalid synthetic sample and prove the schema rejects it.
- Show the red and green evidence and the diff, then stop.
- Do not build the renderer, SDK route, or connector.

## A3

- In plan mode, read the accepted intent.md, docs/spec.md, reference/dia-to-bree.md, AGENTS.md, and the current diff.
- Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md for the smallest complete Bree route: synthetic fixtures → DailyBrief schema → full HTML renderer, plus one approved read-only MCP tool → Claude Agent SDK → the same schema → dated private HTML under ~/.bree/briefs/.
- Give every plan step exact root-relative paths, one proof command, and a reversible rollback.
- Include OPEN sections, host-owned file writing, human approval points, and separate synthetic proof from live source proof.
- Do not edit files or build.
- Stop for my approval.
- After I approve the plan, tell me to return to manual mode.
- Save only the accepted design documents, show the diff, and stop.

## A4 Part 1

- Read the accepted docs/plan.md, docs/spec.md, and reference/dia-to-bree.md.
- Write test/render.test.ts first and run npm run test:render to show the expected red failure.
- Build src/render.ts and a sample-only src/main.ts. npm run brief:sample prints the output path and one source line, for example `source: sample/brief.sample.json (synthetic)`.
- Render the complete DailyBrief schema as one readable HTML page with title, date, greeting, summary, move-work-forward action, top todos, new updates, your day, sources, and visible OPEN states.
- Include the fixed public illustration https://picsum.photos/seed/bree-morning/1200/400 with empty alt text, referrerpolicy="no-referrer", and stable visible fallback text.
- Keep it outside the DailyBrief contract, put no work data in its URL, and keep the brief usable when the image fails.
- Escape long untrusted text and source labels.
- Run npm run test:render and npm run brief:sample.
- Prove that out/latest.html contains every section, source provenance, and no invented fact.
- Show the proof and diff, then stop.

## A4 Part 2

- Ask me for one small house-style change.
- Write its failing renderer test first.
- Make the smallest change that passes it.
- Run npm run test:render and npm run brief:sample again.
- Open out/latest.html.
- Show the changed detail and confirm the complete brief still renders.
- Show the proof and diff, then stop.

## A5 Part 1

- Read the accepted design, plan, DailyBrief contract, AGENTS.md, and the Bree config example.
- The participant inspected the existing organisation-approved Jira connection with /mcp, and names one exact read-only tool for their own permitted work items. Ask for that name. If the participant says that it is OPEN, use a mocked tool in the tests and keep live proof OPEN.
- Do not install a connector or create a token.
- Write focused tests first for the live configuration boundary, exact allowed tool, schema validation, and private output path.
- Include rejection cases for a failed or unstructured tool result, an unknown source ID, and any unexpected tool.
- Show the expected red failure and stop for my approval.

## A5 Part 2

- After I approve the tests and boundary, build the smallest Claude Agent SDK route through the approved model provider.
- Read only the selected server definition from the existing Jira-only config at AETHERLINK_JIRA_MCP_CONFIG and pass it explicitly as the SDK mcpServers option; a new SDK process does not inherit the CLI session configuration.
- Permit only the chosen Jira read tool.
- Set built-in tools to none, enable strict MCP config, and deny every other request in canUseTool.
- Map available data into the complete DailyBrief schema.
- Keep unavailable sections OPEN and reject unvalidated output.
- Accept only exact Jira keys from the successful structured tool result as live source IDs.
- Let only the host write validated HTML to ~/.bree/briefs/YYYY-MM-DD.html with private permissions.
- Add npm run live:check and npm run brief:live.
- npm run live:check contacts nothing. It prints READY or OPEN with the reasons, and exits with code 0 for READY and code 3 for OPEN.
- Never store raw connector output or expose credentials, customer data, or work email.
- Run the synthetic tests and live:check.
- Show the boundaries and diff, then stop before the live run.

## A6 Part 1

- Read docs/spec.md, the synthetic evaluation fixtures, package.json, and the current application routes.
- Write test/eval.test.ts for a complete brief, missing evidence with OPEN items, and conflicting evidence with CONFLICT items.
- Run npm run eval.
- Fix only mismatches with the accepted spec.
- Show the three outcomes and diff, then stop.

## A6 Part 2

- Read .claude/skills/verify-bree/.
- Confirm that it covers every synthetic HTML section, long-text escaping, resolved sourceIds, OPEN and CONFLICT behavior, the dated private artifact path, and the private live preflight without storing live contents.
- Add what is missing.
- Run npm run typecheck, npm test, npm run eval, npm run brief:sample, and npm run live:check.
- Record real commands and exit codes in docs/evidence.md.
- Show the evidence diff and stop.

## A6 Part 3

- Propose one organisation-approved local daily trigger with its command, working directory, logs, rollback, and owner, but do not install or activate a scheduler.
- Mark the live connector and dated artifact OPEN unless I tell you that I ran them with approved access.
- Show the evidence diff and stop for approval.
- Do not publish anything.
