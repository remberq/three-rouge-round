# EP-0006: Enemy roster + enemy abilities (MVP)

## Goal

Add an MVP enemy roster (≥3 enemies + 1 boss) with distinct stats and at least one simple ability, fully **data-driven** and in the pure game layer.

## Non-goals

- Sophisticated AI
- Large content pipeline

## Approach (high-level)

- `EnemyDef` data: stats + board modifiers + ability triggers
- Deterministic enemy selection by `(seed, floorIndex)`
- Add board modifiers hook (enemyClaw weights)
- Tests for selection and triggers

## Tasks (draft)

- [ ] Product spec updates: `docs/product-specs/enemies.md`, `docs/product-specs/tiles.md`
- [ ] Add enemy data + selection
- [ ] Implement ability triggers (MVP)
- [ ] Integrate with run loop
- [ ] Tests + quality gates
