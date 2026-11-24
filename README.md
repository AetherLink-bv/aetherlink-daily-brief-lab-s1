# Bree: build your day-start agent

It is 08:30. Your stand-up starts at 09:00. You need one reliable view of the work that needs your attention.

Bree turns your permitted work items into a private Daily Brief. You build Bree through the AI-native SDLC with Claude Code and the Claude Agent SDK. At every step, you create something visible, review it, and prove what it does.

The lesson starts with synthetic data because tests, recordings, and shared evidence must be repeatable and contain no work data. Assignment 5 uses the existing approved Jira MCP connection. Assignment 6 proves the user path and keeps live verification separate.

When a named command runs, preserve its synthetic red and green output with the actual exit codes. Never reconstruct historical raw logs or record live connector contents.

## What you build

| Assignment | Result | Proof |
| --- | --- | --- |
| A1 | One user, one decision, one synthetic line | `npm run test:mini && npm run mini` |
| A2 | Reverse-engineered full Daily Brief contract with provenance, `OPEN`, and `CONFLICT` | `npm run test:schema` |
| A3 | Accepted design, decision, plan, and offline visual plan | Human review plus `/visual-plan` |
| A4 | Complete synthetic Daily Brief HTML with a fixed public illustration and text fallback | `npm run test:render && npm run brief:sample` |
| A5 | One bounded Agent SDK route to a dated private HTML artifact | `npm run test:live && npm run live:check` |
| A6 | Full-page evaluations, verification skill, recovery, and trigger proposal | Full local suite plus one synthetic journey |
| A7 | One personal mission using Jira, GitLab, Confluence, or a mock Outlook email | Participant-defined proof |

Every phase leaves something another person can inspect. Missing evidence stays `OPEN`. Conflicting evidence stays `CONFLICT`.

A6 parses and renders `sample/eval/ordinary-brief.json`, `missing-brief.json`, and `conflict-brief.json` through the real schema and renderer. The legacy `ordinary.json`, `missing.json`, and `conflict.json` fixtures remain mini-calendar inputs only.

After A6, close the Maintain loop in `intent.md`. Then complete A7 with a mission you choose. The core lesson ends there.

## Optional ending: let Bree read the brief aloud

After the core A7 result is accepted, you may complete the [optional ElevenLabs voice extension](docs/voice-extension.md). It uses only synthetic data and your personal ElevenLabs account. It is not required to complete Day 5.

Keep the key in the ignored `.env.local` file. Never paste it into chat, share a trainer key, or send work data to text-to-speech.

## Start

Requirements are Node.js 20.12 or newer, Git, Claude Code, the existing Jira MCP connection, and the approved Anthropic via Vertex route.

The clone makes a new folder, `aetherlink-daily-brief-lab-s1`. That is the project folder, also called the repository root. After the `cd` line you are in that folder. Run every later command from there.

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
npm ci
claude --setting-sources project,user --permission-mode default --strict-mcp-config --no-chrome
```

The `allowScripts` policy permits only the locked `esbuild` install script and denies the optional `fsevents` script. Review dependency changes before expanding it. See [npm install scripts](https://docs.npmjs.com/cli/commands/npm-install-scripts/).

This starts Claude Code in Manual mode for A1–A4 and loads no MCP server. Local settings are excluded. The approved Vertex route must already be available through the organisation-managed environment or user settings. Confirm it with `/status` before the first prompt. If it is unavailable, keep model-assisted work `OPEN`; manual synthetic checks can continue.

Read [SOLO.md](SOLO.md). Complete one assignment at a time.

## Permission boundary

- Use only the existing approved Jira MCP connection and your own permitted work items.
- Use only the organisation-approved Anthropic via Vertex model route already configured for this session.
- Do not connect work email. Use only sanitised, non-sensitive pasted text when the trainer explicitly asks for it.
- Keep Bree private. Do not publish live output.
- Do not store customer data, work data, credentials, connector responses, or live briefs in this repository.
- Keep the live tool read-only. Bree cannot send messages, change tickets, write files, or start a shell.
- Stop when approval or source access is unclear.

Approval of a connector does not automatically approve every model account. Local execution also does not mean that model processing stays on the laptop.

## Configure the live route

A4 works without an account or network call. Before A5, close the first Claude Code session. Ask the trainer to make `AETHERLINK_JIRA_MCP_CONFIG` available privately as the path to an existing approved Jira-only MCP configuration. Do not create a connector or copy the configuration into the repository. Verify the file before the guarded restart:

```bash
test -n "${AETHERLINK_JIRA_MCP_CONFIG:-}" &&
  test -f "$AETHERLINK_JIRA_MCP_CONFIG" &&
  claude --setting-sources project,user --permission-mode default --strict-mcp-config --mcp-config "$AETHERLINK_JIRA_MCP_CONFIG" --no-chrome
```

The two `test` checks print nothing when they pass. If Claude Code does not start and you are back at the terminal prompt, a check failed.

Run `/status` to confirm the approved Vertex route. Then run `/mcp` and inspect the existing approved Jira connection. If either check fails, keep live proof `OPEN`. Do not install a connector or create a token.

```bash
test -f .bree.local.json || cp .bree.example.json .bree.local.json
```

Edit the ignored local file with the exact Jira read tool shown by `/mcp`, plus the user and decision. Set all three approval flags to `true` only after the connector, tool-owner read-only status, and model route are confirmed. `.bree.local.json` stores runtime approvals; it is not MCP server configuration. Never create or store a token for this session.

The Agent SDK starts a separate process. `src/live.ts` must read only the selected server definition from `AETHERLINK_JIRA_MCP_CONFIG` and pass it through the SDK `mcpServers` option. It must set built-in tools to none, enable strict MCP config, and deny every tool except the exact approved Jira tool in `canUseTool`.

```bash
npm run live:check
```

This is a local preflight. It does not contact the source. A successful preflight still leaves authentication and source access unproven.

Run the real route privately:

```bash
npm run brief:live
```

The host application writes only validated HTML to `~/.bree/briefs/YYYY-MM-DD.html` with private permissions. It does not write raw connector output. The configured client and provider follow company retention policy. Do not record or commit live contents.

A6 may propose an organisation-approved local daily trigger. This session does not install or activate a scheduler. Automatic daily execution begins only after the participant approves and installs their own trigger.

## Project skills

The repository includes the core skills for this session:

- `/visual-plan` creates the A3 offline review artifact.
- `/create-verification-skill` generates the A6 project-specific `verify-bree` skill.
- `/grilling`, `/eli5`, `/verify-this`, `/show-me`, and `/handoff` support focused steps.

Impeccable, Break UI, and other design skills are optional. They do not replace the accepted contract, tests, or real connector evidence.

The optional A7 Outlook mission uses only `sample/outlook-email.sample.json`. It simulates an email and never connects to Outlook or work email. Put its focused test in `test/tool.test.ts`, put the implementation in `src/outlook.ts` or your chosen entry file, and run `npm run test:tool`.

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
