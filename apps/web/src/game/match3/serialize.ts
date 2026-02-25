import type { Board, TileId } from './types';
import { TILE_IDS } from './types';

const TILE_SET = new Set<string>(TILE_IDS);

function charToTile(ch: string): TileId | null {
  if (ch === '.') return null;
  if (!TILE_SET.has(ch)) throw new Error(`Invalid tile char: ${ch}`);
  return ch as TileId;
}

export function boardFromStrings(rows: string[]): Board {
  if (rows.length === 0) throw new Error('rows must be non-empty');
  const height = rows.length;
  const width = rows[0].length;
  if (width === 0) throw new Error('width must be > 0');
  for (const r of rows) {
    if (r.length !== width) throw new Error('all rows must have equal length');
  }

  const tiles = rows.flatMap((r) => Array.from(r).map(charToTile));
  return { width, height, tiles };
}

export function boardToStrings(board: Board): string[] {
  const out: string[] = [];
  for (let y = 0; y < board.height; y++) {
    let row = '';
    for (let x = 0; x < board.width; x++) {
      const t = board.tiles[y * board.width + x];
      row += t ?? '.';
    }
    out.push(row);
  }
  return out;
}

export function boardToString(board: Board): string {
  return boardToStrings(board).join('\n');
}
