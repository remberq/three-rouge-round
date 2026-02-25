import { describe, expect, it } from 'vitest';

import { findMatches } from '../detect';
import { boardFromStrings } from '../serialize';

describe('match3 detect', () => {
  it('finds horizontal and vertical matches on a fixed board', () => {
    const board = boardFromStrings([
      'AAAB....',
      'C..B....',
      'C..B....',
      'C..D....',
      '...DDD..',
      '........',
      '........',
      '........',
    ]);

    const matches = findMatches(board);

    // Expect at least these groups:
    // row0: AAA (h)
    // col0: CCC (v)
    // col3: BBB (v)
    // row4: DDD (h)
    const key = (m: { orientation: string; tile: string; length: number; cells: { x: number; y: number }[] }) =>
      `${m.orientation}:${m.tile}:${m.length}:${m.cells[0].x},${m.cells[0].y}`;
    const keys = matches.map(key).sort();

    expect(keys).toContain('h:A:3:0,0');
    expect(keys).toContain('v:C:3:0,1');
    expect(keys).toContain('v:B:3:3,0');
    expect(keys).toContain('h:D:3:3,4');
  });

  it('does not create groups shorter than 3', () => {
    const board = boardFromStrings(['AB', 'BA']);
    expect(findMatches(board)).toEqual([]);
  });
});
