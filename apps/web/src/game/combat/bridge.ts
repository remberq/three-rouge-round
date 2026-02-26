import type { MatchGroup, SwapResult, TileId } from '../match3';
import type { CombatEvent, DamageType, EntityKind, TileDef } from './types';
import { getTileDef } from './defs';

export type BridgeConfig = {
  tileDefs: Record<string, TileDef>;
};

function powerForGroup(def: TileDef, len: number): number {
  return def.basePower + def.perExtra * Math.max(0, len - 3);
}

export function eventsForMatchGroups(groups: MatchGroup[], cfg: BridgeConfig): CombatEvent[] {
  const out: CombatEvent[] = [];

  for (const g of groups) {
    const def = getTileDef(cfg.tileDefs, g.tile as TileId);
    if (!def.damageType) continue;

    const raw = powerForGroup(def, g.length);
    const target: EntityKind = def.harmfulToHero ? 'hero' : 'enemy';
    out.push({
      type: 'DamageDealt',
      target,
      amount: raw,
      damageType: def.damageType as DamageType,
      source: `tile:${def.id}`,
    });
  }

  return out;
}

export function eventsForSwapResult(result: SwapResult, cfg: BridgeConfig): CombatEvent[] {
  if (!result.ok) return [];
  const out: CombatEvent[] = [];

  // Step 0: primary matches after swap
  out.push({ type: 'MatchStepResolved', stepIndex: 0, groups: result.matches });
  out.push(...eventsForMatchGroups(result.matches, cfg));

  // Cascades are already captured as steps including matches.
  for (let i = 0; i < result.cascades.length; i++) {
    const step = result.cascades[i];
    const stepIndex = i + 1;
    out.push({ type: 'MatchStepResolved', stepIndex, groups: step.matches });
    out.push(...eventsForMatchGroups(step.matches, cfg));
  }

  return out;
}
