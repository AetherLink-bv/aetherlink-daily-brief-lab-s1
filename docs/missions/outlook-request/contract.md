# Contract — Outlook request summary

Status: `ACCEPTED 2026-11-24 by Maya (A7)`

Input (`sample/outlook-email.sample.json`): `{ synthetic: true, messageId, from, subject, body }`. `synthetic` must be `true` and `from` must end in `.invalid`.

Output: one content item from `docs/spec.md`, `{ status, text, sourceIds }`.

| Case | status | text | sourceIds |
| --- | --- | --- | --- |
| The body says `before HH:MM` | `READY` | `<subject> — due before <HH:MM>.` | `[messageId]` |
| No deadline is stated | `OPEN` | `OPEN — no deadline is stated in "<subject>".` | `[messageId]` |
| Not synthetic | refused with an error | | |

Rules: `sourceIds` may only contain the message ID. The text uses the subject and the deadline only, never other body text.
