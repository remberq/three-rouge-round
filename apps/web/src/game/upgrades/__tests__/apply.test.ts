import { describe, expect, it } from 'vitest';

import { initRunState } from '../../run';
import { applyUpgrade } from '../apply';

describe('applyUpgrade', () => {
  it('applies hpMax upgrade', () => {
    const s0 = initRunState({ seed: 1, floorsCount: 5 });
    const before = s0.heroDef.baseStats.hpMax ?? 0;

    const s1 = applyUpgrade(s0, 'stat.hpMax+2');
    expect(s1.heroDef.baseStats.hpMax).toBe(before + 2);
  });

  it('unknown id returns state unchanged', () => {
    const s0 = initRunState({ seed: 1, floorsCount: 5 });
    const s1 = applyUpgrade(s0, 'nope');
    expect(s1).toEqual(s0);
  });

  it('clears stale endResult', () => {
    const s0 = initRunState({ seed: 1, floorsCount: 5 });
    const sEnded = { ...s0, screen: 'between' as const, endResult: 'victory' as const };
    const s1 = applyUpgrade(sEnded, 'stat.atk+1');
    expect(s1.endResult).toBeNull();
  });

  it('does not mutate original state', () => {
    const s0 = initRunState({ seed: 1, floorsCount: 5 });
    applyUpgrade(s0, 'stat.atk+1');
    expect(s0.heroDef.baseStats.atk).toBe(s0.heroDef.baseStats.atk);
  });
});
