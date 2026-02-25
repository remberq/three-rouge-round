import { describe, expect, it } from 'vitest';

import { boardFromStrings } from '../../match3/serialize';
import { initCombatState } from '../state';
import { resolvePlayerMove } from '../resolver';
import { DEFAULT_ENEMY, DEFAULT_HERO } from '../defs';
import { createRng, trySwap } from '../../match3';
import type { CombatState } from '../types';

function makeValidBoard() {
  // Same engineered board as match3 tests
  return boardFromStrings([
    'ABAC',
    'AAAC',
    'BCDE',
    'CDEF',
  ]);
}

function pickAnyValidMove(state: CombatState): [{ x: number; y: number }, { x: number; y: number }] {
  const base = createRng(state.rngState);

  for (let y = 0; y < state.board.height; y++) {
    for (let x = 0; x < state.board.width; x++) {
      const a = { x, y };
      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ].filter((c) => c.x >= 0 && c.y >= 0 && c.x < state.board.width && c.y < state.board.height);

      for (const b of neighbors) {
        const r = base.clone();
        const res = trySwap(state.board, a, b, r);
        if (res.ok) return [a, b];
      }
    }
  }

  throw new Error('No valid moves found on board');
}

describe('enemy turns', () => {
  it('enemy attacks exactly every N completed turns', () => {
    const enemy = { ...DEFAULT_ENEMY, attackEveryTurns: 3, attackPower: 7, attackType: 'phys' as const };
    const state0 = initCombatState({ hero: DEFAULT_HERO, enemy, board: makeValidBoard(), rngState: 123 });

    const [a1, b1] = pickAnyValidMove(state0);
    const s1 = resolvePlayerMove(state0, a1, b1, { enemy }).state;

    const [a2, b2] = pickAnyValidMove(s1);
    const s2 = resolvePlayerMove(s1, a2, b2, { enemy }).state;

    const [a3, b3] = pickAnyValidMove(s2);
    const s3 = resolvePlayerMove(s2, a3, b3, { enemy }).state;

    expect(s1.turnCount).toBe(1);
    expect(s2.turnCount).toBe(2);
    expect(s3.turnCount).toBe(3);

    // Attack happens on 3rd completed turn -> hero hp decreased
    expect(s3.hero.hp).toBeLessThan(s2.hero.hp);
  });

  it('invalid swap does not increment turnCount', () => {
    const enemy = { ...DEFAULT_ENEMY, attackEveryTurns: 3 };
    const board = boardFromStrings([
      'ABCD',
      'BCDA',
      'CDAB',
      'DABC',
    ]);
    const state0 = initCombatState({ hero: DEFAULT_HERO, enemy, board, rngState: 1 });

    const res = resolvePlayerMove(state0, { x: 0, y: 0 }, { x: 1, y: 0 }, { enemy });
    expect(res.state.turnCount).toBe(0);
    expect(res.events.some((e) => e.type === 'SwapRejected')).toBe(true);
  });
});
