# EP-0007: Scaling / floors / map-lite + balance knobs

## Goal

Define a small run structure (MVP: 5 floors) with deterministic floor progression, simple scaling, and a minimal “map” UI.

## Non-goals

- Complex branching maps
- Meta-progression

## Approach (high-level)

- `RunConfig` with all balance numbers
- Scaling formulas for enemy stats
- Optional 2-choice enemy selection on some floors
- Tests for determinism and scaling

## Tasks (draft)

- [ ] Consolidate balance knobs into RunConfig
- [ ] Implement scaling
- [ ] Map-lite UI
- [ ] Tests + docs updates
