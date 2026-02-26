import { describe, expect, it } from 'vitest';

import { boardFromStrings } from '../../match3/serialize';
import { initCombatState } from '../state';
import { resolvePlayerMove } from '../resolver';
import { DEFAULT_ENEMY, DEFAULT_HERO, DEFAULT_TILE_DEFS } from '../defs';

describe('harmful tiles', () => {
  it('matching harmful tiles damages hero, not enemy', () => {
    // 3x3 board; swap creates a horizontal match of 'C' on the top row.
    // Before swap:
    // row0: C C B
    // row1: A A C
    // After swapping (2,0) with (2,1):
    // row0: C C C  (match of harmful tile C)
    const board = boardFromStrings(['CCB', 'AAC', 'DEF']);

    const state0 = initCombatState({ hero: DEFAULT_HERO, enemy: DEFAULT_ENEMY, board, rngState: 123 });
    const res = resolvePlayerMove(state0, { x: 2, y: 0 }, { x: 2, y: 1 }, { tileDefs: DEFAULT_TILE_DEFS });

    expect(res.events.some((e) => e.type === 'DamageDealt' && e.target === 'hero' && e.source === 'tile:C')).toBe(true);
    expect(res.state.hero.hp).toBeLessThan(state0.hero.hp);
  });
});
