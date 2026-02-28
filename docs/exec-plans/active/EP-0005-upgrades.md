# EP-0005: Rewards / upgrades (3 choices) + data-driven upgrades

## Goal

After winning a battle, offer **3 deterministic upgrade choices**, allow the player to pick **1**, and apply it to the hero for the current run.

## Non-goals

- Full economy/shop
- Deep rarity curves / balance tuning
- Complex UI polish

## Current state

- No run loop (added in EP-0004)
- Combat resolver supports stats/modifiers and events

## Approach (high-level)

- Define `UpgradeDef` (data-driven) with `apply()` against `RunState`
- Deterministic reward generator based on `(seed, floorIndex)`
- UI: 3 cards, preview text
- Tests: `applyUpgrade` correctness + deterministic generator

## Tasks (draft)

- [ ] Product spec: `docs/product-specs/progression.md`
- [ ] Product spec: `docs/product-specs/upgrades.md` (or merge into progression)
- [ ] Add data definitions + Zod validation (optional)
- [ ] Implement deterministic reward generator
- [ ] Implement apply pipeline + UI
- [ ] Tests + quality gates
