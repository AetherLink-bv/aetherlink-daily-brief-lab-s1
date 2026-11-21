# Optional extension: let Bree read the brief aloud

Add this only after the synthetic HTML brief and its tests pass. This extension turns a short, synthetic morning summary into `out/brief.mp3`. It is a new AI-SDLC iteration: agree the boundary, write a failing test, build the smallest route, and review the result.

This extension is optional. Skip it if you do not want to create an external account.

Use Node.js 20.12 or newer. Check with `node --version` before you start.

## Boundary

- Use only `sample/brief.sample.json`. Never read `~/.bree/briefs/` or live connector output.
- Send only the short summary and top todos. Keep source labels and raw work data out of the request.
- Speak `OPEN` and `CONFLICT` exactly. Do not turn uncertainty into a confident statement.
- Keep the HTML route unchanged. Audio is an extra artifact, not a replacement.
- Use your own ElevenLabs account and key. Do not use a trainer's shared key.
- Never paste the key into Claude Code, chat, a commit, a screenshot, or client-side browser code.
- Tests must mock the network. They must not spend credits.

## 1. Create the account and restricted key

1. Open [ElevenLabs sign in](https://elevenlabs.io/app/sign-in).
2. Create or sign in to your personal free account.
3. Open **Developers → API Keys**.
4. Create a key named `Bree workshop`.
5. Keep the key restricted. Enable only **Text to Speech**.
6. Set a small credit limit when the dashboard offers it.
7. Copy the key once. Paste it directly into the ignored local file below.

ElevenLabs API calls consume account credits, including calls on the free plan. Key restrictions and credit limits reduce the effect of accidental use. See the official [API authentication guide](https://elevenlabs.io/docs/api-reference/authentication) and [ElevenAPI quickstart](https://elevenlabs.io/docs/eleven-api/guides/cookbooks/text-to-speech/).

Create `.env.local` in the repository root:

```text
ELEVENLABS_API_KEY=your_personal_key
```

The repository ignores `.env.local`. Check before continuing:

```bash
git status --short
```

Expected result: `.env.local` is absent from the output. Stop if it appears.

## 2. Agree the boundary and test plan

Copy Part 1 into Claude Code:

> Read CLAUDE.md, SOLO.md, the accepted DailyBrief contract, sample/brief.sample.json, src/brief.ts, package.json, and docs/voice-extension.md. Plan an optional synthetic-only voice route. It may read only sample/brief.sample.json and may send only the validated summary and topTodos. It must preserve OPEN and CONFLICT, keep the HTML route unchanged, and never read ~/.bree/briefs/ or call a connector. Propose tests for a missing key, the 2000-character limit, a mocked MP3 response, uncertainty wording, invalid audio, and an unchanged out/latest.html. Tests must mock fetch and spend no credits. Do not edit files. Stop for my approval.

Approve the boundary and tests before continuing.

## 3. Build the synthetic voice route

Copy Part 2 into Claude Code:

> Implement the approved voice plan. Write test/voice.test.ts first and show the expected red failure. Build a separate src/voice.ts with the existing DailyBrief schema and native fetch. Reject a missing ELEVENLABS_API_KEY or scripts over 2000 characters before fetch. POST to the ElevenLabs Text to Speech endpoint with the xi-api-key header, public voice JBFqnCBsd6RMkjVDRZzb, and a documented model. Reject failed, non-audio, or invalid MP3 responses without printing the key or request text. Write only a successful response to out/brief.mp3. Add brief:voice and test:voice scripts and load the key from ignored .env.local. Run the voice test and existing synthetic tests. Show the red and green evidence and diff. Stop before a real API request.

Review the diff. Confirm that `src/voice.ts` has no Jira, MCP, Agent SDK, live brief, shell, or browser dependency.

## 4. Run the free checks first

```bash
npm run test:voice
npm test
npm run brief:sample
```

Expected result:

- The voice test uses a mocked response.
- All existing tests stay green.
- `out/latest.html` still opens and has not been replaced.
- No API credits are used.

## 5. Create one spoken synthetic brief

This is the only step that sends text to ElevenLabs and uses credits.

```bash
npm run brief:voice
```

Expected result: the command writes `out/brief.mp3`. Play it locally. Confirm that it is short, matches the synthetic summary and top todos, and says `OPEN` or `CONFLICT` when those states are present.

Do not commit the MP3. The existing `out/` ignore rule keeps it outside Git.

## Done when

- `npm run test:voice` passes without a network request.
- One explicit `npm run brief:voice` call creates `out/brief.mp3` from the synthetic sample.
- The audio includes uncertainty instead of hiding it.
- The HTML brief still passes its tests and opens unchanged.
- `git status --short` shows no key, MP3, live data, or private brief.

Delete the `Bree workshop` key after the workshop if you will not use it again.

Record only the command, exit code, output path, and synthetic input label in `docs/evidence.md`. Do not record the key, request body, audio contents, or account details.

## Troubleshooting

- **Missing key before the request:** confirm `.env.local` contains `ELEVENLABS_API_KEY` and the package script loads that file. Never print the value.
- **401:** create or copy the key again, then confirm the request uses the exact `xi-api-key` header.
- **402 or quota error:** stop. The account has insufficient credits. Skip the optional extension or wait for the quota to reset.
- **403:** confirm the key allows Text to Speech and the selected model is available on the account.
- **429:** wait for the current request to finish, then retry once. Do not add an automatic retry loop during the workshop.
- **No MP3:** inspect the status and `content-type` without printing the request text or key. Keep the previous HTML artifact.

If the account or API is unavailable, mark the voice artifact `OPEN`. The completed HTML brief remains the accepted product.
