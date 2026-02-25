import { describe, expect, it } from 'vitest';

import { createBoardState, iterCells } from './board';

describe('board', () => {
  it('creates deterministic board state', () => {
    expect(createBoardState({ cols: 8, rows: 8 })).toEqual({ size: { cols: 8, rows: 8 } });
  });

  it('iterates all cells', () => {
    const size = { cols: 2, rows: 3 };
    const cells = Array.from(iterCells(size));
    expect(cells).toHaveLength(6);
    expect(cells[0]).toEqual({ x: 0, y: 0 });
    expect(cells[5]).toEqual({ x: 1, y: 2 });
  });
});
