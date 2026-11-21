# A7 — Synthetic Outlook request

Status: synthetic route accepted and tested. No Outlook connection exists.

## Intent

Maya needs to decide which fictional review request to complete before 15:00. The mission summarises one synthetic message and preserves its exact fixture ID.

## Contract

The output contains `messageId`, `summary`, `action`, `dueAt`, and `sourceId`. Both identifiers must equal the fixture's `messageId`, and `dueAt` must equal the fixture's structured deadline.

## Design

`sample/outlook-email.sample.json` enters a tool-free Agent SDK query. Strict MCP mode receives an empty server map. The host validates the JSON and rejects any source ID or deadline outside the fixture. There is no Outlook connector, live email, or external tool.

## Visual plan

`synthetic fixture → tool-free mocked query → validated request summary → exact source ID`

## Proof

`npm run test:tool` proves the successful journey and an adversarial invented-source case. The model call is mocked because the approved Vertex route is unavailable.

## Human review

The fictional participant approved the smallest mission: “Summarise the synthetic review request and preserve its 15:00 deadline.”

## Handoff

I want to discuss and possibly continue the synthetic Outlook request mission in AetherLink-bv/aetherlink-daily-brief-lab-s1.

Before changing anything, read the repository instructions, inspect the A7 documentation, fixture, implementation, and tests, and decide whether the mission remains useful and sufficiently small. Re-run `npm run test:tool` and `npm run typecheck`. The accepted route uses only `sample/outlook-email.sample.json`, denies every SDK tool, validates the exact fixture source ID, and never connects Outlook. The approved Vertex route remains OPEN, so do not make a paid or live model request. If the checks pass, recommend the next smallest synthetic improvement. Do not push, merge, publish, connect an account, or store live data.
