# Combat

This document describes the **implemented** turn-based combat rules in `apps/web/src/game/combat/`.

## Entities

- Hero and Enemy are entities with:
  - `hp` (current)
  - `baseStats` + `mods[]`

### Stats (initial set)

`hpMax | atk | armor | matk | marmor`

## Turn loop

- A player move is an attempt to swap two adjacent tiles.
- If the swap is invalid (`ok=false` in match3), **it is not a turn** (`turnCount` does not increase).
- If the swap is valid:
  1) Resolve match-3 (primary matches + cascades)
  2) Convert matches into combat damage events (per step)
  3) Apply events to state
  4) `turnCount += 1`
  5) If `turnCount % enemy.attackEveryTurns === 0`, enemy attacks

## Win / lose

- Win: enemy HP reaches 0
- Lose: hero HP reaches 0

## Damage formula

For a raw damage value `raw > 0` and armor stat `armor` (depends on damage type):

- `mitigated = floor(raw * (100 / (100 + armor)))`
- minimum 1 damage if `raw > 0`

Armor stat used:
- `phys` → `armor`
- `magic` → `marmor`
