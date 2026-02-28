# State model

This document defines the **canonical state shapes** and **serialization/determinism boundaries**.

## Principles

- **Game layer is pure + deterministic** (`apps/web/src/game/**`)
  - No Pixi/DOM dependencies
  - No `Math.random` (use seeded RNG)
  - State transitions via explicit actions/reducers
- **Render layer consumes state + events** (`apps/web/src/render/**`)
  - No gameplay logic
  - May keep temporary view state while animations run

## CombatState (single encounter)

Source of truth: `apps/web/src/game/combat/types.ts`.

`CombatState` contains:
- hero/enemy entities (base stats + modifiers + current hp)
- match-3 board
- `rngState` persisted from match-3 to keep deterministic cascades across moves
- `turnCount` (valid turns only)
- `status` (active/won/lost)

## RunState (roguelike wrapper)

Introduced in EP-0004.

Source of truth: `apps/web/src/game/run/types.ts`.

`RunState` wraps the battle state with roguelike progression:
- `schemaVersion` — required for persistence
- `seed` — run-level deterministic seed
- `config.floorsCount` — MVP: 5 floors
- `screen` — start | battle | between | end
- `floorIndex` — 0-based
- `combat` — current CombatState (only meaningful on battle screen)
- `endResult` — victory | defeat

### Transitions (MVP)

- start → battle: New Run / Continue
- battle → between: win (if not last floor)
- battle → end: loss (defeat)
- between → battle: Next floor
- battle → end: win on last floor (victory)

## Persistence boundary

Only **RunState** is persisted (localStorage). Render state is never persisted.

Run save must include:
- `schemaVersion`
- full `RunState` contents (including `combat.rngState`)

On incompatible `schemaVersion`, persistence must safely reset.
