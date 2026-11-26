# Bree: build your day-start agent

It is 08:30. Your stand-up starts at 09:00. You need one reliable view of the work that needs your attention.

Bree turns your permitted work items into a private Daily Brief. You build Bree through the AI-native SDLC with Claude Code and the Claude Agent SDK. At every step, you create something visible, review it, and prove what it does.

The lesson starts with synthetic data because tests, recordings, and shared evidence must be repeatable and contain no work data. Assignment 5 tests what Bree may read using sample data. Reading your own Jira items is optional. Assignment 6 proves the user path and keeps live verification separate.

When a named command runs, preserve its synthetic red and green output with the actual exit codes. Never reconstruct historical raw logs or record live connector contents.

## What you build

| Assignment | Result | Proof |
| --- | --- | --- |
| A1 | One user, one decision, one synthetic line | `npm run test:mini`, then `npm run mini` |
| A2 | Reverse-engineered full Daily Brief contract with provenance, `OPEN`, and `CONFLICT` | `npm run test:schema` |
| A3 | Accepted design, decision, plan, and offline visual plan | Human review plus `/visual-plan` |
| A4 | Complete synthetic Daily Brief HTML with a fixed public illustration and text fallback | `npm run test:render`, then `npm run brief:sample` |
| A5 | One tool allowed by the Agent SDK, tested with sample data | `npm run test:live`, then `npm run live:check` |
| A6 | Full-page evaluations, verification skill, recovery, and trigger proposal | Full local suite plus one synthetic journey |
| A7 | One personal mission using Jira, GitLab, Confluence, or a mock Outlook email | Participant-defined proof |

Every phase leaves something another person can inspect. Missing evidence stays `OPEN`. Conflicting evidence stays `CONFLICT`.

A6 parses and renders `sample/eval/ordinary-brief.json`, `missing-brief.json`, and `conflict-brief.json` through the real schema and renderer. The legacy `ordinary.json`, `missing.json`, and `conflict.json` fixtures remain mini-calendar inputs only.

After A6, close the Maintain loop in `intent.md`. Then complete A7 with a mission you choose. The core lesson ends there.

## Optional ending: let Bree read the brief aloud

After the core A7 result is accepted, you may complete the [optional ElevenLabs voice extension](docs/voice-extension.md). It uses only synthetic data and your personal ElevenLabs account. It is not required to complete Day 5.

Keep the key in the ignored `.env.local` file. Never paste it into chat, share a trainer key, or send work data to text-to-speech.

## Start

Use Windows PowerShell 5.1 or macOS Terminal. Enter one command at a time. Wait for it to finish before entering the next. Stop on an unexpected error. If PowerShell blocks `npm.ps1`, type `npm.cmd` wherever this guide says `npm`. Keep the organisation’s execution policy. For the exit code, enter `$LASTEXITCODE` in PowerShell or `echo $?` on macOS immediately after the command.

Install Node.js 20.12 or newer, Git and Claude Code. In Assignment 5, a Jira login is needed for the private run in Part 3. The earlier parts use mocked tools for testing.

The clone makes a new folder, `aetherlink-daily-brief-lab-s1`. That is the project folder, also called the repository root. After the `cd` line you are in that folder. Run every later command from there.

```text
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
npm ci
claude --permission-mode default
```

