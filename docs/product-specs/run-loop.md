# Run loop (EP-0004)

This spec describes the MVP roguelike **run wrapper** around the existing single-encounter battle.

## Screens

MVP screens are implemented as **DOM overlays** on top of the Pixi battle view.

- **Start**
  - Actions:
    - **New Run**: starts a deterministic run (currently fixed seed for MVP/testing)
    - **Continue**: loads saved run (enabled only if a valid save exists)
    - **Reset**: clears saved run
- **Battle**
  - The existing match-3 + combat experience
  - Input is disabled while animations run
- **Between fights**
  - Shows floor progress: `Floor N / M`
  - Action: **Next battle**
- **End**
  - Shows **Victory** or **Defeat**
  - Action: **Start new run**

## Run structure

- A run is a sequence of floors (MVP: `floorsCount = 5`).
- Floor index is **0-based** in state; UI displays 1-based.

### Transitions

- Start → Battle: New Run
- Start → Battle/Between/End: Continue (restores saved screen)
- Battle → Between: win on a non-last floor
- Battle → End: loss
- Battle → End: win on last floor (victory)
- Between → Battle: Next battle

## Determinism

- A run has a `seed`.
- Per-floor battle initialization must be deterministic from `(seed, floorIndex)`.

## Persistence (MVP)

### Storage key

- `localStorage` key: `three-rouge-round.run.save`

### Schema versioning

- Save payload is wrapped in an envelope:
  - `schemaVersion`
  - `state` (RunState)

If `schemaVersion` mismatches or payload is malformed, the save is ignored (safe fallback).

### Expected behavior

- If a valid save exists, **Continue** is enabled.
- If there is no save (or save is invalid), **Continue** is disabled.
- **Reset** clears the saved run.

## Acceptance scenarios (MVP)

1) Start → New Run → Battle
2) Win → Between → Next battle → Battle
3) Lose → End
4) Refresh after saving → Start with Continue enabled → Continue restores run
