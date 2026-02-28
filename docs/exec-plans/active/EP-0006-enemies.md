# EP-0006: Enemy roster + enemy abilities (MVP)

## Goal

Add an MVP enemy roster (≥3 enemies + 1 boss) with distinct stats and at least one simple ability, fully **data-driven** and in the pure game layer.

## Non-goals

- Sophisticated AI
- Large content pipeline

## Current state

- Combat resolver supports one default enemy.
- Run loop exists (EP-0004) but enemies are not data-driven yet.

## Approach (high-level)

- `EnemyDef` data: stats + board modifiers + ability triggers
- Deterministic enemy selection by `(seed, floorIndex)`
- Add board modifiers hook (enemyClaw weights)
- Tests for selection and triggers

## Tasks

- [ ] Product spec updates: `docs/product-specs/enemies.md`, `docs/product-specs/tiles.md`
- [ ] Add enemy data + selection
- [ ] Implement ability triggers (MVP)
- [ ] Integrate with run loop
- [ ] Tests + quality gates

## Tests

- `pnpm -C apps/web lint`
- `pnpm -C apps/web typecheck`
- `pnpm -C apps/web test`
- `pnpm docs:lint`
- `pnpm e2e`