The `allowScripts` policy permits only the locked `esbuild` install script and denies the optional `fsevents` script. Review dependency changes before expanding it. See [npm install scripts](https://docs.npmjs.com/cli/commands/npm-install-scripts/).

Claude Code starts in manual mode and asks before edits or commands.

Use your existing organisation sign-in for Claude Code. If it asks for a personal API key, cancel the prompt. If your approved sign-in is unavailable, run the local checks for code you already have or work with a partner. Keep anything you could not verify yourself `OPEN`.

Read [SOLO.md](SOLO.md). Complete one assignment at a time.

## Permission boundary

- For Bree in Assignment 5, use the Jira server you connected and your own permitted work items.
- Do not connect work email. Use only sanitised, non-sensitive pasted text when the trainer explicitly asks for it.
- Keep Bree private. Do not publish live output.
- Do not store customer data, work data, credentials, connector responses, or live briefs in this repository.
- Keep the live tool read-only. Bree cannot send messages, change tickets, write files, or start a shell.
- When approval or access is unclear, keep the live result `OPEN` and continue with sample data.

Local execution does not mean that model processing stays on the laptop.

## Configure the live route

Assignment 4 uses sample data. Once dependencies are installed, the sample command generates local HTML. Opening the page may fetch its illustration. The build steps use Claude Code.

**Sample route.** Keep your current Claude Code session. Skip Jira setup and answer `OPEN` when Claude asks for the tool. Everyone uses a made-up Jira item in the tests.

**Optional Jira setup.** With approved access, check `/mcp` in your existing session. If Jira is already listed, keep that session. Only if you need to add Jira, run this once in Terminal from the project folder:

```text
claude mcp add --transport http jira https://mcpjira.kazan.ai.worldline-solutions.com/mcp
```

After adding the server, type `/exit` in Claude Code. Start it again from the same folder to load the new server:

```text
claude --permission-mode default
```

In `/mcp`, select `jira` and sign in privately. Use the exact name of one tool marked read-only for your own permitted items. Approve only that read call. Decline requests to allow future calls automatically. If the mark or access is unclear, use the sample route.

```text
npm run config:init
```

Keep the placeholder if you have no verified read-only tool. Otherwise, enter its exact name from `/mcp`, the user and the decision in the ignored local file. Never create or store a token for this session.

For the Worldline SDK run, set `settingSources: ['user', 'local']` in `src/live.ts`. The organisation login uses the user settings. Load only an organisation-approved profile. Its user settings can also supply hooks, environment variables and permission rules. Other servers may be visible.

Keep `tools: []` and put only the exact read-only Jira tool in `allowedTools`. Both `canUseTool` and `PreToolUse` must deny every other tool. The hook must still deny an unexpected tool allowed by a settings rule. Use the same settings for an optional A7 model run. A connected mission may use its one approved read-only tool. Mock Outlook permits no tools and connects no server.

### Check the code and the settings

After A5 Part 2, run these commands separately in Terminal from the project folder. Keep Claude Code open.

```text
npm run test:live
npm run live:check
```

The first command runs the synthetic tests in `test/live.test.ts`. The second reads the local settings. With the example tool it prints `OPEN` (exit 3). Valid fields give `READY` (exit 0). Neither command needs a model login or contacts Jira. Verify the actual tool and its read-only mark separately.

If either check asks for an API key, cancel it. In Terminal, inspect what the scripts run:

```text
npm pkg get scripts.test:live scripts.live:check
```

Expect `tsx --test test/live.test.ts` and `tsx src/live.ts --check`. In `src/live.ts`, the `--check` path must finish before model authentication or SDK `query()`. Importing the module in a test must not start the live command. Check that the tests use a made-up tool. Fix the offline path and rerun the check. Keep the result `OPEN` until you verify it yourself.

### Optional private run

Without explicit approval, a verified read-only tool or a local `READY` result, record `source OPEN` and `page OPEN`. Continue with `out/latest.html` in Assignment 6.

<details>
<summary>Show the private command</summary>

Run this yourself only with all three checks and existing, approved model and Jira access. If either service asks for a personal key, cancel and use the sample route.

```text
npm run brief:live
```

</details>

Open the exact dated path printed by the private run in File Explorer or Finder. The folder `.bree/briefs` is inside your user profile (`%USERPROFILE%` in File Explorer) or your home directory on macOS.

On Windows the private run first checks who owns the output folder and any existing page, and who can access them. It accepts only your user account, SYSTEM and local Administrators. If it cannot verify that boundary, it returns `OPEN` (exit 3) before calling the model. Continue with `npm run brief:sample`. Leave device policy unchanged.

The host writes only validated HTML. The configured client and provider follow company retention policy. Do not record or commit live contents.

A6 may propose an organisation-approved local daily trigger. This session does not install or activate a scheduler. Automatic daily execution begins only after the participant approves and installs their own trigger.

## Project skills

The repository includes the core skills for this session:

- `/visual-plan` creates the A3 offline review artifact.
- `/create-verification-skill` generates the A6 project-specific `verify-bree` skill.
- `/grilling`, `/eli5`, `/verify-this`, `/show-me`, and `/handoff` support focused steps.

Impeccable, Break UI, and other design skills are optional. They do not replace the accepted contract, tests, or real connector evidence.

The optional A7 Outlook mission uses only `sample/outlook-email.sample.json`. Its test runs offline. An optional model run sends only the sample to the approved model provider. Neither route connects to Outlook or work email. Put its focused test in `test/tool.test.ts`, put the implementation in `src/outlook.ts` or your chosen entry file, and run `npm run test:tool`.

## Files

- `SOLO.md` is the participant route and canonical prompt source.
- `docs/prompts.md` contains the same twelve prompt parts.
- `intent.md` and `progress.md` record the accepted outcome and current evidence.
- `docs/` contains the contract, design, plan, decision, evidence, and gate templates.
- `sample/` contains synthetic data only.
- `src/live.ts` owns the private Agent SDK route after A5.
- `reference/dia-to-bree.md` maps the safe Dia-style structure to the `DailyBrief` schema and checks.

Open `course/index.html` from File Explorer or Finder for the interactive explanation. After editing the course modules, rebuild from the project folder with `node course/build.mjs`.

## Official references

- [Claude Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Claude Code MCP connections](https://code.claude.com/docs/en/mcp)
- [Claude Code data usage](https://code.claude.com/docs/en/data-usage)
