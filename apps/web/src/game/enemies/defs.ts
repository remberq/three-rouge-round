import type { EnemyDef } from '../combat';

export const ENEMY_DEFS = [
  {
    id: 'slime',
    name: 'Slime',
    baseStats: { hpMax: 40, atk: 8, armor: 0, matk: 0, marmor: 0 },
    attackEveryTurns: 3,
    attackPower: 7,
    attackType: 'phys',
  },
  {
    id: 'bandit',
    name: 'Bandit',
    baseStats: { hpMax: 28, atk: 12, armor: 1, matk: 0, marmor: 0 },
    attackEveryTurns: 2,
    attackPower: 9,
    attackType: 'phys',
  },
  {
    id: 'mage',
    name: 'Mage',
    baseStats: { hpMax: 26, atk: 6, armor: 0, matk: 12, marmor: 1 },
    attackEveryTurns: 2,
    attackPower: 9,
    attackType: 'magic',
  },
  {
    id: 'boss',
    name: 'Boss',
    baseStats: { hpMax: 80, atk: 14, armor: 2, matk: 0, marmor: 2 },
    attackEveryTurns: 2,
    attackPower: 12,
    attackType: 'phys',
  },
] satisfies EnemyDef[];

export const ENEMY_DEF_BY_ID: Record<string, EnemyDef> = Object.fromEntries(
  ENEMY_DEFS.map((d) => [d.id, d] as const),
);

export const BOSS_ENEMY_ID = 'boss' as const;
