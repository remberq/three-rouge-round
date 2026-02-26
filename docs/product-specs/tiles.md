# Tiles

This document describes the **implemented** tile definitions for combat integration.

## Current state

Match-3 TileId is still `A|B|C|D|E|F`.

Combat maps TileId → TileDef in `apps/web/src/game/combat/defs.ts`.

### Harmful tiles

- Tile `C` is marked `harmfulToHero: true`.
- Matching harmful tiles deals damage to the **hero** instead of the enemy.

## TileDef

- `id: TileId`
- `damageType: phys|magic`
- `basePower` (power at length 3)
- `perExtra` (added per tile beyond 3)
- `harmfulToHero?`
