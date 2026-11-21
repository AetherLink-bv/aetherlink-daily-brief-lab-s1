---
name: verify-bree
description: Verify Bree's synthetic brief and separate the private live preflight.
---

# Verify Bree

Status: VERIFIED. Targeted local checks passed on 2026-11-21. Remote CI proved the full suite, both fixed revisions, cleanup, and the rendered page.

## Launch

Run `npm ci` once. No server is required.

## Doctor

Run `node --version`, `git status --short`, `npm run typecheck`, and `npm run live:check`. Node must be 20.12 or newer. An OPEN live preflight is an honest result, not synthetic failure.

## Drive

Run `npm run test:mini`, `npm run test:schema`, `npm run test:render`, `npm run test:live`, `npm run eval`, and `npm run brief:sample`.

## Evidence

Record commands, exit codes, and synthetic output in `docs/evidence.md`. Inspect `out/latest.html` for all six headings, escaped long text, source labels, and visible OPEN and CONFLICT states. Never store live content.

## Cleanup

No process is started. Preserve `out/latest.html` for participant review. Remove only temporary worktrees created by the verifier, after checking their absolute paths with `git worktree list`.
