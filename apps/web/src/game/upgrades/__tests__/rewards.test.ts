import { describe, expect, it } from 'vitest';

import { generateRewardChoices } from '../rewards';

const pool = [
  { id: 'a', name: 'a', description: 'a', apply: (s: unknown) => s as never },
  { id: 'b', name: 'b', description: 'b', apply: (s: unknown) => s as never },
  { id: 'c', name: 'c', description: 'c', apply: (s: unknown) => s as never },
  { id: 'd', name: 'd', description: 'd', apply: (s: unknown) => s as never },
] as const;

describe('generateRewardChoices', () => {
  it('returns exactly 3 unique choices by default', () => {
    const res = generateRewardChoices({ seed: 1, floorIndex: 0, pool });
    expect(res).toHaveLength(3);
    expect(new Set(res.map((x) => x.id)).size).toBe(3);
  });

  it('is deterministic for same seed+floor', () => {
    const a = generateRewardChoices({ seed: 123, floorIndex: 2, pool });
    const b = generateRewardChoices({ seed: 123, floorIndex: 2, pool });
    expect(a).toEqual(b);
  });

  it('different floorIndex is deterministic per floor', () => {
    const a0 = generateRewardChoices({ seed: 123, floorIndex: 0, pool });
    const a1 = generateRewardChoices({ seed: 123, floorIndex: 1, pool });

    // Not required to differ, but must be deterministic.
    expect(generateRewardChoices({ seed: 123, floorIndex: 0, pool })).toEqual(a0);
    expect(generateRewardChoices({ seed: 123, floorIndex: 1, pool })).toEqual(a1);
  });

  it('handles small pool by returning <= pool length', () => {
    const res = generateRewardChoices({ seed: 1, floorIndex: 0, pool: pool.slice(0, 2), count: 3 });
    expect(res).toHaveLength(2);
  });
});
