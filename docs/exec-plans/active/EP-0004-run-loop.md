# EP-0004: Run loop + screens + minimal persistence

## Goal

Introduce a minimal **roguelike run loop** around the existing single-encounter combat:
- Player can start a **New Run** with a deterministic seed
- Run progresses through **floors** (MVP: 5)
- After each battle: transition to a simple **between-fights** screen (initially “Next battle”; rewards come in EP-0005)
- Player can **Continue** an in-progress run after page reload (localStorage)
- Player can **Reset** the run
- End screens: **Victory** (after floor 5 boss) / **Defeat**

## Non-goals

- Rewards / upgrades (EP-0005)
- Enemy roster / abilities beyond current single enemy (EP-0006)
- Balance/scaling/map generation beyond a linear 1..M flow (EP-0007)
- Any render-side combat logic (render must remain a consumer)

## Current state

- Deterministic match-3 rules engine (EP-0001)
- Event-driven combat resolver + event queue + tests (EP-0002)
- Pixi renderer consumes swapResult + events and plays animations (EP-0003)
- No concept of “Run”, floors, persistence, or non-combat screens

## Approach

### State model

Add a new pure game-layer state machine:
- `RunState` (seed, floorIndex, hero state, enemy state, per-run config)
- `RunScreen` (start | battle | between | end)
- `RunReducer` for transitions driven by pure actions/events

### Persistence

- `saveRunState` / `loadRunState` with:
  - `schemaVersion`
  - safe fallback to “no save” on mismatch
- storage key names documented

### UI

Fastest implementation: DOM overlays (or minimal Pixi text) on top of the canvas.
Decision to be recorded in docs/design-docs.

### Determinism

- `New Run` uses an explicit seed stored in `RunState`
- No `Math.random` for run progression

## Tasks

- [ ] Docs: create product spec `docs/product-specs/run-loop.md`
- [x] Docs: update design doc `docs/design-docs/state-model.md` with RunState + transitions
- [x] Create `RunState` model + reducer in `apps/web/src/game/run/**`
- [ ] Add start screen: New Run / Continue / Reset
- [ ] Add end screen: Victory/Defeat
- [ ] Add between-fights screen (MVP): Floor N/M + “Next battle” button
- [x] Screenshot regression baseline (Playwright): capture current battle screen before UI changes
- [ ] Integrate battle screen with existing combat+render pipeline
- [x] Persistence: localStorage save/load, schemaVersion + safe reset
- [x] Tests:
  - [x] serialize/deserialize + schema version fallback
  - [x] deterministic New Run seed produces same initial RunState
- [ ] QA (required): write test cases + verify via Playwright CLI (Chromium)
- [ ] Quality gates: npm lint/typecheck/test/docs:lint (via nvm)

## Test cases

- **TC-UI-001: Start screen overlay does not break battle UI**
  - Preconditions: app loads
  - Steps: open app → ensure Start overlay visible → click New Run
  - Expected: overlay hides; board+HUD look the same as baseline screenshot

- **TC-UI-002: Continue is available only when a save exists**
  - Preconditions: none
  - Steps: open app with empty localStorage
  - Expected: Continue button hidden/disabled

- **TC-UI-003: Reset clears save and returns to Start**
  - Preconditions: a save exists
  - Steps: click Reset → refresh
  - Expected: Continue is not available


- **TC-PERSIST-001: Save run on New Run**
  - Preconditions: localStorage empty
  - Steps: start a new run → trigger a state change
  - Expected: save key exists; refresh allows Continue

- **TC-PERSIST-002: Continue restores same run**
  - Preconditions: a saved run exists
  - Steps: refresh → continue
  - Expected: seed/floor match previous; combat state is restored

- **TC-PERSIST-003: Reset clears save**
  - Steps: reset → refresh
  - Expected: no continue; save key removed

- **TC-PERSIST-004: Corrupted/mismatched save fails safely**
  - Steps: write invalid JSON or schemaVersion mismatch → refresh
  - Expected: app does not crash; save ignored/cleared

## Tests

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run docs:lint`

## Decisions

- UI overlays: TBD (record once chosen)
- Save schema version: start at 1
- Run floors count for MVP: 5

## Done / Remaining

- Done: (none)
- Remaining: all tasks above
