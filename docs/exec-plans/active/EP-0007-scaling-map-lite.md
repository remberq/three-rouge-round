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

- [ ] RunConfig balance knobs + scaling formulas (issue #39)
- [ ] Map-lite UI (issue #40)
- [ ] Optional enemy choice (2 options) (issue #41)
- [ ] Tests + docs updates

## Test cases

- **TC-SCALE-001: scaling is deterministic**
  - Steps: compute scaled enemy twice for same (enemyId, floorIndex, config)
  - Expected: identical stats

- **TC-SCALE-002: hp/atk scale up with floors**
  - Steps: compare scaled stats on floor 0 vs floor 4
  - Expected: floor 4 >= floor 0

- **TC-SCALE-003: boss scaling uses boss multiplier**
  - Steps: scale boss enemy on last floor
  - Expected: boss stats reflect multiplier

## Tests

- `pnpm -C apps/web lint`
- `pnpm -C apps/web typecheck`
- `pnpm -C apps/web test`
- `pnpm docs:lint`
- `pnpm e2e`
