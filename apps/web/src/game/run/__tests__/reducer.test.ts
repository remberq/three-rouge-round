import { describe, expect, it } from 'vitest';

import { initRunState, makeEmptyRunState } from '../state';
import { runReducer } from '../reducer';

describe('runReducer', () => {
  it('NewRun -> battle on floor 0', () => {
    const s0 = makeEmptyRunState();
    const s1 = runReducer(s0, { type: 'NewRun', seed: 123, floorsCount: 5 });

    expect(s1.screen).toBe('battle');
    expect(s1.floorIndex).toBe(0);
    expect(s1.seed).toBe(123);
    expect(s1.combat).not.toBeNull();
  });

  it('BattleEnded(won) -> between (non-last floor)', () => {
    const s0 = initRunState({ seed: 1, floorsCount: 5 });
    const s1 = runReducer(s0, { type: 'BattleEnded', result: 'won' });
    expect(s1.screen).toBe('between');
  });

  it('BattleEnded(won) -> victory on last floor', () => {
    const s0 = initRunState({ seed: 1, floorsCount: 1 });
    const s1 = runReducer(s0, { type: 'BattleEnded', result: 'won' });
    expect(s1.screen).toBe('end');
    expect(s1.endResult).toBe('victory');
  });

  it('BattleEnded(lost) -> defeat', () => {
    const s0 = initRunState({ seed: 1, floorsCount: 5 });
    const s1 = runReducer(s0, { type: 'BattleEnded', result: 'lost' });
    expect(s1.screen).toBe('end');
    expect(s1.endResult).toBe('defeat');
  });
});
