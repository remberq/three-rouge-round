# Animation pipeline

This repo treats rendering as a **consumer** of deterministic game logic.

## Inputs

Render does not compute matches/damage. It consumes:

- Match-3: `SwapResult` (including cascade steps)
- Combat: `{ state, events, swapResult }` from `resolvePlayerMove`

## Animation sequencing

Current approach (EP-0003): build an `AnimationQueue` script and run sequentially:

1. Swap animation
2. For each resolve step:
   - highlight matched cells
   - clear (fade/scale)
   - drop (tween based on `CascadeStep.drops`)
   - spawn (tween from above based on `CascadeStep.spawns`)
   - show damage popups (from combat events)
3. If enemy attacked this turn: flash HUD

## Data required for precise animations

We extended match-3 cascade steps to include explicit movement mapping:

- `CascadeStep.drops`: `{ from, to, tile }[]`
- `CascadeStep.spawns`: `{ to, tile, spawnFromY }[]`

This prevents the renderer from re-deriving gravity.

## Notes / future improvements

- Better mapping of combat events to exact cascade step indices (more granular VFX).
- Replace procedural graphics with textures/atlas.
- Add proper event stream abstraction for renderer (EP-0004+).
