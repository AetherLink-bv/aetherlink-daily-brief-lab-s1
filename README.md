# Bree: build your day-start agent

It is 08:30. Your stand-up starts at 09:00. You need one reliable view of the work that needs your attention.

Bree turns your permitted work items into a private Daily Brief. You build Bree through the AI-native SDLC with Claude Code and the Claude Agent SDK. At every step, you create something visible, review it, and prove what it does.

The lesson starts with synthetic data because tests, recordings, and shared evidence must be repeatable and contain no work data. Assignment 5 connects Jira for this folder and reads your own work items. Assignment 6 proves the user path and keeps live verification separate.

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

Install Node.js 20.12 or newer, Git and Claude Code. In Assignment 5, a Jira login is needed for the private run in Part 3. The earlier parts use mocked tools for testing.

The clone makes a new folder, `aetherlink-daily-brief-lab-s1`. That is the project folder, also called the repository root. After the `cd` line you are in that folder. Run every later command from there.

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
npm ci
claude --permission-mode default
```

The `allowScripts` policy permits only the locked `esbuild` install script and denies the optional `fsevents` script. Review dependency changes before expanding it. See [npm install scripts](https://docs.npmjs.com/cli/commands/npm-install-scripts/).

This starts Claude Code in manual mode: it asks before it changes a file or runs a command.

Read [SOLO.md](SOLO.md). Complete one assignment at a time.

## Permission boundary

- For Bree in Assignment 5, use the Jira server you connected and your own permitted work items.
- Do not connect work email. Use only sanitised, non-sensitive pasted text when the trainer explicitly asks for it.
- Keep Bree private. Do not publish live output.
- Do not store customer data, work data, credentials, connector responses, or live briefs in this repository.
- Keep the live tool read-only. Bree cannot send messages, change tickets, write files, or start a shell.
- Stop when approval or source access is unclear.

Local execution does not mean that model processing stays on the laptop.

## Configure the live route

Assignment 4 uses sample data. Once dependencies are installed, the sample command generates local HTML. Opening the page may fetch its illustration. The build steps use Claude Code.

Before Assignment 5, close the first Claude Code session with `/exit`. To use live Jira, connect it once in this project folder:

```bash
claude mcp add --transport http jira https://mcpjira.kazan.ai.worldline-solutions.com/mcp
```

If you added Jira, the server is available in this folder. Without Jira access, continue with mocked tests and keep live proof `OPEN`. In either case, start Claude Code again:

```bash
claude --permission-mode default
```

Type `/mcp`, choose `jira`, log in and open its tools. Claude Code marks which tools only read. No mark? Treat the tool as one that can change something. When Claude Code asks for permission, approve only that one read call. Decline any request to allow future calls automatically. Note the exact name of the one read tool for your own work items, in the form `mcp__jira__<tool>`. No Jira access? Keep live proof `OPEN`: the synthetic route keeps working. Do not create a token or copy any configuration into the repository.

```bash
test -f .bree.local.json || cp .bree.example.json .bree.local.json
```

Edit the ignored local file: put in the exact Jira read tool shown by `/mcp`, plus the user and decision. Never create or store a token for this session.

The Agent SDK starts a separate process. In `src/live.ts`, `settingSources: ['local']` selects local SDK settings. Other servers may still be visible to the SDK. Bree disables built-in tools, allows only the exact approved Jira tool, and denies every other tool in `canUseTool` and in a `PreToolUse` hook. The hook also stops a tool that a local allow rule would let through.

```bash
npm run live:check
```

This check runs offline. `READY` means the file names the jira server, a user, a decision and a tool in the expected format. It cannot confirm that the tool exists, only reads, or is accessible to your account. If you cannot confirm the read-only mark in `/mcp`, keep the placeholder and record `OPEN`.

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
- `docs/prompts.md` contains the same twelve prompt parts.
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
