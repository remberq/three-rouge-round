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

## Tasks

- [x] Product spec: `docs/product-specs/progression.md`
- [x] Product spec: `docs/product-specs/upgrades.md`
- [x] Implement UpgradeDef registry + `applyUpgrade` (pure)
- [ ] Deterministic reward generator (3 choices)
- [ ] Rewards UI + integrate after win
- [ ] QA: Playwright CLI verification + baseline screenshot regression stays green
- [ ] Quality gates: lint/typecheck/test/docs:lint + CI green

## Test cases

- **TC-UPG-001: applyUpgrade increases hpMax**
  - Steps: apply `stat.hpMax+2`
  - Expected: heroDef.baseStats.hpMax increments by 2

- **TC-UPG-002: unknown upgrade id is a no-op**
  - Steps: apply unknown id
  - Expected: state unchanged
