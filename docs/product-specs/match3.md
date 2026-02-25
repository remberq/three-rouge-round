# Match-3

This document describes the **implemented** match-3 rules engine in `apps/web/src/game/match3/`.

## Scope

- Match-3 rules only (no render, no combat).
- Deterministic outcomes with a seeded RNG.

## Board model

- Board is a **row-major 1D array**:
  - `tiles[y * width + x]`
- Default size (for now): **8x8**.
- Empty cell: `null`.

## Tiles

- TileId: `A|B|C|D|E|F` (6 types).

## Match rules

- A match is **3+ identical tiles** in a contiguous horizontal or vertical run.
- If a swap does **not** create at least one match, it is **invalid** and the board is rolled back.

## Resolution

1. Detect matches.
2. Clear all matched cells (set to `null`).
3. Gravity per column: tiles fall downward; relative order in a column is preserved.
4. Fill empties with new tiles from RNG.
5. Repeat (cascades) until no matches remain.

## Determinism

- Using the same seed and the same initial board produces the same `SwapResult.finalBoard`.

## Testing helpers

- `boardFromStrings([...])` / `boardToStrings(board)`
- `.` represents `null` (empty).
