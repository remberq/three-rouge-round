import { describe, expect, it } from 'vitest';

import { selectEnemy } from '../select';

describe('selectEnemy', () => {
  it('is deterministic for same seed+floor', () => {
    const a = selectEnemy({ seed: 123, floorIndex: 0, floorsCount: 5 }).id;
    const b = selectEnemy({ seed: 123, floorIndex: 0, floorsCount: 5 }).id;
    expect(a).toBe(b);
  });

  it('returns boss on last floor', () => {
    const e = selectEnemy({ seed: 123, floorIndex: 4, floorsCount: 5 });
    expect(e.id).toBe('boss');
  });
});
