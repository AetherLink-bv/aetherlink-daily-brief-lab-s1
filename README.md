# Bree: build your day-start agent

It is 08:30. Your stand-up starts at 09:00. You need one reliable view of the work that needs your attention.

Bree turns your permitted work items into a private Daily Brief. You build Bree through the AI-native SDLC with Claude Code and the Claude Agent SDK. At every step, you create something visible, review it, and prove what it does.

The lesson starts with synthetic data because tests, recordings, and shared evidence must be repeatable and contain no work data. Assignment 5 uses the existing approved Jira MCP connection. Assignment 6 proves the user path and keeps live verification separate.

## What you build

| Assignment | Result | Proof |
| --- | --- | --- |
| A1 | One user, one decision, one synthetic line | `npm run test:mini && npm run mini` |
| A2 | Reverse-engineered full Daily Brief contract with provenance, `OPEN`, and `CONFLICT` | `npm run test:schema` |
| A3 | Accepted design, decision, plan, and offline visual plan | Human review plus `/visual-plan` |
| A4 | Complete synthetic Daily Brief HTML | `npm run test:render && npm run brief:sample` |
| A5 | One bounded Agent SDK route to a dated private HTML artifact | `npm run test:live && npm run live:check` |
| A6 | Full-page evaluations, verification skill, recovery, and trigger proposal | Full local suite plus one synthetic journey |
| A7 | One personal mission using Jira, GitLab, Confluence, or a mock Outlook email | Participant-defined proof |

Every phase leaves something another person can inspect. Missing evidence stays `OPEN`. Conflicting evidence stays `CONFLICT`.

After A6, close the Maintain loop in `intent.md`. Then complete A7 with a mission you choose. The core lesson ends there.

## Optional ending: let Bree read the brief aloud

After the core A7 result is accepted, you may complete the [optional ElevenLabs voice extension](docs/voice-extension.md). It uses only synthetic data and your personal ElevenLabs account. It is not required to complete Day 5.

Keep the key in the ignored `.env.local` file. Never paste it into chat, share a trainer key, or send work data to text-to-speech.

## Start

Requirements are Node.js 20.12 or newer, Git, Claude Code, the existing Jira MCP connection, and the approved Anthropic via Vertex route.

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
npm ci
claude --setting-sources project,user --strict-mcp-config --no-chrome
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

The host application writes only validated HTML to `~/.bree/briefs/YYYY-MM-DD.html` with private permissions. It does not write raw connector output. The configured client and provider follow company retention policy. Do not record or commit live contents.

A6 may propose an organisation-approved local daily trigger. The workshop does not install or activate a scheduler. Automatic daily execution begins only after the participant approves and installs their own trigger.

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
- `reference/dia-to-bree.md` maps the safe Dia-style structure to the `DailyBrief` schema and checks.

Open `course/index.html` for the interactive explanation. Edit modules under `course/modules/`, then rebuild with `cd course && bash build.sh`.

## Official references

- [Claude Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Claude Code MCP connections](https://code.claude.com/docs/en/mcp)
- [Claude Code data usage](https://code.claude.com/docs/en/data-usage)
