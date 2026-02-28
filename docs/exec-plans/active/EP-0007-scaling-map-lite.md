# EP-0007: Scaling / floors / map-lite + balance knobs

## Goal

Define a small run structure (MVP: 5 floors) with deterministic floor progression, simple scaling, and a minimal “map” UI.

## Non-goals

- Complex branching maps
- Meta-progression

## Current state

- EP-0004 provides floors + between-fights UI, but no scaling.
- EP-0006 will provide enemy roster; scaling will be applied on top.

## Approach (high-level)

- `RunConfig` with all balance numbers
- Scaling formulas for enemy stats
- Optional 2-choice enemy selection on some floors
- Tests for determinism and scaling

## Tasks

- [ ] Consolidate balance knobs into RunConfig
- [ ] Implement scaling
- [ ] Map-lite UI
- [ ] Tests + docs updates

## Tests

- `pnpm -C apps/web lint`
- `pnpm -C apps/web typecheck`
- `pnpm -C apps/web test`
- `pnpm docs:lint`
- `pnpm e2e`
