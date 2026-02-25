# Contributing

## Definition of Done (DoD)

- Active Execution Plan (EP) exists/updated for non-trivial work.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm docs:lint` all pass.
- `docs/STATUS.md` updated (active EP links + next steps).
- Decisions logged in `docs/WORKLOG.md` (short).

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm typecheck
pnpm test
pnpm docs:lint
```

## Execution Plans

- Active: `docs/exec-plans/active/`
- Completed: `docs/exec-plans/completed/`

Before major changes: create/update an EP in `active/` with:
- Goal, Non-goals, Current state, Approach, Tasks, Tests
