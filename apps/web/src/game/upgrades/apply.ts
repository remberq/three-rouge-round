import type { RunState } from '../run';
import { UPGRADE_DEF_BY_ID } from './defs';

export function applyUpgrade(state: RunState, upgradeId: string): RunState {
  const def = UPGRADE_DEF_BY_ID[upgradeId];
  if (!def) return state;

  // Ensure we don't keep a stale endResult if applying upgrades between fights.
  const next = def.apply(state);
  return { ...next, endResult: next.endResult };
}
