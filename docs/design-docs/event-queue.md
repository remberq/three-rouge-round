# Event queue

This repo uses a deterministic rules layer. The match-3 engine currently returns a **structured result** (`SwapResult`) rather than emitting a formal event queue.

## Current (implemented)

- `trySwap(...) => SwapResult`
  - `matches`: primary matches after swap
  - `cascades[]`: each step includes `{ matches, clearedCells, spawnedTiles }`

## Next

- Introduce an explicit event queue format (EP-0002/EP-0003) that the renderer can consume to drive animations.
