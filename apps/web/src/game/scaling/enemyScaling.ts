import type { EnemyDef } from '../combat';

export type EnemyScalingConfig = {
  // Multiplier per floor (e.g. 0.12 => +12% per floor)
  perFloorMultiplier: number;
  bossMultiplier: number;

  // Round strategy: 'floor' to keep integers
  rounding?: 'floor' | 'round' | 'ceil';
};

function round(n: number, mode: EnemyScalingConfig['rounding']): number {
  switch (mode) {
    case 'ceil':
      return Math.ceil(n);
    case 'round':
      return Math.round(n);
    case 'floor':
    default:
      return Math.floor(n);
  }
}

export function scaleEnemyDef(params: {
  enemy: EnemyDef;
  floorIndex: number;
  floorsCount: number;
  cfg: EnemyScalingConfig;
  isBoss?: boolean;
}): EnemyDef {
  const { enemy, floorIndex, cfg } = params;

  const f = Math.max(0, floorIndex);
  const mult = 1 + cfg.perFloorMultiplier * f;
  const bossMult = params.isBoss ? cfg.bossMultiplier : 1;
  const m = mult * bossMult;

  const rounding = cfg.rounding ?? 'floor';

  const hpMax0 = enemy.baseStats.hpMax ?? 0;
  const atk0 = enemy.baseStats.atk ?? 0;

  return {
    ...enemy,
    baseStats: {
      ...enemy.baseStats,
      hpMax: round(hpMax0 * m, rounding),
      atk: round(atk0 * m, rounding),
    },
    // Keep attack cadence; scale power slightly.
    attackPower: round(enemy.attackPower * m, rounding),
  };
}
