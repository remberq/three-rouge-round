# Entities & stats

This document describes the **implemented** stats system used by combat.

## Entity model

- `baseStats: Partial<Record<StatId, number>>`
- `mods: Modifier[]`
- `hp` is stored separately from stats.

## StatId (initial)

- `hpMax` | `atk` | `armor` | `matk` | `marmor`

## Modifiers

Two kinds:

- `flat`: additive (e.g. +5 armor)
- `mult`: multiplicative (e.g. ×1.2 atk)

Application order:
1) apply all `flat`
2) apply all `mult`

`getStat(entity, statId)` returns the computed value.
