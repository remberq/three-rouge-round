import { describe, expect, it } from 'vitest';

import { applyEnemyAbilities } from '../abilities';
import { ENEMY_DEF_BY_ID } from '../defs';
import { initRunState } from '../../run';

describe('applyEnemyAbilities', () => {
  it('clawRage increases enemyClawWeight on EnemyAttack events', () => {
    const base = initRunState({ seed: 1, floorsCount: 5 });
    const mage = ENEMY_DEF_BY_ID['mage'];
    const s0 = { ...base, enemyDef: mage, config: { ...base.config, enemyClawWeight: 1 } };

    const s1 = applyEnemyAbilities(s0, [{ type: 'EnemyAttack', amount: 1, damageType: 'phys' }]);
    expect(s1.config.enemyClawWeight).toBe(2);
  });

  it('does nothing when no EnemyAttack', () => {
    const base = initRunState({ seed: 1, floorsCount: 5 });
    const mage = ENEMY_DEF_BY_ID['mage'];
    const s0 = { ...base, enemyDef: mage, config: { ...base.config, enemyClawWeight: 1 } };

    const s1 = applyEnemyAbilities(s0, [{ type: 'TurnEnded', turnCount: 1 }]);
    expect(s1.config.enemyClawWeight).toBe(1);
  });
});
