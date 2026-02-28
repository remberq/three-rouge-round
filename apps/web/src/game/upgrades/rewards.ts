import { createRng } from '../match3';
import { UPGRADE_DEFS } from './defs';
import type { UpgradeDef, UpgradeId } from './types';

export type RewardChoice = {
  id: UpgradeId;
};

export type RewardGenParams = {
  seed: number;
  floorIndex: number;
  count?: number;

  // Override pool for tests.
  pool?: readonly UpgradeDef[];
};

export function generateRewardChoices(params: RewardGenParams): RewardChoice[] {
  const count = params.count ?? 3;
  const pool = params.pool ?? UPGRADE_DEFS;
  if (count <= 0) return [];
  if (pool.length === 0) return [];

  // Deterministic RNG derived from run seed + floor index.
  const rng = createRng((params.seed + params.floorIndex * 1_000_003) >>> 0);

  // Sample without replacement.
  const choices: RewardChoice[] = [];
  const available = pool.map((d) => d.id);

  while (choices.length < count && available.length > 0) {
    const idx = rng.nextInt(available.length);
    const id = available.splice(idx, 1)[0];
    choices.push({ id });
  }

  return choices;
}
