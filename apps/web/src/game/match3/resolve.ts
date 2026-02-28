import type { Board, CascadeStep, Coord, DropMove, SpawnMove, SpawnedTile, TileId, TileWeights } from './types';
import { cloneBoard, setTile } from './board';
import type { Rng } from './rng';
import { findMatches, matchCells } from './detect';
import { pickWeightedTile } from './tilePool';

export type ResolveResult = {
  board: Board;
  steps: CascadeStep[];
};

export function clearCells(board: Board, cells: Coord[]): void {
  for (const c of cells) setTile(board, c, null);
}

export function applyGravityWithMoves(_before: Board, after: Board): DropMove[] {
  // Mutates `after` to gravity-applied board, returns drop moves for tiles that moved.
  const drops: DropMove[] = [];

  for (let x = 0; x < after.width; x++) {
    // Collect tiles in this column from `after` (after clear).
    const tiles: TileId[] = [];
    const fromCoords: { tile: TileId; fromY: number }[] = [];

    for (let y = 0; y < after.height; y++) {
      const t = after.tiles[y * after.width + x];
      if (t !== null) {
        tiles.push(t);
        fromCoords.push({ tile: t, fromY: y });
      }
    }

    const empties = after.height - tiles.length;

    // Write new column
    for (let y = 0; y < after.height; y++) {
      const idx = y * after.width + x;
      after.tiles[idx] = y < empties ? null : tiles[y - empties];
    }

    // Compute moves: match original fromCoords to new Ys in order (stable)
    for (let i = 0; i < fromCoords.length; i++) {
      const from = fromCoords[i];
      const toY = empties + i;
      if (from.fromY !== toY) {
        drops.push({ from: { x, y: from.fromY }, to: { x, y: toY }, tile: from.tile });
      }
    }
  }

  return drops;
}

export function fillEmptiesWithMoves(
  board: Board,
  rng: Rng,
  tileIds: readonly TileId[],
  tileWeights?: TileWeights,
): {
  spawnedTiles: SpawnedTile[];
  spawns: SpawnMove[];
} {
  const spawnedTiles: SpawnedTile[] = [];
  const spawns: SpawnMove[] = [];

  for (let x = 0; x < board.width; x++) {
    // count empties in this column
    let empties = 0;
    for (let y = 0; y < board.height; y++) {
      if (board.tiles[y * board.width + x] === null) empties++;
    }

    // Fill from top to bottom; for animation we spawn from y = -k
    let spawnedSoFar = 0;
    for (let y = 0; y < board.height; y++) {
      const i = y * board.width + x;
      if (board.tiles[i] !== null) continue;

      const tile = pickWeightedTile(rng, tileIds, tileWeights);
      board.tiles[i] = tile;

      spawnedTiles.push({ at: { x, y }, tile });
      spawns.push({ to: { x, y }, tile, spawnFromY: -empties + spawnedSoFar });
      spawnedSoFar++;
    }
  }

  return { spawnedTiles, spawns };
}

export function resolveCascades(initial: Board, rng: Rng, tileIds: readonly TileId[], tileWeights?: TileWeights): ResolveResult {
  const board = cloneBoard(initial);
  const steps: CascadeStep[] = [];

  // Repeat until stable
  for (let safety = 0; safety < 100; safety++) {
    const matches = findMatches(board);
    if (matches.length === 0) break;

    const clearedCells = matchCells(matches);

    const beforeStep = cloneBoard(board);

    clearCells(board, clearedCells);

    const drops = applyGravityWithMoves(beforeStep, board);
    const { spawnedTiles, spawns } = fillEmptiesWithMoves(board, rng, tileIds, tileWeights);

    steps.push({ matches, clearedCells, drops, spawns, spawnedTiles });
  }

  return { board, steps };
}

// A small helper useful in some tests
export function countNulls(board: Board): number {
  return board.tiles.reduce((acc, t) => acc + (t === null ? 1 : 0), 0);
}
