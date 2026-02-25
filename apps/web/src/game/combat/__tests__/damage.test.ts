import { describe, expect, it } from 'vitest';

import { applyDamage, mitigateDamage } from '../stats';
import type { Entity } from '../types';

describe('combat damage', () => {
  it('armor reduces phys damage', () => {
    const hero: Entity = { id: 'h', kind: 'hero', baseStats: { armor: 100 }, mods: [], hp: 100 };
    const { amount } = applyDamage(hero, 50, 'phys');
    // 50 * (100/(200)) = 25
    expect(amount).toBe(25);
  });

  it('marmor reduces magic damage', () => {
    const hero: Entity = { id: 'h', kind: 'hero', baseStats: { marmor: 100 }, mods: [], hp: 100 };
    const { amount } = applyDamage(hero, 50, 'magic');
    expect(amount).toBe(25);
  });

  it('minimum 1 damage if raw > 0', () => {
    expect(mitigateDamage(1, 10_000)).toBe(1);
  });
});
