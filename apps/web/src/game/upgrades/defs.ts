import type { UpgradeDef } from './types';

export const UPGRADE_DEFS = [
  {
    id: 'stat.hpMax+2',
    name: '+2 Max HP',
    description: 'Increase max HP by 2.',
    apply: (s) => ({
      ...s,
      heroDef: {
        ...s.heroDef,
        baseStats: {
          ...s.heroDef.baseStats,
          hpMax: (s.heroDef.baseStats.hpMax ?? 0) + 2,
        },
      },
    }),
  },
  {
    id: 'stat.atk+1',
    name: '+1 ATK',
    description: 'Increase attack by 1.',
    apply: (s) => ({
      ...s,
      heroDef: {
        ...s.heroDef,
        baseStats: {
          ...s.heroDef.baseStats,
          atk: (s.heroDef.baseStats.atk ?? 0) + 1,
        },
      },
    }),
  },
  {
    id: 'stat.armor+1',
    name: '+1 Armor',
    description: 'Increase armor by 1.',
    apply: (s) => ({
      ...s,
      heroDef: {
        ...s.heroDef,
        baseStats: {
          ...s.heroDef.baseStats,
          armor: (s.heroDef.baseStats.armor ?? 0) + 1,
        },
      },
    }),
  },
  {
    id: 'stat.marmor+1',
    name: '+1 Magic Armor',
    description: 'Increase magic armor by 1.',
    apply: (s) => ({
      ...s,
      heroDef: {
        ...s.heroDef,
        baseStats: {
          ...s.heroDef.baseStats,
          marmor: (s.heroDef.baseStats.marmor ?? 0) + 1,
        },
      },
    }),
  },
] satisfies UpgradeDef[];

export const UPGRADE_DEF_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(
  UPGRADE_DEFS.map((d) => [d.id, d] as const),
);
