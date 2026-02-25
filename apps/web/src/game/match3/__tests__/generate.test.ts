import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { createBoard } from '../generate';
import { boardToString } from '../serialize';
import { findMatches } from '../detect';

describe('match3 generate', () => {
  it('same seed => same board', () => {
    const a = createBoard(createRng(42));
    const b = createBoard(createRng(42));
    expect(boardToString(a)).toEqual(boardToString(b));
  });

  it('default generation has no initial matches', () => {
    const board = createBoard(createRng(99), { allowInitialMatches: false });
    expect(findMatches(board)).toEqual([]);
  });
});
