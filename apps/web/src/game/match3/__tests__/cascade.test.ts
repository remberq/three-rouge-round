import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { boardFromStrings, boardToStrings } from '../serialize';
import { trySwap } from '../swap';
import { findMatches } from '../detect';

// This test focuses on invariants that must hold deterministically.
describe('match3 cascades', () => {
  it('clears, applies gravity, fills deterministically, and ends stable', () => {
    // A small board engineered so that swapping triggers at least one match.
    const start = boardFromStrings([
      'ABAC',
      'AAAC',
      'BCDE',
      'CDEF',
    ]);

    const rng = createRng(777);
    const res = trySwap(start, { x: 1, y: 0 }, { x: 1, y: 1 }, rng);

    expect(res.ok).toBe(true);
    expect(res.cascades.length).toBeGreaterThanOrEqual(1);

    // Deterministic output for fixed seed
    const final1 = boardToStrings(res.finalBoard);
    const res2 = trySwap(start, { x: 1, y: 0 }, { x: 1, y: 1 }, createRng(777));
    const final2 = boardToStrings(res2.finalBoard);
    expect(final1).toEqual(final2);

    // Stable end state (no matches)
    expect(findMatches(res.finalBoard)).toEqual([]);
  });
});
