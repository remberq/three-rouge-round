import type { Board, Coord, MatchGroup, TileId } from './types';

function pushRun(groups: MatchGroup[], run: Coord[], orientation: 'h' | 'v', tile: TileId) {
  if (run.length < 3) return;
  groups.push({ orientation, cells: run.slice(), length: run.length, tile });
}

export function findMatches(board: Board): MatchGroup[] {
  const groups: MatchGroup[] = [];

  // Horizontal runs
  for (let y = 0; y < board.height; y++) {
    let runTile: TileId | null = null;
    let run: Coord[] = [];

    for (let x = 0; x < board.width; x++) {
      const t = board.tiles[y * board.width + x];

      if (t && t === runTile) {
        run.push({ x, y });
      } else {
        if (runTile) pushRun(groups, run, 'h', runTile);
        runTile = t;
        run = t ? [{ x, y }] : [];
      }
    }

    if (runTile) pushRun(groups, run, 'h', runTile);
  }

  // Vertical runs
  for (let x = 0; x < board.width; x++) {
    let runTile: TileId | null = null;
    let run: Coord[] = [];

    for (let y = 0; y < board.height; y++) {
      const t = board.tiles[y * board.width + x];

      if (t && t === runTile) {
        run.push({ x, y });
      } else {
        if (runTile) pushRun(groups, run, 'v', runTile);
        runTile = t;
        run = t ? [{ x, y }] : [];
      }
    }

    if (runTile) pushRun(groups, run, 'v', runTile);
  }

  return groups;
}

export function matchCells(groups: MatchGroup[]): Coord[] {
  const seen = new Set<string>();
  const out: Coord[] = [];
  for (const g of groups) {
    for (const c of g.cells) {
      const k = `${c.x},${c.y}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(c);
    }
  }
  return out;
}
