# Event queue

This repo uses a deterministic rules layer. We represent gameplay as **events** so that rendering/animation can consume them later.

## Match-3 (current)

The match-3 engine returns a structured result (`SwapResult`) rather than emitting a formal event queue.

- `trySwap(...) => SwapResult`
  - `matches`: primary matches after swap
  - `cascades[]`: each step includes `{ matches, clearedCells, spawnedTiles }`

## Combat (implemented in EP-0002)

Combat exposes an event queue returned by:

- `resolvePlayerMove(state, a, b) => { state, events }`

### Event types (current)

- `PlayerMoveAttempted`
- `SwapRejected`
- `MatchStepResolved`
- `DamageDealt`
- `EnemyAttack`
- `TurnEnded`
- `BattleEnded`

### Notes

- Combat currently **bridges** match-3 results into combat events (damage per match step), which is enough to later drive per-step animations.

## Next

- EP-0003 should define a renderer-facing event stream that can drive animations in Pixi.
