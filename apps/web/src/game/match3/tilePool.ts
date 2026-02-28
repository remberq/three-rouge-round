import type { Rng } from './rng';
import type { TileId, TileWeights } from './types';

export function pickWeightedTile(rng: Rng, candidates: readonly TileId[], weights: TileWeights | undefined): TileId {
  if (candidates.length === 0) throw new Error('pickWeightedTile: empty candidates');
  if (!weights) return candidates[rng.nextInt(candidates.length)];

  let total = 0;
  const ws = candidates.map((t) => {
    const w = weights[t] ?? 1;
    const ww = Number.isFinite(w) && w > 0 ? w : 0;
    total += ww;
    return ww;
  });

  if (total <= 0) return candidates[rng.nextInt(candidates.length)];

  let r = rng.nextFloat() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= ws[i];
    if (r <= 0) return candidates[i];
  }

  return candidates[candidates.length - 1];
}
