import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { createBoard } from '../generate';

function countTiles(board: { tiles: Array<string | null> }, tile: string) {
  return board.tiles.reduce((acc, t) => acc + (t === tile ? 1 : 0), 0);
}

describe('tileWeights', () => {
  it('increasing weight of C increases its frequency (statistical)', () => {
    const rngA = createRng(123);
    const rngB = createRng(123);

    const boards = 50;

    let cA = 0;
    let cB = 0;

    for (let i = 0; i < boards; i++) {
      const b1 = createBoard(rngA, { width: 8, height: 8, allowInitialMatches: true });
      const b2 = createBoard(rngB, {
        width: 8,
        height: 8,
        allowInitialMatches: true,
        tileWeights: { C: 8 },
      });

      cA += countTiles(b1, 'C');
      cB += countTiles(b2, 'C');
    }

    // With 50*64 samples, boosted weights should noticeably increase C.
    expect(cB).toBeGreaterThan(cA * 2);
  });

  it('is deterministic with same seed + weights', () => {
    const rng1 = createRng(999);
    const rng2 = createRng(999);

    const b1 = createBoard(rng1, { width: 8, height: 8, allowInitialMatches: true, tileWeights: { C: 5 } });
    const b2 = createBoard(rng2, { width: 8, height: 8, allowInitialMatches: true, tileWeights: { C: 5 } });

    expect(b1.tiles).toEqual(b2.tiles);
  });
});
