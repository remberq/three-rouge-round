import type { CombatState, EnemyDef, HeroDef } from '../combat';

export type RunScreen = 'start' | 'battle' | 'reward' | 'between' | 'end';

export type RunEndResult = 'victory' | 'defeat';

export type RunConfig = {
  floorsCount: number;

  // EP-0006.2: base weight for enemyClaw tile (C)
  enemyClawWeight: number;

  // EP-0007: enemy scaling
  enemyPerFloorMultiplier: number;
  bossMultiplier: number;
};

export type RunState = {
  schemaVersion: 1;

  seed: number;
  config: RunConfig;

  screen: RunScreen;

  // 0-based
  floorIndex: number;

  // Current battle (present when screen is battle; may be kept around for debug)
  combat: CombatState | null;

  endResult: RunEndResult | null;

  // Data hooks for later EPs
  heroDef: HeroDef;
  enemyDef: EnemyDef;
};

export type RunAction =
  | { type: 'NewRun'; seed: number; floorsCount?: number }
  | { type: 'ContinueRunLoaded'; state: RunState }
  | { type: 'ResetRun' }
  | { type: 'StartBattle' }
  | { type: 'BattleEnded'; result: 'won' | 'lost' }
  | { type: 'UpgradeChosen'; upgradeId: string }
  | { type: 'NextFloor' };
