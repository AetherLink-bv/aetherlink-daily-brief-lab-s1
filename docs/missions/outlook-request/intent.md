# Intent — Mission: one synthetic work request (mock Outlook)

Status: `ACCEPTED 2026-11-24 by Maya (A7)`

## Mission

- User: Maya, a team member.
- Decision: Does she have to review the workshop outline before 15:00 today?
- Mission: read one synthetic email and say, in one sourced line, what is requested and by when.
- Source: `sample/outlook-email.sample.json` only. This is the "mock Outlook" mission. Outlook and work email are never connected. There is no connector and no live read-only tool to approve, so there is no live status to prove. Live access: `OPEN` by design (not applicable).

## Success checks

- [ ] `npm run test:tool` fails first (red), then passes (green), with exit codes recorded.
- [ ] `npm run outlook` prints one line: the request, its deadline and the source message ID, from the synthetic fixture only.
- [ ] A message without a stated deadline gives an `OPEN` item, never a guessed time.
- [ ] A message that is not marked synthetic is refused.

## Boundary

- In scope: the synthetic fixture, one summary item in the existing `DailyBrief` item shape, one bounded SDK route definition with no tools.
- Out of scope: connecting Outlook, reading work email, sending or replying, writing files from the model, any live call.
- The model never invents a fact: no deadline in the text means `OPEN`.
- Stop when: the input is not marked synthetic, a tool is requested, or the output cites a source other than the message ID.

## OPEN

- OPEN — whether a real Outlook source would ever be approved. Not planned.
- OPEN — the bounded SDK route is defined and tested with mocks; it was not run against a model.
