import { createRng } from '../match3';
import { BOSS_ENEMY_ID, ENEMY_DEFS, ENEMY_DEF_BY_ID } from './defs';
import type { EnemyDef } from '../combat';

export function selectEnemy(params: {
  seed: number;
  floorIndex: number;
  floorsCount: number;
}): EnemyDef {
  const { seed, floorIndex, floorsCount } = params;

  // Boss on last floor.
  if (floorIndex >= floorsCount - 1) {
    return ENEMY_DEF_BY_ID[BOSS_ENEMY_ID];
  }

  const roster = ENEMY_DEFS.filter((e) => e.id !== BOSS_ENEMY_ID);

  const rng = createRng((seed + floorIndex * 97_133) >>> 0);
  const idx = rng.nextInt(roster.length);
  return roster[idx];
}
