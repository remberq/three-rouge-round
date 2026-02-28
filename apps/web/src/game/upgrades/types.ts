import type { RunState } from '../run';

export type UpgradeId = string;

export type UpgradeDef = {
  id: UpgradeId;
  name: string;
  description: string;

  // Apply upgrade to the RunState (pure).
  apply: (state: RunState) => RunState;
};
