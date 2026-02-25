import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { boardFromStrings, boardToStrings } from '../serialize';
import { trySwap } from '../swap';

describe('match3 swap', () => {
  it('swap that creates a match is ok=true', () => {
    // swap (1,0) B with (1,1) A to create AAA on top row
    const board = boardFromStrings([
      'ABAC',
      'AAAC',
      'BCDE',
      'CDEF',
    ]);

    const rng = createRng(123);
    const res = trySwap(board, { x: 1, y: 0 }, { x: 1, y: 1 }, rng);

    expect(res.ok).toBe(true);
    expect(res.matches.length).toBeGreaterThan(0);
  });

  it('swap that creates no match is ok=false and board unchanged', () => {
    const board = boardFromStrings([
      'ABCD',
      'BCDA',
      'CDAB',
      'DABC',
    ]);

    const before = boardToStrings(board);
    const rng = createRng(1);
    const res = trySwap(board, { x: 0, y: 0 }, { x: 1, y: 0 }, rng);

    expect(res.ok).toBe(false);
    expect(boardToStrings(res.finalBoard)).toEqual(before);
  });
});
