import type { Board, Coord, TileId } from './types';

export function createEmptyBoard(width: number, height: number): Board {
  if (width <= 0 || height <= 0) throw new Error('Invalid board size');
  return { width, height, tiles: Array.from({ length: width * height }, () => null) };
}

export function cloneBoard(board: Board): Board {
  return { width: board.width, height: board.height, tiles: board.tiles.slice() };
}

export function inBounds(board: Board, c: Coord): boolean {
  return c.x >= 0 && c.x < board.width && c.y >= 0 && c.y < board.height;
}

export function idx(board: Board, c: Coord): number {
  return c.y * board.width + c.x;
}

export function getTile(board: Board, c: Coord): TileId | null {
  if (!inBounds(board, c)) throw new Error(`Out of bounds getTile: ${c.x},${c.y}`);
  return board.tiles[idx(board, c)];
}

export function setTile(board: Board, c: Coord, tile: TileId | null): void {
  if (!inBounds(board, c)) throw new Error(`Out of bounds setTile: ${c.x},${c.y}`);
  board.tiles[idx(board, c)] = tile;
}

export function areNeighbors(a: Coord, b: Coord): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

export function* iterCoords(board: Board): Generator<Coord> {
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      yield { x, y };
    }
  }
}
