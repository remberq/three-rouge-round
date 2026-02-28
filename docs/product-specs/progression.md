# Progression (EP-0005)

This spec defines the MVP **in-run progression**.

## Scope

- No meta-progression.
- No shop/economy.
- Progression happens **within a run** only.

## When progression happens

After the player wins a battle, they get a **reward choice** (EP-0005):
- 3 upgrade options are generated deterministically
- player picks exactly 1
- upgrade is applied to the hero/run

## Determinism

Reward generation must be deterministic from:
- run seed
- floorIndex

No `Math.random`.
