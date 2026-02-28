# Harness Engineering notes

Principles used in this repo:

1. **Map, not encyclopedia:** keep `AGENTS.md` short and link to docs.
2. `docs/` is the **system of record** (specs, architecture, decisions, plans).
3. **Plans are first-class:** keep an Execution Plan (EP) active for serious work.
4. Enforce mechanically: `docs:lint` + CI.
5. Separate deterministic game logic from rendering.
6. QA is required: write test cases in the active EP + verify real behavior via Playwright CLI before merging. See `docs/references/qa-cli-flow.md`.
