import type { RunState } from '../run';
import { UPGRADE_DEF_BY_ID } from './defs';

export function applyUpgrade(state: RunState, upgradeId: string): RunState {
  const def = UPGRADE_DEF_BY_ID[upgradeId];
  if (!def) return state;

  // Clear any stale terminal flag when applying upgrades to an ongoing run.
  // (Prevents StartBattle guard from soft-locking progression.)
  const next = def.apply(state);
  return { ...next, endResult: null };
}
