import { describe, expect, it } from 'vitest';

import { boardFromStrings, boardToString } from '../../match3/serialize';
import { initCombatState } from '../state';
import { runMoves } from '../sim';
import { DEFAULT_ENEMY, DEFAULT_HERO } from '../defs';

function startBoard() {
  return boardFromStrings([
    'ABAC',
    'AAAC',
    'BCDE',
    'CDEF',
  ]);
}

describe('combat determinism', () => {
  it('same seed + same swaps => same outcome (hp + board)', () => {
    const stateA = initCombatState({ hero: DEFAULT_HERO, enemy: DEFAULT_ENEMY, board: startBoard(), rngState: 777 });
    const stateB = initCombatState({ hero: DEFAULT_HERO, enemy: DEFAULT_ENEMY, board: startBoard(), rngState: 777 });

    const moves: Array<[{ x: number; y: number }, { x: number; y: number }]> = [
      [{ x: 1, y: 0 }, { x: 1, y: 1 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }],
      [{ x: 1, y: 0 }, { x: 1, y: 1 }],
    ];

    const endA = runMoves(stateA, moves);
    const endB = runMoves(stateB, moves);

    expect(endA.hero.hp).toEqual(endB.hero.hp);
    expect(endA.enemy.hp).toEqual(endB.enemy.hp);
    expect(boardToString(endA.board)).toEqual(boardToString(endB.board));
  });
});
