import { createBoard, createRng } from '../match3';
import { DEFAULT_HERO, initCombatState } from '../combat';
import { selectEnemy } from '../enemies';
import type { RunConfig, RunState } from './types';

export const RUN_SCHEMA_VERSION = 1 as const;

export function defaultRunConfig(overrides: Partial<RunConfig> = {}): RunConfig {
  return {
    floorsCount: overrides.floorsCount ?? 5,
    enemyClawWeight: overrides.enemyClawWeight ?? 1,
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
    enemyDef: selectEnemy({ seed: 0, floorIndex: 0, floorsCount: 5 }),
  };
}

export function initRunState(params: { seed: number; floorsCount?: number }): RunState {
  const config = defaultRunConfig({ floorsCount: params.floorsCount });

  const heroDef = DEFAULT_HERO;
  const enemyDef = selectEnemy({ seed: params.seed, floorIndex: 0, floorsCount: config.floorsCount });

  return {
    schemaVersion: RUN_SCHEMA_VERSION,
    seed: params.seed,
    config,
    screen: 'battle',
    floorIndex: 0,
    combat: initFloorCombat({
      seed: params.seed,
      floorIndex: 0,
      floorsCount: config.floorsCount,
      enemyClawWeight: config.enemyClawWeight,
      heroDef,
    }),
    endResult: null,
    heroDef,
    enemyDef,
  };
}

export function initFloorCombat(params: {
  seed: number;
  floorIndex: number;
  floorsCount: number;
  enemyClawWeight: number;
  heroDef: typeof DEFAULT_HERO;
}) {
  // NOTE: deterministic per floor. For MVP we just offset the seed.
  const rng = createRng((params.seed + params.floorIndex * 10_000) >>> 0);
  const enemyDef = selectEnemy({ seed: params.seed, floorIndex: params.floorIndex, floorsCount: params.floorsCount });

  // Enemy tile weight modifiers (MVP: only enemyClaw/C).
  const tileWeights = {
    C: params.enemyClawWeight,
    ...(enemyDef.tileWeights ?? {}),
  };

  const board = createBoard(rng, {
    width: 8,
    height: 8,
    allowInitialMatches: false,
    tileWeights,
  });

  return initCombatState({ hero: params.heroDef, enemy: enemyDef, board, rngState: rng.getState() });
}
