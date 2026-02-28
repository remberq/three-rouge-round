import { describe, expect, it } from 'vitest';

import { ENEMY_DEF_BY_ID } from '../../enemies';
import { scaleEnemyDef } from '../enemyScaling';

describe('scaleEnemyDef', () => {
  const cfg = { perFloorMultiplier: 0.2, bossMultiplier: 1.5, rounding: 'floor' as const };

  it('is deterministic', () => {
    const e = ENEMY_DEF_BY_ID['slime'];
    const a = scaleEnemyDef({ enemy: e, floorIndex: 2, floorsCount: 5, cfg });
    const b = scaleEnemyDef({ enemy: e, floorIndex: 2, floorsCount: 5, cfg });
    expect(a).toEqual(b);
  });

  it('scales up with floors', () => {
    const e = ENEMY_DEF_BY_ID['slime'];
    const f0 = scaleEnemyDef({ enemy: e, floorIndex: 0, floorsCount: 5, cfg });
    const f4 = scaleEnemyDef({ enemy: e, floorIndex: 4, floorsCount: 5, cfg });
    expect(f4.baseStats.hpMax ?? 0).toBeGreaterThanOrEqual(f0.baseStats.hpMax ?? 0);
    expect(f4.baseStats.atk ?? 0).toBeGreaterThanOrEqual(f0.baseStats.atk ?? 0);
  });

  it('boss uses boss multiplier', () => {
    const e = ENEMY_DEF_BY_ID['boss'];
    const a = scaleEnemyDef({ enemy: e, floorIndex: 4, floorsCount: 5, cfg, isBoss: true });
    const b = scaleEnemyDef({ enemy: e, floorIndex: 4, floorsCount: 5, cfg, isBoss: false });
    expect(a.baseStats.hpMax ?? 0).toBeGreaterThan(b.baseStats.hpMax ?? 0);
  });
});
