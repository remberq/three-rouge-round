import type { CombatState, EnemyDef, HeroDef } from './types';
import type { Board } from '../match3';

export function makeHero(def: HeroDef) {
  const hpMax = def.baseStats.hpMax ?? 1;
  return { id: def.id, kind: 'hero' as const, baseStats: def.baseStats, mods: [], hp: hpMax };
}

export function makeEnemy(def: EnemyDef) {
  const hpMax = def.baseStats.hpMax ?? 1;
  return { id: def.id, kind: 'enemy' as const, baseStats: def.baseStats, mods: [], hp: hpMax };
}

export function initCombatState(params: {
  hero: HeroDef;
  enemy: EnemyDef;
  board: Board;
  rngState: number;
}): CombatState {
  return {
    hero: makeHero(params.hero),
    enemy: makeEnemy(params.enemy),
    board: params.board,
    rngState: params.rngState >>> 0,
    turnCount: 0,
    status: 'active',
  };
}
