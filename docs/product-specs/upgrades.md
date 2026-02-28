# Upgrades (EP-0005)

This spec defines the MVP upgrade system.

## UpgradeDef

Upgrades are **data-driven** and pure.

MVP fields:
- `id`
- `name`
- `description`
- `apply(runState) -> runState`

## MVP upgrade set

- `stat.hpMax+2`
- `stat.atk+1`
- `stat.armor+1`
- `stat.marmor+1`

## Constraints

- Applying upgrades must not mutate global defs.
- Upgrades must be deterministic and testable headlessly.
