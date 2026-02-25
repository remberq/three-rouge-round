# EP-0002: Turn-based combat rules (event-driven)

## Goal

Implement a deterministic, headless **turn-based combat rules engine** that consumes match-3 results and produces an **event queue**, with unit tests and docs updates.

## Non-goals

- Rendering/animation/UI.
- Metaprogression, upgrades, special tiles.

## Current state

- Match-3 rules engine exists in `apps/web/src/game/match3/`.
- Combat specs are stubs; no combat code yet.

## Approach

- Add `apps/web/src/game/combat/` module:
  - data-driven defs (tiles, hero, enemy)
  - stats/modifiers system + damage formula
  - combat state + event types
  - resolver: `resolvePlayerMove(state, a, b)`
  - bridge: match3 `SwapResult` -> combat events (damage per match step)
- Determinism:
  - combat uses the same seeded RNG approach (no Math.random)
  - invalid swap is not a turn
- Keep rules testable with Vitest.

## Decisions

- Keep match3 TileId as `A..F` for now, and add a mapping layer `TileDef` keyed by `A..F`.
- Damage formula (floor): `mitigated = floor(raw * (100 / (100 + armor)))`, min 1 if raw > 0.
- Enemy attacks after player move resolution when `turnCount % attackEveryTurns === 0`.

## Tasks

- [ ] Create combat module structure per issue.
- [ ] Implement stats + damage (phys/magic, armor/marmor).
- [ ] Implement event types + reducer.
- [ ] Implement bridge from match3 matches/cascades -> damage events.
- [ ] Implement resolver + deterministic sim helpers.
- [ ] Tests: damage/enemy-turns/harmful/deterministic.
- [ ] Update docs: combat/tiles/entities-and-stats + event-queue.
- [ ] Update WORKLOG.

## Tests

- `pnpm lint && pnpm typecheck && pnpm test && pnpm docs:lint`
