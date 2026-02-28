# QA / CLI flow (Playwright)

This repo uses a **harness workflow**: docs as system-of-record + EPs. In addition, we enforce a QA flow:

## Rule

Before merging any PR:

1) **Write test cases** for the feature/bugfix
2) **Verify real behavior** in a browser via CLI automation (Playwright)
3) Only then: commit → push → PR

The goal is to prevent “it compiles but doesn’t work” changes.

## Test cases

For every task/EP subtask, add a test-case section to the relevant EP file under:

- `docs/exec-plans/active/EP-XXXX-*.md`

Format (recommended):

- **TC-001**: <title>
  - Preconditions:
  - Steps:
  - Expected:

Keep them short, but explicit.

## Playwright CLI checks

We use Playwright to drive a real Chromium and validate flows.

### Install

- `npm i -g playwright`
- `playwright install chromium`

### Run (examples)

Start dev server:

- `npm run dev`

Then in another shell, run Playwright scripts/tests.

Suggested checks (MVP):

- Start screen renders, buttons visible
- New Run starts battle
- Continue resumes saved run
- Reset clears save
- Between-fights screen appears after victory
- End screen appears on victory/defeat

### Artifacts

When possible, record at least one artifact per PR:

- screenshot(s) or
- Playwright trace (preferred)

Store artifacts outside git (or attach to PR description).

## Definition of Done (QA)

A PR is mergeable only if:

- Test cases are written in docs
- CLI-driven Playwright verification passes (or a short note explains why it’s skipped)
