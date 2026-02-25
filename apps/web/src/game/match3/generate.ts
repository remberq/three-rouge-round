import type { Board, TileId } from './types';
import { TILE_IDS } from './types';
import type { Rng } from './rng';
import { createEmptyBoard, getTile, setTile } from './board';
import { findMatches } from './detect';

export type GenerateOptions = {
  width?: number;
  height?: number;
  tileIds?: readonly TileId[];
  allowInitialMatches?: boolean;
};

export function createBoard(rng: Rng, opts: GenerateOptions = {}): Board {
  const width = opts.width ?? 8;
  const height = opts.height ?? 8;
  const tileIds = opts.tileIds ?? TILE_IDS;
  const allowInitialMatches = opts.allowInitialMatches ?? false;

  if (allowInitialMatches) {
    const b = createEmptyBoard(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        setTile(b, { x, y }, tileIds[rng.nextInt(tileIds.length)]);
      }
    }
    return b;
  }

  // Deterministic attempts; should succeed quickly with 6 tiles.
  for (let attempt = 0; attempt < 50; attempt++) {
    const b = createEmptyBoard(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Exclude tiles that would immediately create a match with 2-left or 2-up.
        const banned = new Set<TileId>();

        if (x >= 2) {
          const a = getTile(b, { x: x - 1, y });
          const b2 = getTile(b, { x: x - 2, y });
          if (a && a === b2) banned.add(a);
        }

        if (y >= 2) {
          const a = getTile(b, { x, y: y - 1 });
          const b2 = getTile(b, { x, y: y - 2 });
          if (a && a === b2) banned.add(a);
        }

        const candidates = tileIds.filter((t) => !banned.has(t));
        if (candidates.length === 0) {
          // restart attempt, but consume rng deterministically
          rng.nextInt(tileIds.length);
          continue;
        }

        const tile = candidates[rng.nextInt(candidates.length)];
        setTile(b, { x, y }, tile);
      }
    }

    if (findMatches(b).length === 0) return b;
  }

  throw new Error('Failed to generate a board without initial matches');
}
