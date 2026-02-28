import { createBoard, createRng } from '../match3';
import { DEFAULT_ENEMY, DEFAULT_HERO, initCombatState } from '../combat';
import type { RunConfig, RunState } from './types';

export const RUN_SCHEMA_VERSION = 1 as const;

export function defaultRunConfig(overrides: Partial<RunConfig> = {}): RunConfig {
  return {
    floorsCount: overrides.floorsCount ?? 5,
  };
}

export function makeEmptyRunState(): RunState {
  return {
    schemaVersion: RUN_SCHEMA_VERSION,
    seed: 0,
    config: defaultRunConfig(),
    screen: 'start',
    floorIndex: 0,
    combat: null,
    endResult: null,
    heroDef: DEFAULT_HERO,
    enemyDef: DEFAULT_ENEMY,
  };
}

export function initRunState(params: { seed: number; floorsCount?: number }): RunState {
  const config = defaultRunConfig({ floorsCount: params.floorsCount });

  return {
    schemaVersion: RUN_SCHEMA_VERSION,
    seed: params.seed,
    config,
    screen: 'battle',
    floorIndex: 0,
    combat: initFloorCombat({ seed: params.seed, floorIndex: 0, heroDef: DEFAULT_HERO, enemyDef: DEFAULT_ENEMY }),
    endResult: null,
    heroDef: DEFAULT_HERO,
    enemyDef: DEFAULT_ENEMY,
  };
}

export function initFloorCombat(params: {
  seed: number;
  floorIndex: number;
  heroDef: typeof DEFAULT_HERO;
  enemyDef: typeof DEFAULT_ENEMY;
}) {
  // NOTE: deterministic per floor. For MVP we just offset the seed.
  const rng = createRng((params.seed + params.floorIndex * 10_000) >>> 0);
  const board = createBoard(rng, { width: 8, height: 8, allowInitialMatches: false });

  return initCombatState({ hero: params.heroDef, enemy: params.enemyDef, board, rngState: rng.getState() });
}
