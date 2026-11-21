# Bree: your personal Daily Brief agent

Bree prepares a private morning brief from your own permitted work items through the existing, organisation-approved Jira MCP connection. You build it through the full local AI-native SDLC with Claude Code and the Claude Agent SDK.

The lesson starts with synthetic data because tests, recordings, and shared evidence must be repeatable and contain no work data. Assignment 5 uses the existing approved Jira MCP connection. Assignment 6 proves the user path and keeps live verification separate.

## What you build

| Assignment | Result | Proof |
| --- | --- | --- |
| A1 | One user, one decision, one synthetic line | `npm run test:mini && npm run mini` |
| A2 | Accepted brief contract with provenance, `OPEN`, and `CONFLICT` | `npm run test:schema` |
| A3 | Accepted design, decision, plan, and offline visual plan | Human review plus `/visual-plan` |
| A4 | First sourced decision view from synthetic input | `npm run test:render && npm run brief:sample` |
| A5 | One bounded Agent SDK route to one approved read-only MCP tool | `npm run test:live && npm run live:check` |
| A6 | Three evaluations, a generated verification skill, and local recovery | Full local suite plus one synthetic journey |
| A7 | One personal mission using Jira, GitLab, Confluence, or a mock Outlook email | Participant-defined proof |

Every phase leaves something another person can inspect. Missing facts stay `OPEN`. Conflicting facts stay `CONFLICT`.

## Start

Requirements are Node.js 20 or newer, Git, Claude Code, the existing Jira MCP connection, and the approved Anthropic via Vertex route.

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
npm ci
claude --setting-sources project,user --no-chrome
```

Read [SOLO.md](SOLO.md). Complete one assignment at a time.

## Permission boundary

- Use only the existing approved Jira MCP connection and your own permitted work items.
- Use only the organisation-approved Anthropic via Vertex model route already configured for the workshop.
- Do not connect work email. Use only sanitised, non-sensitive pasted text when the trainer explicitly asks for it.
- Keep Bree private. Do not publish live output.
- Do not store customer data, work data, credentials, connector responses, or live briefs in this repository.
- Keep the live tool read-only. Bree cannot send messages, change tickets, write files, or start a shell.
- Stop when approval or source access is unclear.

Approval of a connector does not automatically approve every model account. Local execution also does not mean that model processing stays on the laptop.

## Configure the live route

A4 works without an account or network call. In A5, inspect the existing approved connection with `/mcp`. Do not install a connector or create a token.

```bash
cp .bree.example.json .bree.local.json
```

Edit the ignored local file with the exact Jira read tool shown by `/mcp`, plus the user and decision. Set all three approval flags to `true` only after the connector, tool-owner read-only status, and model route are confirmed. Claude Code inherits the existing approved MCP connection. Never create or store a token for this workshop.

```bash
npm run live:check
```

This is a local preflight. It does not contact the source. A successful preflight still leaves authentication and source access unproven.

Run the real route privately:

```bash
npm run brief:live
```

The application prints the live result to the terminal and does not write a brief file. The configured client and provider follow company retention policy. Do not record or commit the result.

## Project skills

The repository includes the core workshop skills:

- `/visual-plan` creates the A3 offline review artifact.
- `/create-verification-skill` generates the A6 project-specific `verify-bree` skill.
- `/grilling`, `/eli5`, `/verify-this`, `/show-me`, and `/handoff` support focused steps.

Impeccable, Break UI, and other design skills are optional. They do not replace the accepted contract, tests, or real connector evidence.

The optional A7 Outlook mission uses only `sample/outlook-email.sample.json`. It simulates an email and never connects to Outlook or work email.

## Files

- `SOLO.md` is the participant route and canonical prompt source.
- `docs/prompts.md` contains the same six main prompts.
- `intent.md` and `progress.md` record the accepted outcome and current evidence.
- `docs/` contains the contract, design, plan, decision, evidence, and gate templates.
- `sample/` contains synthetic data only.
- `src/live.ts` owns the private Agent SDK route after A5.

Open `course/index.html` for the interactive explanation. Edit modules under `course/modules/`, then rebuild with `cd course && bash build.sh`.

## Official references

- [Claude Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Claude Code MCP connections](https://code.claude.com/docs/en/mcp)
- [Claude Code data usage](https://code.claude.com/docs/en/data-usage)
