import type { DamageType, Entity, Modifier, StatId, Stats } from './types';

export function getBaseStat(base: Stats, stat: StatId): number {
  return base[stat] ?? 0;
}

export function getStat(entity: Entity, stat: StatId): number {
  let value = getBaseStat(entity.baseStats, stat);

  // Apply flats first
  for (const m of entity.mods) {
    if (m.stat !== stat) continue;
    if (m.kind === 'flat') value += m.value;
  }

  // Then mults
  for (const m of entity.mods) {
    if (m.stat !== stat) continue;
    if (m.kind === 'mult') value *= m.value;
  }

  return value;
}

export function getArmorStatId(dmg: DamageType): StatId {
  return dmg === 'phys' ? 'armor' : 'marmor';
}

export function mitigateDamage(raw: number, armor: number): number {
  if (raw <= 0) return 0;
  const mitigated = Math.floor(raw * (100 / (100 + armor)));
  return Math.max(1, mitigated);
}

export function applyDamage(target: Entity, raw: number, damageType: DamageType): { amount: number; next: Entity } {
  const armor = getStat(target, getArmorStatId(damageType));
  const amount = mitigateDamage(raw, armor);
  const nextHp = Math.max(0, target.hp - amount);
  return { amount, next: { ...target, hp: nextHp } };
}

export function applyModifier(entity: Entity, mod: Modifier): Entity {
  return { ...entity, mods: [...entity.mods, mod] };
}
