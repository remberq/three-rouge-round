import type { EnemyDef, HeroDef, TileDef } from './types';
import type { TileId } from '../match3';

export const DEFAULT_HERO: HeroDef = {
  id: 'hero',
  baseStats: { hpMax: 30, atk: 10, armor: 0, matk: 0, marmor: 0 },
};

export const DEFAULT_ENEMY: EnemyDef = {
  id: 'slime',
  name: 'Slime',
  baseStats: { hpMax: 40, atk: 8, armor: 0, matk: 0, marmor: 0 },
  attackEveryTurns: 3,
  attackPower: 7,
  attackType: 'phys',
};

// Keep TileId as A..F for now; map to combat meaning here.
// A: phys -> enemy
// B: magic -> enemy
// C: harmful (phys) -> hero
// D: phys -> enemy
// E: magic -> enemy
// F: phys -> enemy
export const DEFAULT_TILE_DEFS: Record<TileId, TileDef> = {
  A: { id: 'A', damageType: 'phys', basePower: 6, perExtra: 2 },
  B: { id: 'B', damageType: 'magic', basePower: 6, perExtra: 2 },
  C: { id: 'C', damageType: 'phys', basePower: 5, perExtra: 2, harmfulToHero: true, tags: ['enemy'] },
  D: { id: 'D', damageType: 'phys', basePower: 5, perExtra: 2 },
  E: { id: 'E', damageType: 'magic', basePower: 5, perExtra: 2 },
  F: { id: 'F', damageType: 'phys', basePower: 4, perExtra: 1 },
};

export function getTileDef(defs: Record<string, TileDef>, tile: TileId): TileDef {
  const d = defs[tile];
  if (!d) throw new Error(`Missing TileDef for ${tile}`);
  return d;
}
