# OPEN and CONFLICT behaviour

## Sub-features

- Complete case (`sample/eval/ordinary-brief.json`): every item `READY` and sourced; tally shows 0 OPEN, 0 CONFLICT.
- Missing evidence (`sample/eval/missing-brief.json`): affected items are `OPEN`, text starts `OPEN`, no source IDs, and no agenda or time is claimed.
- Conflicting evidence (`sample/eval/conflict-brief.json`): affected items are `CONFLICT`, text starts `CONFLICT`, cite at least two sources, and the move-work-forward action does not pick a winner.
- The schema rejects an `OPEN` text that does not start with `OPEN`, a `CONFLICT` text that does not start with `CONFLICT`, and a `READY` item without a source.

## How to get to it (user POV)

Run `npm run eval` and read the three named cases. To see a case as a page, temporarily render one fixture; no repository command does that, so the tests are the proof.

## Driving it with the repository commands

```bash
npm run eval          # four tests: complete, missing, conflict, legacy fixtures rejected
npm run test:schema   # the rules behind OPEN and CONFLICT
```

Expected: exit 0 and `pass 4` for eval. To prove the check can fail, change one `status` in `sample/eval/conflict-brief.json` from `CONFLICT` to `READY`, see `npm run eval` exit 1, then `git checkout -- sample/eval/conflict-brief.json`.

## Gotchas

- `sample/eval/ordinary.json`, `missing.json` and `conflict.json` are mini-calendar inputs, not briefs. The schema rejects them on purpose.
- A green eval proves the three synthetic cases, not what a live source will return.
