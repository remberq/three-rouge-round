import type { RunAction, RunState } from './types';
import { initFloorCombat, initRunState, makeEmptyRunState, selectRunEnemyDef } from './state';
import { DEFAULT_HERO } from '../combat';
import { applyUpgrade } from '../upgrades';

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'NewRun': {
      return initRunState({ seed: action.seed, floorsCount: action.floorsCount });
    }

    case 'ContinueRunLoaded': {
      return action.state;
    }

    case 'ResetRun': {
      return makeEmptyRunState();
    }

    case 'StartBattle': {
      if (state.endResult) return state;

      const enemyDef = selectRunEnemyDef({
        seed: state.seed,
        floorIndex: state.floorIndex,
        floorsCount: state.config.floorsCount,
        enemyPerFloorMultiplier: state.config.enemyPerFloorMultiplier,
        bossMultiplier: state.config.bossMultiplier,
      });

      const combat = initFloorCombat({
        seed: state.seed,
        floorIndex: state.floorIndex,
        floorsCount: state.config.floorsCount,
        enemyClawWeight: state.config.enemyClawWeight,
        enemyPerFloorMultiplier: state.config.enemyPerFloorMultiplier,
        bossMultiplier: state.config.bossMultiplier,
        heroDef: DEFAULT_HERO,
      });

      return {
        ...state,
        screen: 'battle',
        combat,
        enemyDef,
      };
    }

    case 'BattleEnded': {
      if (action.result === 'lost') {
        return { ...state, screen: 'end', endResult: 'defeat' };
      }

      // won
      const isLastFloor = state.floorIndex >= state.config.floorsCount - 1;
      if (isLastFloor) {
        return { ...state, screen: 'end', endResult: 'victory' };
      }

      return { ...state, screen: 'reward' };
    }

    case 'UpgradeChosen': {
      // Apply upgrade and proceed to between-fights.
      const next = applyUpgrade(state, action.upgradeId);
      return { ...next, screen: 'between' };
    }

    case 'NextFloor': {
      const nextFloorIndex = Math.min(state.floorIndex + 1, state.config.floorsCount - 1);
      const enemyDef = selectRunEnemyDef({
        seed: state.seed,
        floorIndex: nextFloorIndex,
        floorsCount: state.config.floorsCount,
        enemyPerFloorMultiplier: state.config.enemyPerFloorMultiplier,
        bossMultiplier: state.config.bossMultiplier,
      });

      return {
        ...state,
        floorIndex: nextFloorIndex,
        enemyDef,
        screen: 'battle',
        combat: initFloorCombat({
          seed: state.seed,
          floorIndex: nextFloorIndex,
          floorsCount: state.config.floorsCount,
          enemyClawWeight: state.config.enemyClawWeight,
          enemyPerFloorMultiplier: state.config.enemyPerFloorMultiplier,
          bossMultiplier: state.config.bossMultiplier,
          heroDef: DEFAULT_HERO,
        }),
      };
    }

    default: {
      return state;
    }
  }
}
