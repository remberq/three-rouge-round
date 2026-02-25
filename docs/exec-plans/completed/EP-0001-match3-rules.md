# EP-0001: Match-3 rules (deterministic core)

## Goal

Implement a deterministic, testable **match-3 rules engine** (no Pixi) with:
- board model + tile types
- seeded RNG
- swap validation
- match detection
- resolve + gravity + fill + cascades
- detailed SwapResult for debugging and later combat integration

## Non-goals

- Combat integration / damage / intents.
- Special tiles (bombs/lines/rainbow), hints.
- Rendering/animation.

## Current state

- Repo scaffold exists; `apps/web/src/game/` is present but match3 engine not implemented.

## Approach

- Add `apps/web/src/game/match3/` as a pure rules module.
- Use a small deterministic PRNG (mulberry32 or xorshift32).
- Keep board as 1D array for cache-friendly operations: `tiles[y*width + x]`.
- Provide string helpers for readable tests.

## Decisions

- Board storage: **1D array** (row-major).
- Default board size: 8x8.
- Tile set: 6 tile IDs: `A|B|C|D|E|F`.
- Match groups: report orientation `h|v` and a list of cells per group.

## Tasks

- [x] Create `apps/web/src/game/match3/` module structure (types/rng/board/detect/resolve/swap/serialize).
- [x] Implement deterministic board generation with `allowInitialMatches=false` default.
- [x] Implement match detection (h/v 3+).
- [x] Implement swap validation (swap must create a match else rollback).
- [x] Implement resolve pipeline: clear → gravity → fill → cascades until stable.
- [x] Implement SwapResult with cascade steps.
- [x] Add tests: detect/swap/cascade/generate.
- [x] Update docs: `docs/product-specs/match3.md` and `docs/design-docs/event-queue.md` to reflect implemented behavior.
- [x] Update `docs/WORKLOG.md` with key decisions.

## Tests

- `pnpm test` (Vitest) with fixed seeds + exact assertions.
- `pnpm lint`
- `pnpm typecheck`
- `pnpm docs:lint`
