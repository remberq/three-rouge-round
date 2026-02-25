import type { Board, Coord, SwapResult } from './types';
import { TILE_IDS } from './types';
import { areNeighbors, cloneBoard, getTile, setTile } from './board';
import type { Rng } from './rng';
import { findMatches } from './detect';
import { resolveCascades } from './resolve';

export function trySwap(board: Board, a: Coord, b: Coord, rng: Rng): SwapResult {
  if (!areNeighbors(a, b)) throw new Error('Swap coords must be neighbors');

  const original = cloneBoard(board);
  const working = cloneBoard(board);

  const ta = getTile(working, a);
  const tb = getTile(working, b);
  setTile(working, a, tb);
  setTile(working, b, ta);

  const matches = findMatches(working);
  if (matches.length === 0) {
    return { ok: false, swapped: [a, b], matches: [], cascades: [], finalBoard: original };
  }

  const resolved = resolveCascades(working, rng, TILE_IDS);

  return {
    ok: true,
    swapped: [a, b],
    matches,
    cascades: resolved.steps,
    finalBoard: resolved.board,
  };
}
