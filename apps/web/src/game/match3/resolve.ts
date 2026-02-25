import type { Board, CascadeStep, Coord, SpawnedTile, TileId } from './types';
import { cloneBoard, setTile } from './board';
import type { Rng } from './rng';
import { findMatches, matchCells } from './detect';

export type ResolveResult = {
  board: Board;
  steps: CascadeStep[];
};

export function clearCells(board: Board, cells: Coord[]): void {
  for (const c of cells) setTile(board, c, null);
}

export function applyGravity(board: Board): void {
  // per column: compact non-nulls downwards preserving relative order
  for (let x = 0; x < board.width; x++) {
    const col: (TileId | null)[] = [];
    for (let y = 0; y < board.height; y++) {
      col.push(board.tiles[y * board.width + x]);
    }

    const nonNulls = col.filter((t): t is TileId => t !== null);
    const empties = board.height - nonNulls.length;
    const newCol: (TileId | null)[] = [...Array.from({ length: empties }, () => null as TileId | null), ...nonNulls];

    for (let y = 0; y < board.height; y++) {
      board.tiles[y * board.width + x] = newCol[y];
    }
  }
}

export function fillEmpties(board: Board, rng: Rng, tileIds: readonly TileId[]): SpawnedTile[] {
  const spawned: SpawnedTile[] = [];
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const i = y * board.width + x;
      if (board.tiles[i] !== null) continue;
      const tile = tileIds[rng.nextInt(tileIds.length)];
      board.tiles[i] = tile;
      spawned.push({ at: { x, y }, tile });
    }
  }
  return spawned;
}

export function resolveCascades(initial: Board, rng: Rng, tileIds: readonly TileId[]): ResolveResult {
  const board = cloneBoard(initial);
  const steps: CascadeStep[] = [];

  // Repeat until stable
  for (let safety = 0; safety < 100; safety++) {
    const matches = findMatches(board);
    if (matches.length === 0) break;

    const clearedCells = matchCells(matches);
    clearCells(board, clearedCells);
    applyGravity(board);
    const spawnedTiles = fillEmpties(board, rng, tileIds);

    steps.push({ matches, clearedCells, spawnedTiles });
  }

  return { board, steps };
}

// A small helper useful in some tests
export function countNulls(board: Board): number {
  return board.tiles.reduce((acc, t) => acc + (t === null ? 1 : 0), 0);
}
